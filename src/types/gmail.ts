// Message listing interfaces
export interface ListMessagesArgs {
  maxResults?: number;
  labelIds?: string[];
  query?: string;
  verbose?: boolean;
}

export interface ReadMessageArgs {
  messageId: string;
}

// Email interfaces
export interface BaseEmailArgs {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  isHtml?: boolean;
  [key: string]: unknown;  // Index signature to satisfy Record<string, unknown>
}

export interface DraftEmailArgs extends BaseEmailArgs {}

export interface SendEmailArgs extends BaseEmailArgs {
  draftId?: string;
}

// Gmail API types
export interface GmailHeader {
  name: string;
  value: string;
}

export interface GmailPart {
  mimeType: string;
  body: {
    data?: string;
  };
}

// Validation interfaces
export interface EmailValidationResult {
  valid: boolean;
  error?: string;
}

// Response interfaces
export interface MessageResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

// Type guards
export function isDraftEmailArgs(args: Record<string, unknown>): args is DraftEmailArgs {
  const a = args as Partial<DraftEmailArgs>;
  return (
    Array.isArray(a.to) &&
    a.to.length > 0 &&
    typeof a.subject === 'string' &&
    typeof a.body === 'string' &&
    (a.cc === undefined || Array.isArray(a.cc)) &&
    (a.bcc === undefined || Array.isArray(a.bcc)) &&
    (a.isHtml === undefined || typeof a.isHtml === 'boolean')
  );
}

export function isSendEmailArgs(args: Record<string, unknown>): args is SendEmailArgs {
  return (
    isDraftEmailArgs(args) &&
    (args.draftId === undefined || typeof args.draftId === 'string')
  );
}