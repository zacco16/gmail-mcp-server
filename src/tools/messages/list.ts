import { GmailService } from '../../services/gmail.js';
import { ListMessagesArgs } from '../../types/gmail.js';
import { DEFAULTS } from '../../config/constants.js';

export const LIST_MESSAGES_TOOL = {
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
      },
      unreadOnly: {
        type: "boolean",
        description: "Filter to show only unread messages (default: false)"
      }
    }
  }
};

export async function handleListMessages(args: ListMessagesArgs = { maxResults: DEFAULTS.LIST_MAX_RESULTS }) {
  return await GmailService.listMessages(args);
}