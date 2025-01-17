import { gmail_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { ToolResponse } from '../types/common.js';
import { createRawMessage, extractMessageDetails, extractMessageBody } from './utils.js';
import { ListMessagesArgs, DraftEmailArgs, SendEmailArgs, MessageDetails } from './types.js';

export class EmailHandlers {
  private gmail: gmail_v1.Gmail;

  constructor(auth: OAuth2Client) {
    this.gmail = google.gmail({ version: 'v1', auth });
  }

  async listMessages(args: ListMessagesArgs): Promise<ToolResponse> {
    const { maxResults = 10, labelIds = ['INBOX'], query = '', verbose = false } = args;

    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults,
        labelIds,
        q: query
      });

      if (!response.data.messages?.length) {
        return {
          content: [{ type: "text", text: "No messages found" }]
        };
      }

      const messageDetails: MessageDetails[] = await Promise.all(
        response.data.messages.map(async ({ id }) => {
          if (!id) throw new Error('Message ID not found');
          const msg = await this.gmail.users.messages.get({ userId: 'me', id });
          return extractMessageDetails(msg.data);
        })
      );

      return {
        content: verbose
          ? messageDetails.map((msg: MessageDetails) =>
              ({
                type: "text",
                text: `From: ${msg.from}\nSubject: ${msg.subject}\nSnippet: ${msg.snippet}`
              })
            )
          : messageDetails.map((msg: MessageDetails, index: number) =>
              ({
                type: "text",
                text: `${index + 1}. ${msg.subject} [${msg.id}]`
              })
            )
      };
    } catch (error) {
      console.error('List messages error:', error);
      return {
        content: [{ type: "text", text: `Error listing messages: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      };
    }
  }

  async readMessage({ messageId }: { messageId: string }): Promise<ToolResponse> {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      const details = extractMessageDetails(response.data);
      const body = extractMessageBody(response.data);

      return {
        content: [{
          type: "text",
          text: [
            `From: ${details.from}`,
            `Subject: ${details.subject}`,
            `Date: ${details.date}`,
            '\nBody:',
            body
          ].join('\n')
        }]
      };
    } catch (error) {
      console.error('Read message error:', error);
      return {
        content: [{ type: "text", text: `Error reading message: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      };
    }
  }

  async draftEmail(args: DraftEmailArgs): Promise<ToolResponse> {
    try {
      const raw = createRawMessage(args);
      
      const response = await this.gmail.users.drafts.create({
        userId: 'me',
        requestBody: {
          message: {
            raw
          }
        }
      });

      return {
        content: [{
          type: "text",
          text: `Draft created with ID: ${response.data.id}`
        }]
      };
    } catch (error) {
      console.error('Draft email error:', error);
      return {
        content: [{ type: "text", text: `Error creating draft: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      };
    }
  }

  async sendEmail(args: SendEmailArgs): Promise<ToolResponse> {
    try {
      if (args.draftId) {
        await this.gmail.users.drafts.send({
          userId: 'me',
          requestBody: {
            id: args.draftId
          }
        });
      } else {
        const raw = createRawMessage(args);
        await this.gmail.users.messages.send({
          userId: 'me',
          requestBody: {
            raw
          }
        });
      }

      return {
        content: [{
          type: "text",
          text: 'Email sent successfully'
        }]
      };
    } catch (error) {
      console.error('Send email error:', error);
      return {
        content: [{ type: "text", text: `Error sending email: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true
      };
    }
  }
}