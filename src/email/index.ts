import { MCPRequest, ServiceContext, ToolResponse } from '../types/common.js';
import { EMAIL_TOOLS } from './tools.js';
import { EmailHandlers } from './handlers.js';
import {
  DraftEmailArgs,
  SendEmailArgs,
  ListMessagesArgs,
  ReadMessageArgs
} from './types.js';

export * from './types.js';
export { EMAIL_TOOLS } from './tools.js';

interface BaseEmailArgs {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  isHtml?: boolean;
}

function isDraftEmailArgs(args: unknown): args is DraftEmailArgs {
  const emailArgs = args as Partial<BaseEmailArgs>;
  return !!(
    Array.isArray(emailArgs.to) &&
    emailArgs.to?.length > 0 &&
    typeof emailArgs.subject === 'string' &&
    typeof emailArgs.body === 'string' &&
    (emailArgs.cc === undefined || Array.isArray(emailArgs.cc)) &&
    (emailArgs.bcc === undefined || Array.isArray(emailArgs.bcc)) &&
    (emailArgs.isHtml === undefined || typeof emailArgs.isHtml === 'boolean')
  );
}

function isSendEmailArgs(args: unknown): args is SendEmailArgs {
  if (!isDraftEmailArgs(args)) return false;
  const sendArgs = args as Partial<SendEmailArgs>;
  return sendArgs.draftId === undefined || typeof sendArgs.draftId === 'string';
}

export function registerEmailTools(context: ServiceContext) {
  const { auth } = context;
  const handlers = new EmailHandlers(auth);

  return async (request: MCPRequest): Promise<ToolResponse | null> => {
    const { name, arguments: args = {} } = request.params;

    switch (name) {
      case "listEmails":
        return await handlers.listMessages(args as ListMessagesArgs);
      
      case "readEmail": {
        if (typeof args?.messageId !== 'string') {
          throw new Error("messageId is required and must be a string");
        }
        return await handlers.readMessage({ messageId: args.messageId });
      }
      
      case "draftEmail": {
        if (!isDraftEmailArgs(args)) {
          throw new Error("Invalid draft email arguments. Required: to (array), subject (string), body (string)");
        }
        return await handlers.draftEmail(args);
      }
      
      case "sendEmail": {
        if (!isSendEmailArgs(args)) {
          throw new Error("Invalid send email arguments. Required: to (array), subject (string), body (string), optional draftId (string)");
        }
        return await handlers.sendEmail(args);
      }
      
      default:
        return null;
    }
  };
}