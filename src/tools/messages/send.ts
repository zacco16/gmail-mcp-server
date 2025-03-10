import { sendEmail } from '../../services/gmail/send.js';
import { SendEmailArgs, MessageResponse } from '../../services/gmail/types.js';

// Type guard function with corrected type predicate
function isSendEmailArgs(args: unknown): args is SendEmailArgs {
  if (typeof args !== 'object' || args === null) return false;
  const a = args as any;
  return Array.isArray(a.to) && 
         typeof a.subject === 'string' && 
         typeof a.body === 'string';
}

export const SEND_EMAIL_TOOL = {
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
};

export async function handleSendEmail(args: Record<string, unknown>): Promise<MessageResponse> {
  if (!isSendEmailArgs(args)) {
    throw new Error("Invalid send email arguments. Required: to (array), subject (string), body (string)");
  }
  return await sendEmail(args);
}