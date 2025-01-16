#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

// Type definitions
interface ListMessagesArgs {
  maxResults?: number;
  labelIds?: string[];
  query?: string;
  verbose?: boolean;
}

interface ReadMessageArgs {
  messageId: string;
}

interface DraftEmailArgs extends Record<string, unknown> {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  isHtml?: boolean;
}

interface SendEmailArgs extends DraftEmailArgs {
  draftId?: string;
}

interface EmailValidationResult {
  valid: boolean;
  error?: string;
}

// Initialize OAuth client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Set credentials with refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

// Initialize Gmail API
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Server definition
const server = new Server(
  {
    name: "gmail-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
const LIST_MESSAGES_TOOL = {
  name: "list",
  description: "List Gmail messages",
  inputSchema: {
    type: "object",
    properties: {
      maxResults: {
        type: "number",
        description: "Maximum number of messages to return (default: 10)"
      },
      labelIds: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Label IDs to filter by (e.g., ['INBOX'])"
      },
      query: {
        type: "string",
        description: "Gmail search query (e.g., 'in:inbox', 'is:unread')"
      },
      verbose: {
        type: "boolean",
        description: "Whether to show full message details (default: false)"
      }
    }
  }
};

const READ_MESSAGE_TOOL = {
  name: "read",
  description: "Read a specific Gmail message",
  inputSchema: {
    type: "object",
    properties: {
      messageId: {
        type: "string",
        description: "ID of the message to read"
      }
    },
    required: ["messageId"]
  }
};

const DRAFT_EMAIL_TOOL = {
  name: "draft",
  description: "Create a Gmail draft message",
  inputSchema: {
    type: "object",
    properties: {
      to: {
        type: "array",
        items: { type: "string" },
        description: "Array of recipient email addresses"
      },
      cc: {
        type: "array",
        items: { type: "string" },
        description: "Array of CC recipient email addresses"
      },
      bcc: {
        type: "array",
        items: { type: "string" },
        description: "Array of BCC recipient email addresses"
      },
      subject: {
        type: "string",
        description: "Email subject line"
      },
      body: {
        type: "string",
        description: "Email body content"
      },
      isHtml: {
        type: "boolean",
        description: "Whether body content is HTML (default: false)"
      }
    },
    required: ["to", "subject", "body"]
  }
};

const SEND_EMAIL_TOOL = {
  name: "send",
  description: "Send a Gmail message",
  inputSchema: {
    type: "object",
    properties: {
      to: {
        type: "array",
        items: { type: "string" },
        description: "Array of recipient email addresses"
      },
      cc: {
        type: "array",
        items: { type: "string" },
        description: "Array of CC recipient email addresses"
      },
      bcc: {
        type: "array",
        items: { type: "string" },
        description: "Array of BCC recipient email addresses"
      },
      subject: {
        type: "string",
        description: "Email subject line"
      },
      body: {
        type: "string",
        description: "Email body content"
      },
      isHtml: {
        type: "boolean",
        description: "Whether body content is HTML (default: false)"
      },
      draftId: {
        type: "string",
        description: "ID of draft email to send (optional)"
      }
    },
    required: ["to", "subject", "body"]
  }
};

// Helper functions
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateEmailArgs(args: DraftEmailArgs): EmailValidationResult {
  const MAX_RECIPIENTS = 500;
  const MAX_MESSAGE_SIZE = 25 * 1024 * 1024; // 25MB

  const allRecipients = [
    ...(args.to || []),
    ...(args.cc || []),
    ...(args.bcc || [])
  ];

  if (allRecipients.length > MAX_RECIPIENTS) {
    return {
      valid: false,
      error: `Too many recipients. Maximum is ${MAX_RECIPIENTS}`
    };
  }

  for (const email of allRecipients) {
    if (!validateEmail(email)) {
      return {
        valid: false,
        error: `Invalid email format: ${email}`
      };
    }
  }

  const messageSize = Buffer.from(args.body).length;
  if (messageSize > MAX_MESSAGE_SIZE) {
    return {
      valid: false,
      error: 'Message size exceeds 25MB limit'
    };
  }

  return { valid: true };
}

function createRawMessage(args: DraftEmailArgs): string {
  const headers = [
    `To: ${args.to.join(', ')}`,
    args.cc?.length ? `Cc: ${args.cc.join(', ')}` : null,
    args.bcc?.length ? `Bcc: ${args.bcc.join(', ')}` : null,
    `Subject: ${args.subject}`,
    `Content-Type: ${args.isHtml ? 'text/html' : 'text/plain'}; charset=utf-8`,
  ].filter(Boolean).join('\r\n');

  const email = `${headers}\r\n\r\n${args.body}`;
  return Buffer.from(email).toString('base64url');
}

// Type guards
function isDraftEmailArgs(args: Record<string, unknown>): args is DraftEmailArgs {
  const a = args as Partial<DraftEmailArgs>;
  return (
    Array.isArray(a.to) &&
    a.to.length > 0 &&
    typeof a.subject === 'string' &&
    typeof a.body === 'string' &&
    (a.cc === undefined || Array.isArray(a.cc)) &&
    (a.bcc === undefined || Array.isArray(a.bcc)) &&
    (a.isHtml === undefined || typeof a.isHtml === 'boolean')
  );
}

function isSendEmailArgs(args: Record<string, unknown>): args is SendEmailArgs {
  return (
    isDraftEmailArgs(args) &&
    (args.draftId === undefined || typeof args.draftId === 'string')
  );
}

// Tool handlers
async function listMessages({ maxResults = 10, labelIds, query, verbose = false }: ListMessagesArgs) {
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      ...(labelIds && { labelIds }),
      ...(query && { q: query })
    });

    const messages = response.data.messages || [];
    const messageDetails = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!
        });
        return {
          id: detail.data.id,
          subject: detail.data.payload?.headers?.find(h => h.name?.toLowerCase() === 'subject')?.value || '(no subject)',
          from: detail.data.payload?.headers?.find(h => h.name?.toLowerCase() === 'from')?.value,
          snippet: detail.data.snippet
        };
      })
    );

    if (verbose) {
      return {
        content: [{ 
          type: "text", 
          text: messageDetails.map(msg => 
            `ID: ${msg.id}\nFrom: ${msg.from}\nSubject: ${msg.subject}\nSnippet: ${msg.snippet}\n`
          ).join('\n---\n')
        }]
      };
    } else {
      return {
        content: [{ 
          type: "text", 
          text: messageDetails.map((msg, index) => 
            `${index + 1}. ${msg.subject} (ID: ${msg.id})`
          ).join('\n')
        }]
      };
    }
  } catch (error) {
    console.error('List messages error:', error);
    throw error;
  }
}

