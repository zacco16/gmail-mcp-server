export * from './messages.js';

import { listMessages, sendMessage } from './messages.js';

// Backward compatibility
export const Chat = {
  listMessages,
  sendMessage
};