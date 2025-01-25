import { GmailService } from '../../services/gmail.js';
import { ListDraftsArgs } from '../../types/gmail.js';
import { DEFAULTS } from '../../config/constants.js';

export const LIST_DRAFTS_TOOL = {
  name: "listDrafts",
  description: "List Gmail draft messages",
  inputSchema: {
    type: "object",
    properties: {
      maxResults: {
        type: "number",
        description: "Maximum number of drafts to return (default: 10)"
      },
      query: {
        type: "string",
        description: "Search query for drafts"
      },
      verbose: {
        type: "boolean",
        description: "Whether to show full draft details (default: false)"
      }
    }
  }
};

export async function handleListDrafts(args: ListDraftsArgs = { maxResults: DEFAULTS.LIST_MAX_RESULTS }) {
  return await GmailService.listDrafts(args);
}