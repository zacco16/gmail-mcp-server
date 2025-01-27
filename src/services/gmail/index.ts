export * from './messages.js';
export * from './drafts.js';
export * from './send.js';
export * from './types.js';

import { listMessages, readMessage } from './messages.js';
import { draftEmail, listDrafts } from './drafts.js';
import { sendEmail } from './send.js';

// Backward compatibility
export const Gmail = {
  listMessages,
  readMessage,
  draftEmail,
  sendEmail,
  listDrafts
};