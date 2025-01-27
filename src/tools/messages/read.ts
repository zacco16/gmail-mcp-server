import { readMessage } from '../../services/gmail/messages.js';
import { ReadMessageArgs, MessageResponse } from '../../services/gmail/types.js';

export const READ_MESSAGE_TOOL = {
  name: "readEmail",
  description: "Read a specific Gmail message",
  inputSchema: {
    type: "object",
    properties: {
      messageId: {
        type: "string",
        description: "ID of the message to read"
      }
    },
    required: ["messageId"]
  }
};

export async function handleReadMessage(args: Record<string, unknown>): Promise<MessageResponse> {
  if (typeof args?.messageId !== 'string') {
    throw new Error("messageId is required and must be a string");
  }
  return await readMessage({ messageId: args.messageId });
}