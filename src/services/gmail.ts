import { gmail } from '../config/auth.js';
import { EMAIL_CONSTANTS, GMAIL_LABELS } from '../config/constants.js';
import {
  ListMessagesArgs,
  ReadMessageArgs,
  DraftEmailArgs,
  SendEmailArgs,
  MessageResponse,
  EmailValidationResult,
  MessageDetails,
  ListDraftsArgs
} from '../types/gmail.js';
import { gmail_v1 } from 'googleapis';

type Schema$MessagePartHeader = gmail_v1.Schema$MessagePartHeader;
type Schema$MessagePart = gmail_v1.Schema$MessagePart;
type Schema$Message = gmail_v1.Schema$Message;

export class GmailService {
  static async listMessages({ maxResults = 10, labelIds, query, verbose = false, unreadOnly = false }: ListMessagesArgs): Promise<MessageResponse> {
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

  static async readMessage({ messageId }: ReadMessageArgs): Promise<MessageResponse> {
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

  static async draftEmail({ to, cc, bcc, subject, body, isHtml }: DraftEmailArgs): Promise<MessageResponse> {
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

  static async sendEmail({ to, cc, bcc, subject, body, isHtml, draftId }: SendEmailArgs): Promise<MessageResponse> {
    try {
      // If we have a draftId, send that draft
      if (draftId) {
        const response = await gmail.users.drafts.send({
          userId: 'me',
          requestBody: {
            id: draftId
          }
        });

        return {
          content: [{
            type: "text",
            text: `Draft sent successfully. Message ID: ${response.data.id}`
          }]
        };
      }

      // Otherwise, create and send a new message
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

      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });

      return {
        content: [{
          type: "text",
          text: `Email sent successfully. Message ID: ${response.data.id}`
        }]
      };

    } catch (error) {
      console.error('Send email error:', error);
      throw error;
    }
  }

  static async listDrafts({ maxResults = 10, query, verbose = false }: ListDraftsArgs): Promise<MessageResponse> {
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

  // ... rest of the class remains the same ...
}