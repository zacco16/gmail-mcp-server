// Email limits and constraints
export const EMAIL_CONSTANTS = {
  MAX_RECIPIENTS: 500,
  MAX_MESSAGE_SIZE: 25 * 1024 * 1024, // 25MB
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Gmail specific constants
export const GMAIL_LABELS = {
  INBOX: 'INBOX',
  UNREAD: 'UNREAD',
  SENT: 'SENT',
  DRAFT: 'DRAFT',
  SPAM: 'SPAM',
  TRASH: 'TRASH'
} as const;

// Server configuration
export const SERVER_CONFIG = {
  name: "gmail-mcp",
  version: "1.0.0"
};

// Default values
export const DEFAULTS = {
  LIST_MAX_RESULTS: 10
};