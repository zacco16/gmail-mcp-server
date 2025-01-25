import { gmail } from '../../config/auth.js';
import { DraftEmailArgs, ListDraftsArgs, MessageResponse } from './types.js';

export async function draftEmail({ to, cc, bcc, subject, body, isHtml }: DraftEmailArgs): Promise<MessageResponse> {
  try {
    const message = {
      to: to.join(','),
      ...(cc?.length && { cc: cc.join(',') }),
      ...(bcc?.length && { bcc: bcc.join(',') }),
      subject,
      ...(isHtml ? { html: body } : { text: body })
    };

    const encodedMessage = Buffer.from(
      `To: ${message.to}\n` +
      (message.cc ? `Cc: ${message.cc}\n` : '') +
      (message.bcc ? `Bcc: ${message.bcc}\n` : '') +
      `Subject: ${message.subject}\n` +
      `Content-Type: ${isHtml ? 'text/html' : 'text/plain'}; charset=utf-8\n\n` +
      `${body}`
    ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const response = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: encodedMessage
        }
      }
    });

    return {
      content: [{
        type: "text",
        text: `Draft created successfully. Draft ID: ${response.data.id}`
      }]
    };

  } catch (error) {
    console.error('Draft email error:', error);
    throw error;
  }
}

export async function listDrafts({ maxResults = 10, query, verbose = false }: ListDraftsArgs): Promise<MessageResponse> {
  try {
    const response = await gmail.users.drafts.list({
      userId: 'me',
      maxResults,
      ...(query && { q: query })
    });

    const drafts = response.data.drafts || [];
    
    return {
      content: [{ 
        type: "text", 
        text: drafts.map((draft, i: number) => 
          `${i + 1}. Draft ID: ${draft.id}`
        ).join('\n')
      }]
    };
  } catch (error) {
    console.error('List drafts error:', error);
    throw error;
  }
}