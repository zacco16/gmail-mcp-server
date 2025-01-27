import { updateDraft } from '../../services/gmail/drafts.js';
import { UpdateDraftArgs, MessageResponse } from '../../types/gmail.js';

export const UPDATE_DRAFT_TOOL = {
  name: "updateDraft",
  description: "Update an existing Gmail draft message",
  inputSchema: {
    type: "object",
    properties: {
      draftId: {
        type: "string",
        description: "ID of the draft to update"
      },
      to: {
        type: "array",
        items: { type: "string" },
        description: "New recipient email addresses"
      },
      cc: {
        type: "array",
        items: { type: "string" },
        description: "New CC recipients"
      },
      bcc: {
        type: "array",
        items: { type: "string" },
        description: "New BCC recipients"
      },
      subject: {
        type: "string",
        description: "New subject line"
      },
      body: {
        type: "string",
        description: "New email body content"
      },
      isHtml: {
        type: "boolean",
        description: "Whether body content is HTML"
      }
    },
    required: ["draftId"]
  }
};

export async function handleUpdateDraft(args: Record<string, unknown>): Promise<MessageResponse> {
  try {
    const typedArgs: UpdateDraftArgs = {
      draftId: args.draftId as string,
      to: args.to ? (args.to as string[]) : undefined,
      cc: args.cc ? (args.cc as string[]) : undefined,
      bcc: args.bcc ? (args.bcc as string[]) : undefined,
      subject: args.subject ? (args.subject as string) : undefined,
      body: args.body ? (args.body as string) : undefined,
      // Explicitly set isHtml to false if not provided
      isHtml: args.isHtml !== undefined ? (args.isHtml as boolean) : 
              (args.body ? false : undefined)
    };
    
    return await updateDraft(typedArgs);
  } catch (error) {
    console.error('Handle update draft error:', error);
    return {
      content: [{
        type: "text",
        text: `Error updating draft: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}