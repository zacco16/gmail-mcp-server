import { listMessages } from '../../services/chat/messages.js';
import { ListMessagesArgs, ChatResponse } from '../../types/chat.js';
import { DEFAULTS } from '../../config/constants.js';

export const LIST_CHAT_MESSAGES_TOOL = {
  name: "listChatMessages",
  description: "List messages from a Google Chat space",
  inputSchema: {
    type: "object",
    properties: {
      space: {
        type: "string",
        description: "Space name (e.g., spaces/123)"
      },
      maxResults: {
        type: "number",
        description: "Maximum number of messages to return (default: 10)"
      },
      pageToken: {
        type: "string",
        description: "Token for pagination"
      },
      filter: {
        type: "string",
        description: "Filter query for messages"
      }
    },
    required: ["space"]
  }
};

export async function handleListChatMessages(args: Record<string, unknown>): Promise<ChatResponse> {
  try {
    const { space, maxResults, pageToken, filter } = args;
    
    if (typeof space !== 'string') {
      throw new Error('space parameter is required and must be a string');
    }

    const typedArgs: ListMessagesArgs = {
      space,
      maxResults: typeof maxResults === 'number' ? maxResults : DEFAULTS.LIST_MAX_RESULTS,
      ...(typeof pageToken === 'string' && { pageToken }),
      ...(typeof filter === 'string' && { filter })
    };

    return await listMessages(typedArgs);
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error listing chat messages: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}