export interface ListMessagesArgs {
  maxResults?: number;
  labelIds?: string[];
  query?: string;
  verbose?: boolean;
  unreadOnly?: boolean;
}

export interface MessageDetails {
  id: string;
  subject: string;
  from?: string;
  snippet?: string;
  isUnread: boolean;
  labels: string[];
}

export interface ReadMessageArgs {
  messageId: string;
}

export interface BaseEmailArgs {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  isHtml?: boolean;
}

export interface DraftEmailArgs extends BaseEmailArgs, Record<string, unknown> {}

export interface SendEmailArgs extends BaseEmailArgs, Record<string, unknown> {
  draftId?: string;
}

export interface ListDraftsArgs {
  maxResults?: number;
  query?: string;
  verbose?: boolean;
}

export interface DraftDetails {
  id: string;
  subject: string;
  to?: string;
  snippet?: string;
  updated?: string;
}

export interface UpdateDraftArgs extends Partial<Omit<BaseEmailArgs, 'to'>>, Record<string, unknown> {
  draftId: string;
  to?: string[];
}

export interface DeleteDraftArgs {
  draftId: string;
}

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

export interface EmailValidationResult {
  valid: boolean;
  error?: string;
}

export interface MessageResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

// Tool interfaces
export interface GmailToolSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
}

export interface GmailTool {
  name: string;
  description: string;
  inputSchema: GmailToolSchema;
}

export function isGmailTool(value: unknown): value is GmailTool {
  const tool = value as Partial<GmailTool>;
  return (
    typeof tool === 'object' &&
    tool !== null &&
    typeof tool.name === 'string' &&
    typeof tool.description === 'string' &&
    tool.inputSchema !== undefined &&
    typeof tool.inputSchema === 'object' &&
    tool.inputSchema !== null &&
    tool.inputSchema.type === 'object' &&
    typeof tool.inputSchema.properties === 'object'
  );
}

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

export function isUpdateDraftArgs(args: Record<string, unknown>): args is UpdateDraftArgs {
  const a = args as Partial<UpdateDraftArgs>;
  return (
    typeof a.draftId === 'string' &&
    (a.to === undefined || Array.isArray(a.to)) &&
    (a.subject === undefined || typeof a.subject === 'string') &&
    (a.body === undefined || typeof a.body === 'string') &&
    (a.cc === undefined || Array.isArray(a.cc)) &&
    (a.bcc === undefined || Array.isArray(a.bcc)) &&
    (a.isHtml === undefined || typeof a.isHtml === 'boolean')
  );
}