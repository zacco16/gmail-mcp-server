import { deleteDraft } from '../../services/gmail/drafts.js';
import { DeleteDraftArgs } from '../../types/gmail.js';

export const DELETE_DRAFT_TOOL = {
  name: "deleteDraft",
  description: "Delete a Gmail draft message",
  inputSchema: {
    type: "object",
    properties: {
      draftId: {
        type: "string",
        description: "ID of the draft to delete"
      }
    },
    required: ["draftId"]
  }
};

export async function handleDeleteDraft(args: Record<string, unknown>) {
  try {
    const typedArgs: DeleteDraftArgs = {
      draftId: args.draftId as string
    };
    return await deleteDraft(typedArgs);
  } catch (error) {
    console.error('Handle delete draft error:', error);
    return {
      content: [{
        type: "text",
        text: `Error deleting draft: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}