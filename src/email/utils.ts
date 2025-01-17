import { gmail_v1 } from 'googleapis';
import { MessageDetails } from './types.js';

export function createRawMessage(input: {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  isHtml?: boolean;
}): string {
  const { to, subject, body, cc = [], bcc = [], isHtml = false } = input;
  const contentType = isHtml ? 'text/html' : 'text/plain';
  
  const email = [
    `From: me`,
    `To: ${to.join(', ')}`,
    cc.length ? `Cc: ${cc.join(', ')}` : '',
    bcc.length ? `Bcc: ${bcc.join(', ')}` : '',
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: ${contentType}; charset=utf-8`,
    '',
    body
  ].filter(Boolean).join('\r\n');

  return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function extractMessageDetails(message: gmail_v1.Schema$Message): MessageDetails {
  const headers = message.payload?.headers || [];
  return {
    id: message.id ?? '',
    threadId: message.threadId ?? '',
    labelIds: message.labelIds ?? [],
    subject: headers.find(h => h.name?.toLowerCase() === 'subject')?.value || '',  // Changed to default to empty string
    from: headers.find(h => h.name?.toLowerCase() === 'from')?.value ?? undefined,
    to: headers.find(h => h.name?.toLowerCase() === 'to')?.value ?? undefined,
    date: headers.find(h => h.name?.toLowerCase() === 'date')?.value ?? undefined,
    snippet: message.snippet ?? undefined
  };
}

export function extractMessageBody(message: gmail_v1.Schema$Message): string {
  const parts = message.payload?.parts || [];
  const bodyData = message.payload?.body?.data || '';
  
  if (bodyData) {
    return Buffer.from(bodyData, 'base64').toString('utf8');
  }

  // Check parts recursively for text content
  const textParts = parts.filter(part => 
    part.mimeType?.startsWith('text/') && part.body?.data
  );

  if (textParts.length) {
    return Buffer.from(textParts[0].body?.data || '', 'base64').toString('utf8');
  }

  return '';
}