async function readMessage({ messageId }: ReadMessageArgs) {
  const response = await gmail.users.messages.get({
    userId: 'me',
    id: messageId
  });

  const headers = response.data.payload?.headers;
  const subject = headers?.find(h => h.name?.toLowerCase() === 'subject')?.value;
  const from = headers?.find(h => h.name?.toLowerCase() === 'from')?.value;
  const date = headers?.find(h => h.name?.toLowerCase() === 'date')?.value;

  let body = '';
  if (response.data.payload?.body?.data) {
    body = Buffer.from(response.data.payload.body.data, 'base64').toString('utf-8');
  } else if (response.data.payload?.parts) {
    const textPart = response.data.payload.parts.find(part => 
      part.mimeType === 'text/plain' || part.mimeType === 'text/html'
    );
    if (textPart?.body?.data) {
      body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
    }
  }

  return {
    content: [{ 
      type: "text", 
      text: `From: ${from}\nDate: ${date}\nSubject: ${subject}\n\n${body}`
    }]
  };
}

async function draftEmail(args: DraftEmailArgs) {
  try {
    const validation = validateEmailArgs(args);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const message = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: createRawMessage(args)
        }
      }
    });

    return {
      content: [{
        type: "text",
        text: `Draft created with ID: ${message.data.id || 'unknown'}`
      }]
    };
  } catch (error) {
    console.error('Draft email error:', error);
    throw error;
  }
}

async function sendEmail(args: SendEmailArgs) {
  try {
    if (args.draftId) {
      const message = await gmail.users.drafts.send({
        userId: 'me',
        requestBody: {
          id: args.draftId
        }
      });
      return {
        content: [{
          type: "text",
          text: `Draft sent with message ID: ${message.data.id}`
        }]
      };
    } else {
      const validation = validateEmailArgs(args);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const message = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: createRawMessage(args)
        }
      });
      return {
        content: [{
          type: "text",
          text: `Message sent with ID: ${message.data.id}`
        }]
      };
    }
  } catch (error) {
    console.error('Send email error:', error);
    throw error;
  }
}

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [LIST_MESSAGES_TOOL, READ_MESSAGE_TOOL, DRAFT_EMAIL_TOOL, SEND_EMAIL_TOOL]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args = {} } = request.params;

    switch (name) {
      case "list":
        return await listMessages(args as ListMessagesArgs);
      case "read": {
        if (typeof args?.messageId !== 'string') {
          throw new Error("messageId is required and must be a string");
        }
        return await readMessage({ messageId: args.messageId });
      }
      case "draft": {
        if (!isDraftEmailArgs(args)) {
          throw new Error("Invalid draft email arguments. Required: to (array), subject (string), body (string)");
        }
        return await draftEmail(args);
      }
      case "send": {
        if (!isSendEmailArgs(args)) {
          throw new Error("Invalid send email arguments. Required: to (array), subject (string), body (string)");
        }
        return await sendEmail(args);
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error('Tool call error:', error);
    return {
      content: [{
        type: "text",
        text: `Error: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
});

// Start server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Gmail MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});