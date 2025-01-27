import { gmail } from '../../config/auth.js';
import { gmail_v1 } from 'googleapis';
import { DraftEmailArgs, ListDraftsArgs, ReadDraftArgs, MessageResponse } from './types.js';
import { DeleteDraftArgs, UpdateDraftArgs } from '../../types/gmail.js';

function extractBody(message: gmail_v1.Schema$Message): string {
  if (message.payload?.body?.data) {
    return Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
  }
  const textPart = message.payload?.parts?.find(part => 
    part.mimeType === 'text/plain' || part.mimeType === 'text/html'
  );
  return textPart?.body?.data 
    ? Buffer.from(textPart.body.data, 'base64').toString('utf-8')
    : '';
}

function determineIfHtml(message: gmail_v1.Schema$Message): boolean {
  const contentType = message.payload?.headers
    ?.find(h => h.name?.toLowerCase() === 'content-type')?.value || '';
  return contentType.includes('text/html');
}

function createRawMessage(message: {
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body: string;
  isHtml?: boolean;
}): string {
  const raw = Buffer.from(
    `${message.to ? `To: ${message.to}\n` : ''}` +
    `${message.cc ? `Cc: ${message.cc}\n` : ''}` +
    `${message.bcc ? `Bcc: ${message.bcc}\n` : ''}` +
    `${message.subject ? `Subject: ${message.subject}\n` : ''}` +
    `Content-Type: ${message.isHtml ? 'text/html' : 'text/plain'}; charset=utf-8\n\n` +
    `${message.body}`
  ).toString('base64');
  
  return raw.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

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

export async function updateDraft({ 
  draftId, 
  to, 
  cc, 
  bcc, 
  subject, 
  body, 
  isHtml 
}: UpdateDraftArgs): Promise<MessageResponse> {
  try {
    // 1. Fetch existing draft
    const existingDraft = await gmail.users.drafts.get({
      userId: 'me',
      id: draftId,
      format: 'full'
    });

    if (!existingDraft.data.message || !existingDraft.data.message.payload) {
      throw new Error('Draft message or payload not found');
    }

    const currentMessage = existingDraft.data.message;
    const headers = currentMessage.payload?.headers || [];

    // 2. Merge updates with existing content
    const updatedMessage = {
      to: to?.join(',') || headers.find(h => h.name?.toLowerCase() === 'to')?.value || undefined,
      cc: cc?.join(',') || headers.find(h => h.name?.toLowerCase() === 'cc')?.value || undefined,
      bcc: bcc?.join(',') || headers.find(h => h.name?.toLowerCase() === 'bcc')?.value || undefined,
      subject: subject || headers.find(h => h.name?.toLowerCase() === 'subject')?.value || undefined,
      body: body || extractBody(currentMessage) || '',
      isHtml: isHtml ?? determineIfHtml(currentMessage)
    };

    // 3. Create new raw message
    const raw = createRawMessage(updatedMessage);

    // 4. Update draft
    await gmail.users.drafts.update({
      userId: 'me',
      id: draftId,
      requestBody: {
        message: { raw }
      }
    });

    return {
      content: [{
        type: "text",
        text: `Draft ${draftId} updated successfully`
      }]
    };

  } catch (error) {
    console.error('Update draft error:', error);
    throw error;
  }
}

export async function deleteDraft({ draftId }: DeleteDraftArgs): Promise<MessageResponse> {
  try {
    await gmail.users.drafts.delete({
      userId: 'me',
      id: draftId
    });

    return {
      content: [{
        type: "text",
        text: `Draft ${draftId} deleted successfully`
      }]
    };

  } catch (error) {
    console.error('Delete draft error:', error);
    throw error;
  }
}