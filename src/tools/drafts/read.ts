import { readDraft } from '../../services/gmail/drafts.js';
import { ReadDraftArgs } from '../../services/gmail/types.js';

export const READ_DRAFT_TOOL = {
  name: 'readDraft',
  description: 'Get detailed information about a Gmail draft message',
  parameters: {
    type: 'object',
    properties: {
      draftId: {
        type: 'string',
        description: 'ID of the draft to read'
      }
    },
    required: ['draftId']
  }
};

export async function handleReadDraft(args: Record<string, unknown>) {
  const typedArgs: ReadDraftArgs = {
    draftId: args.draftId as string
  };
  return await readDraft(typedArgs);
}