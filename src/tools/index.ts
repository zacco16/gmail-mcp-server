import { LIST_MESSAGES_TOOL, handleListMessages } from './messages/list.js';
import { READ_MESSAGE_TOOL, handleReadMessage } from './messages/read.js';
import { DRAFT_EMAIL_TOOL, handleDraftEmail } from './messages/draft.js';
import { SEND_EMAIL_TOOL, handleSendEmail } from './messages/send.js';
import { LIST_EVENTS_TOOL, handleListEvents } from './calendar/list.js';
import { READ_EVENT_TOOL, handleReadEvent } from './calendar/read.js';
import { CREATE_EVENT_TOOL, handleCreateEvent } from './calendar/create.js';
import { LIST_DRAFTS_TOOL, handleListDrafts } from './drafts/list.js';
import { READ_DRAFT_TOOL, handleReadDraft } from './drafts/read.js';
import { DELETE_DRAFT_TOOL, handleDeleteDraft } from './drafts/delete.js';
import { UPDATE_DRAFT_TOOL, handleUpdateDraft } from './drafts/update.js';
import { LIST_CHAT_MESSAGES_TOOL, handleListChatMessages } from './chat/list.js';
import { SEND_CHAT_MESSAGE_TOOL, handleSendChatMessage } from './chat/send.js';

export const TOOLS = [
  LIST_MESSAGES_TOOL,
  READ_MESSAGE_TOOL,
  DRAFT_EMAIL_TOOL,
  SEND_EMAIL_TOOL,
  LIST_EVENTS_TOOL,
  READ_EVENT_TOOL,
  CREATE_EVENT_TOOL,
  LIST_DRAFTS_TOOL,
  READ_DRAFT_TOOL,
  DELETE_DRAFT_TOOL,
  UPDATE_DRAFT_TOOL,
  LIST_CHAT_MESSAGES_TOOL,
  SEND_CHAT_MESSAGE_TOOL
];

export const TOOL_HANDLERS: Record<string, (args: Record<string, unknown>) => Promise<any>> = {
  [LIST_MESSAGES_TOOL.name]: handleListMessages,
  [READ_MESSAGE_TOOL.name]: handleReadMessage,
  [DRAFT_EMAIL_TOOL.name]: handleDraftEmail,
  [SEND_EMAIL_TOOL.name]: handleSendEmail,
  [LIST_EVENTS_TOOL.name]: handleListEvents,
  [READ_EVENT_TOOL.name]: handleReadEvent,
  [CREATE_EVENT_TOOL.name]: handleCreateEvent,
  [LIST_DRAFTS_TOOL.name]: handleListDrafts,
  [READ_DRAFT_TOOL.name]: handleReadDraft,
  [DELETE_DRAFT_TOOL.name]: handleDeleteDraft,
  [UPDATE_DRAFT_TOOL.name]: handleUpdateDraft,
  [LIST_CHAT_MESSAGES_TOOL.name]: handleListChatMessages,
  [SEND_CHAT_MESSAGE_TOOL.name]: handleSendChatMessage
};