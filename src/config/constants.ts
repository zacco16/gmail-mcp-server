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
  LIST_MAX_RESULTS: 10,
  CALENDAR_MAX_RESULTS: 25,
  DEFAULT_TIMEZONE: 'Australia/Brisbane',  // AEDT Brisbane as default
  DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: 'HH:mm:ss',
  DATETIME_FORMAT: 'YYYY-MM-DDTHH:mm:ssZ'  // ISO 8601
};

// Calendar specific constants
export const CALENDAR_CONSTANTS = {
  MAX_ATTENDEES: 200,
  MAX_FREE_BUSY_DAYS: 42,  // Maximum days for free/busy queries
  MIN_EVENT_LENGTH: 1,     // Minimum event length in minutes
  MAX_EVENT_LENGTH: 8760,  // Maximum event length in hours (1 year)
  VALID_TIMEZONES: [
    'Australia/Brisbane',
    'Australia/Sydney',
    'UTC'
    // Add more as needed
  ]
};