import { readDraft } from '../../services/gmail/drafts.js';
import { ReadDraftArgs } from '../../services/gmail/types.js';
import { DEFAULTS } from '../../config/constants.js';

export const READ_DRAFT_TOOL = {
  name: "readDraft",
  description: "Get detailed information about a Gmail draft message",
  inputSchema: {
    type: "object",
    properties: {
      draftId: {
        type: "string",
        description: "ID of the draft to read"
      }
    },
    required: ["draftId"]
  }
};

export async function handleReadDraft(args: Record<string, unknown>) {
  try {
    // Explicit type and presence checking
    if (!args.draftId || typeof args.draftId !== 'string') {
      throw new Error('Invalid or missing draft ID');
    }

    const typedArgs: ReadDraftArgs = {
      draftId: args.draftId
    };
    return await readDraft(typedArgs);
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error reading draft: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}