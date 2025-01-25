import { draftEmail } from '../../services/gmail/drafts.js';
import { DraftEmailArgs, MessageResponse } from '../../services/gmail/types.js';

// Type guard function with corrected type predicate
function isDraftEmailArgs(args: unknown): args is DraftEmailArgs {
  if (typeof args !== 'object' || args === null) return false;
  const a = args as any;
  return Array.isArray(a.to) && 
         typeof a.subject === 'string' && 
         typeof a.body === 'string';
}

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
  return await draftEmail(args);
}