import { sendMessage } from '../../services/chat/messages.js';
import { SendMessageArgs, ChatResponse } from '../../types/chat.js';

export const SEND_CHAT_MESSAGE_TOOL = {
  name: "sendChatMessage",
  description: "Send a message to a Google Chat space",
  inputSchema: {
    type: "object",
    properties: {
      space: {
        type: "string",
        description: "Space name (e.g., spaces/123)"
      },
      text: {
        type: "string",
        description: "Message text content"
      },
      threadKey: {
        type: "string",
        description: "Optional thread key for replies"
      }
    },
    required: ["space", "text"]
  }
};

export async function handleSendChatMessage(args: Record<string, unknown>): Promise<ChatResponse> {
  try {
    const { space, text, threadKey } = args;

    // Validate required parameters
    if (typeof space !== 'string') {
      throw new Error('space parameter is required and must be a string');
    }
    if (typeof text !== 'string') {
      throw new Error('text parameter is required and must be a string');
    }

    // Create typed arguments
    const typedArgs: SendMessageArgs = {
      space,
      text,
      ...(typeof threadKey === 'string' && { threadKey })
    };

    return await sendMessage(typedArgs);
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error sending chat message: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}