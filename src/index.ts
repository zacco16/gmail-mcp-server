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

  // Get message body
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

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [LIST_MESSAGES_TOOL, READ_MESSAGE_TOOL]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args = {} } = request.params;

    switch (name) {
      case "list":
        return await listMessages(args as ListMessagesArgs);
      case "read": {
        // Check for messageId before type assertion
        if (typeof args?.messageId !== 'string') {
          throw new Error("messageId is required and must be a string");
        }
        return await readMessage({ messageId: args.messageId });
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