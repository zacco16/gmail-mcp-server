import { gmail } from '../../config/auth.js';
import { ListMessagesArgs, ReadMessageArgs, MessageResponse } from './types.js';

export async function listMessages({ maxResults = 10, labelIds, query, verbose = false, unreadOnly = false }: ListMessagesArgs): Promise<MessageResponse> {
  try {
    const q = [
      query,
      unreadOnly ? 'is:unread' : null
    ].filter(Boolean).join(' ');

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      labelIds,
      ...(q && { q })
    });

    const messages = response.data.messages || [];
    
    if (verbose) {
      const detailedMessages = await Promise.all(
        messages.map(async (msg) => {
          const details = await gmail.users.messages.get({
            userId: 'me',
            id: msg.id as string
          });
          return details.data;
        })
      );

      return {
        content: [{
          type: "text",
          text: detailedMessages.map((msg, i: number) => {
            const headers = msg.payload?.headers || [];
            const subject = headers.find(h => h.name?.toLowerCase() === 'subject')?.value || 'No Subject';
            const from = headers.find(h => h.name?.toLowerCase() === 'from')?.value || 'Unknown';
            return `${i + 1}. From: ${from}\nSubject: ${subject}\nID: ${msg.id}\n`;
          }).join('\n')
        }]
      };
    }

    return {
      content: [{
        type: "text",
        text: messages.map((msg, i: number) => 
          `${i + 1}. Message ID: ${msg.id}`
        ).join('\n')
      }]
    };

  } catch (error) {
    console.error('List messages error:', error);
    throw error;
  }
}

export async function readMessage({ messageId }: ReadMessageArgs): Promise<MessageResponse> {
  try {
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: messageId
    });

    const message = response.data;
    const headers = message.payload?.headers || [];
    const subject = headers.find(h => h.name?.toLowerCase() === 'subject')?.value || 'No Subject';
    const from = headers.find(h => h.name?.toLowerCase() === 'from')?.value || 'Unknown';
    const body = message.snippet || 'No content available';

    return {
      content: [{
        type: "text",
        text: `From: ${from}\nSubject: ${subject}\n\n${body}`
      }]
    };

  } catch (error) {
    console.error('Read message error:', error);
    throw error;
  }
}