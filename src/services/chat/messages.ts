import { google } from 'googleapis';
import { oauth2Client } from '../../config/auth.js';
import { ListMessagesArgs, SendMessageArgs, ChatResponse, isListMessagesArgs, isSendMessageArgs } from '../../types/chat.js';
import { chat_v1 } from 'googleapis';

// Initialize Chat API
const chat = google.chat({ version: 'v1', auth: oauth2Client });

export async function listMessages({ 
  space,
  maxResults = 10,
  pageToken,
  filter 
}: ListMessagesArgs): Promise<ChatResponse> {
  try {
    // Validate input
    if (!isListMessagesArgs({ space, maxResults, pageToken, filter })) {
      throw new Error('Invalid arguments for listMessages');
    }

    const response = await chat.spaces.messages.list({
      parent: space,
      pageSize: maxResults,
      pageToken,
      filter
    });

    const messages = response.data.messages || [];
    let output = '';
    
    for (const [index, msg] of messages.entries()) {
      // Use optional chaining with correct type properties
      const sender = msg.sender?.displayName || 'Unknown';
      const time = msg.createTime ? new Date(msg.createTime).toLocaleString() : 'Unknown time';
      const text = msg.text || '(No content)';
      
      output += `${index + 1}. From: ${sender}\n`;
      output += `   Time: ${time}\n`;
      output += `   ${text}\n\n`;
    }

    return {
      content: [{
        type: "text",
        text: output.trim() || 'No messages found'
      }]
    };

  } catch (error) {
    console.error('List chat messages error:', error);
    return {
      content: [{
        type: "text",
        text: `Error listing messages: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}

export async function sendMessage({ 
  space, 
  text,
  threadKey 
}: SendMessageArgs): Promise<ChatResponse> {
  try {
    // Validate input
    if (!isSendMessageArgs({ space, text, threadKey })) {
      throw new Error('Invalid arguments for sendMessage');
    }

    // Construct request body with proper typing
    const requestBody: chat_v1.Schema$Message = {
      text,
      ...(threadKey && { thread: { name: threadKey } })
    };

    const response = await chat.spaces.messages.create({
      parent: space,
      requestBody
    });

    return {
      content: [{
        type: "text",
        text: `Message sent successfully. Message ID: ${response.data.name}`
      }]
    };

  } catch (error) {
    console.error('Send chat message error:', error);
    return {
      content: [{
        type: "text",
        text: `Error sending message: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}

// Export a consistent interface like other services
export const Chat = {
  listMessages,
  sendMessage
};