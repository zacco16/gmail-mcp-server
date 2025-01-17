export interface ListMessagesArgs {
  maxResults?: number;
  labelIds?: string[];
  query?: string;
  verbose?: boolean;
}

export interface ReadMessageArgs {
  messageId: string;
}

export interface DraftEmailArgs {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  isHtml?: boolean;
}

export interface SendEmailArgs extends DraftEmailArgs {
  draftId?: string;
}

export interface MessageDetails {
  id: string;
  threadId: string; // Added this
  labelIds: string[];
  subject: string;
  from?: string;
  to?: string;
  date?: string;  // Added this
  snippet?: string;
  body?: string;
}