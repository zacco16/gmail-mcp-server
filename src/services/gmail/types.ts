import { gmail_v1 } from 'googleapis';

export type Schema$MessagePartHeader = gmail_v1.Schema$MessagePartHeader;
export type Schema$MessagePart = gmail_v1.Schema$MessagePart;
export type Schema$Message = gmail_v1.Schema$Message;

export interface MessageResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

export interface ListMessagesArgs {
  maxResults?: number;
  labelIds?: string[];
  query?: string;
  verbose?: boolean;
  unreadOnly?: boolean;
}

export interface ReadMessageArgs {
  messageId: string;
}

export interface DraftEmailArgs {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  isHtml?: boolean;
}

export interface SendEmailArgs extends DraftEmailArgs {
  draftId?: string;
}

export interface ListDraftsArgs {
  maxResults?: number;
  query?: string;
  verbose?: boolean;
}

export interface ReadDraftArgs {
  draftId: string;
}