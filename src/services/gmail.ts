import { gmail } from '../config/auth.js';
import { EMAIL_CONSTANTS, GMAIL_LABELS } from '../config/constants.js';
import {
  ListMessagesArgs,
  ReadMessageArgs,
  DraftEmailArgs,
  SendEmailArgs,
  MessageResponse,
  EmailValidationResult,
  MessageDetails
} from '../types/gmail.js';
import { gmail_v1 } from 'googleapis';

type Schema$MessagePartHeader = gmail_v1.Schema$MessagePartHeader;
type Schema$MessagePart = gmail_v1.Schema$MessagePart;
type Schema$Message = gmail_v1.Schema$Message;

export class GmailService {
  private static validateEmail(email: string): boolean {
    return EMAIL_CONSTANTS.EMAIL_REGEX.test(email);
  }

  private static validateEmailArgs(args: DraftEmailArgs): EmailValidationResult {
    const allRecipients = [
      ...(args.to || []),
      ...(args.cc || []),
      ...(args.bcc || [])
    ];

    if (allRecipients.length > EMAIL_CONSTANTS.MAX_RECIPIENTS) {
      return {
        valid: false,
        error: `Too many recipients. Maximum is ${EMAIL_CONSTANTS.MAX_RECIPIENTS}`
      };
    }

    for (const email of allRecipients) {
      if (!this.validateEmail(email)) {
        return {
          valid: false,
          error: `Invalid email format: ${email}`
        };
      }
    }

    const messageSize = Buffer.from(args.body).length;
    if (messageSize > EMAIL_CONSTANTS.MAX_MESSAGE_SIZE) {
      return {
        valid: false,
        error: 'Message size exceeds 25MB limit'
      };
    }

    return { valid: true };
  }

  private static createRawMessage(args: DraftEmailArgs): string {
    const headers = [
      `To: ${args.to.join(', ')}`,
      args.cc?.length ? `Cc: ${args.cc.join(', ')}` : null,
      args.bcc?.length ? `Bcc: ${args.bcc.join(', ')}` : null,
      `Subject: ${args.subject}`,
      `Content-Type: ${args.isHtml ? 'text/html' : 'text/plain'}; charset=utf-8`,
    ].filter(Boolean).join('\r\n');

    const email = `${headers}\r\n\r\n${args.body}`;
    return Buffer.from(email).toString('base64url');
  }

  static async listMessages({ maxResults = 10, labelIds = [], query, verbose = false, unreadOnly = false }: ListMessagesArgs): Promise<MessageResponse> {
    try {
      // When unreadOnly is true, ensure we include both UNREAD and INBOX labels
      let finalLabelIds = [...labelIds];
      if (unreadOnly) {
        finalLabelIds = [...new Set([...finalLabelIds, GMAIL_LABELS.UNREAD, GMAIL_LABELS.INBOX])];
      }

      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults,
        ...(finalLabelIds.length > 0 && { labelIds: finalLabelIds }),
        ...(query && { q: query })
      });

      const messages = response.data.messages || [];
      const messageDetails = await Promise.all(
        messages.map(async (message: Schema$Message) => {
          const detail = await gmail.users.messages.get({
            userId: 'me',
            id: message.id!
          });

          const labels = detail.data.labelIds || [];
          return {
            id: detail.data.id,
            subject: detail.data.payload?.headers?.find(
              (header: Schema$MessagePartHeader) => header.name?.toLowerCase() === 'subject'
            )?.value || '(no subject)',
            from: detail.data.payload?.headers?.find(
              (header: Schema$MessagePartHeader) => header.name?.toLowerCase() === 'from'
            )?.value,
            snippet: detail.data.snippet,
            isUnread: labels.includes(GMAIL_LABELS.UNREAD),
            labels: labels
          };
        })
      );

      if (verbose) {
        return {
          content: [{ 
            type: "text", 
            text: messageDetails.map((msg) => 
              `ID: ${msg.id}\nFrom: ${msg.from}\nSubject: ${msg.subject}\nStatus: ${msg.isUnread ? 'UNREAD' : 'READ'}\nLabels: ${msg.labels.join(', ')}\nSnippet: ${msg.snippet}\n`
            ).join('\n---\n')
          }]
        };
      } else {
        return {
          content: [{ 
            type: "text", 
            text: messageDetails.map((msg, i: number) => 
              `${i + 1}. ${msg.isUnread ? '[UNREAD] ' : ''}${msg.subject} (ID: ${msg.id})`
            ).join('\n')
          }]
        };
      }
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

      const headers = response.data.payload?.headers;
      const subject = headers?.find(
        (header: Schema$MessagePartHeader) => header.name?.toLowerCase() === 'subject'
      )?.value;
      const from = headers?.find(
        (header: Schema$MessagePartHeader) => header.name?.toLowerCase() === 'from'
      )?.value;
      const date = headers?.find(
        (header: Schema$MessagePartHeader) => header.name?.toLowerCase() === 'date'
      )?.value;

      let body = '';
      if (response.data.payload?.body?.data) {
        body = Buffer.from(response.data.payload.body.data, 'base64').toString('utf-8');
      } else if (response.data.payload?.parts) {
        const textPart = response.data.payload.parts.find(
          (part: Schema$MessagePart) => part.mimeType === 'text/plain' || part.mimeType === 'text/html'
        );
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        }
      }

      return {
        content: [{ 
          type: "text", 
          text: `From: ${from}\nDate: ${date}\nSubject: ${subject}\n\n${body}`
        }]
      };
    } catch (error) {
      console.error('Read message error:', error);
      throw error;
    }
  }

  static async draftEmail(args: DraftEmailArgs): Promise<MessageResponse> {
    try {
      const validation = this.validateEmailArgs(args);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const message = await gmail.users.drafts.create({
        userId: 'me',
        requestBody: {
          message: {
            raw: this.createRawMessage(args)
          }
        }
      });

      return {
        content: [{
          type: "text",
          text: `Draft created with ID: ${message.data.id || 'unknown'}`
        }]
      };
    } catch (error) {
      console.error('Draft email error:', error);
      throw error;
    }
  }

  static async sendEmail(args: SendEmailArgs): Promise<MessageResponse> {
    try {
      if (args.draftId) {
        const message = await gmail.users.drafts.send({
          userId: 'me',
          requestBody: {
            id: args.draftId
          }
        });
        return {
          content: [{
            type: "text",
            text: `Draft sent with message ID: ${message.data.id}`
          }]
        };
      } else {
        const validation = this.validateEmailArgs(args);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        const message = await gmail.users.messages.send({
          userId: 'me',
          requestBody: {
            raw: this.createRawMessage(args)
          }
        });
        return {
          content: [{
            type: "text",
            text: `Message sent with ID: ${message.data.id}`
          }]
        };
      }
    } catch (error) {
      console.error('Send email error:', error);
      throw error;
    }
  }
}