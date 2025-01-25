import { LIST_MESSAGES_TOOL, handleListMessages } from './list.js';
import { READ_MESSAGE_TOOL, handleReadMessage } from './read.js';
import { DRAFT_EMAIL_TOOL, handleDraftEmail } from './draft.js';
import { SEND_EMAIL_TOOL, handleSendEmail } from './send.js';
import { LIST_EVENTS_TOOL, handleListEvents } from './calendar/list.js';
import { READ_EVENT_TOOL, handleReadEvent } from './calendar/read.js';

export const TOOLS = [
  LIST_MESSAGES_TOOL,
  READ_MESSAGE_TOOL,
  DRAFT_EMAIL_TOOL,
  SEND_EMAIL_TOOL,
  LIST_EVENTS_TOOL,
  READ_EVENT_TOOL
];

export const TOOL_HANDLERS: Record<string, (args: Record<string, unknown>) => Promise<any>> = {
  [LIST_MESSAGES_TOOL.name]: handleListMessages,
  [READ_MESSAGE_TOOL.name]: handleReadMessage,
  [DRAFT_EMAIL_TOOL.name]: handleDraftEmail,
  [SEND_EMAIL_TOOL.name]: handleSendEmail,
  [LIST_EVENTS_TOOL.name]: handleListEvents,
  [READ_EVENT_TOOL.name]: handleReadEvent
};