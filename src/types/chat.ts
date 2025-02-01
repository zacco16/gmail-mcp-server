import { chat_v1 } from 'googleapis';

// Export Google Chat API types
export type Schema$Message = chat_v1.Schema$Message;
export type Schema$Space = chat_v1.Schema$Space;

// Service function arguments
export interface ListMessagesArgs {
  space: string;
  maxResults?: number;
  pageToken?: string;
  filter?: string;
}

export interface SendMessageArgs {
  space: string;
  text: string;
  threadKey?: string;
}

// Response types (following existing pattern from gmail/calendar)
export interface ChatResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

// Type guards
export function isListMessagesArgs(value: unknown): value is ListMessagesArgs {
  if (typeof value !== 'object' || value === null) return false;
  const args = value as Partial<ListMessagesArgs>;
  return (
    typeof args.space === 'string' &&
    (args.maxResults === undefined || typeof args.maxResults === 'number') &&
    (args.pageToken === undefined || typeof args.pageToken === 'string') &&
    (args.filter === undefined || typeof args.filter === 'string')
  );
}

export function isSendMessageArgs(value: unknown): value is SendMessageArgs {
  if (typeof value !== 'object' || value === null) return false;
  const args = value as Partial<SendMessageArgs>;
  return (
    typeof args.space === 'string' &&
    typeof args.text === 'string' &&
    (args.threadKey === undefined || typeof args.threadKey === 'string')
  );
}