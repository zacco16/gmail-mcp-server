export const EMAIL_TOOLS = {
  listEmails: {
    name: "listEmails",
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
          items: { type: "string" },
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
  },

  readEmail: {
    name: "readEmail",
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
  },

  draftEmail: {
    name: "draftEmail",
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
  },

  sendEmail: {
    name: "sendEmail",
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
  }
} as const;

export type EmailToolNames = keyof typeof EMAIL_TOOLS;