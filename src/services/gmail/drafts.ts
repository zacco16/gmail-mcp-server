import { gmail } from '../../config/auth.js';
import { DraftEmailArgs, ListDraftsArgs, ReadDraftArgs, MessageResponse } from './types.js';

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

export async function readDraft({ draftId }: ReadDraftArgs): Promise<MessageResponse> {
  try {
    const response = await gmail.users.drafts.get({
      userId: 'me',
      id: draftId,
      format: 'full'
    });

    const draft = response.data;
    const message = draft.message;

    if (!message || !message.payload) {
      throw new Error('Draft message or payload not found');
    }

    // Parse headers with proper type safety
    const headers = message.payload.headers || [];
    const subject = headers.find(h => h.name?.toLowerCase() === 'subject')?.value || '(no subject)';
    const to = headers.find(h => h.name?.toLowerCase() === 'to')?.value || '';
    const cc = headers.find(h => h.name?.toLowerCase() === 'cc')?.value || '';
    const bcc = headers.find(h => h.name?.toLowerCase() === 'bcc')?.value || '';

    // Get body content
    let body = '';
    if (message.payload.body?.data) {
      body = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
    } else if (message.payload.parts) {
      const textPart = message.payload.parts.find(part => 
        part.mimeType === 'text/plain' || part.mimeType === 'text/html'
      );
      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
      }
    }

    return {
      content: [{
        type: "text",
        text: `Draft ID: ${draft.id}\nSubject: ${subject}\nTo: ${to}\nCC: ${cc}\nBCC: ${bcc}\n\nBody:\n${body}`
      }]
    };

  } catch (error) {
    console.error('Read draft error:', error);
    throw error;
  }
}