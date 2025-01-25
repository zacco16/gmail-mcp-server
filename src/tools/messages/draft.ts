import { GmailService } from '../../services/gmail.js';
import { DraftEmailArgs, isDraftEmailArgs, MessageResponse } from '../../types/gmail.js';

export const DRAFT_EMAIL_TOOL = {
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

export async function handleDraftEmail(args: Record<string, unknown>): Promise<MessageResponse> {
  if (!isDraftEmailArgs(args)) {
    throw new Error("Invalid draft email arguments. Required: to (array), subject (string), body (string)");
  }
  return await GmailService.draftEmail(args);
}