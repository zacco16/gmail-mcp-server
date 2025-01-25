import { gmail } from '../../config/auth.js';
import { SendEmailArgs, MessageResponse } from './types.js';

export async function sendEmail({ to, cc, bcc, subject, body, isHtml, draftId }: SendEmailArgs): Promise<MessageResponse> {
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