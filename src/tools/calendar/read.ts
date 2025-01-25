import { readEvent } from '../../services/calendar/events.js';
import { ReadEventArgs } from '../../services/calendar/types.js';
import { DEFAULTS } from '../../config/constants.js';

export const READ_EVENT_TOOL = {
  name: "readEvent",
  description: "Get detailed information about a calendar event",
  inputSchema: {
    type: "object",
    properties: {
      eventId: {
        type: "string",
        description: "ID of the event to read"
      },
      timeZone: {
        type: "string",
        description: `Timezone (default: ${DEFAULTS.DEFAULT_TIMEZONE})`
      }
    },
    required: ["eventId"]
  }
};

export async function handleReadEvent(args: Record<string, unknown>) {
  const { eventId, timeZone } = args;
  if (typeof eventId !== 'string') {
    throw new Error('eventId is required and must be a string');
  }
  return await readEvent({ 
    eventId, 
    timeZone: typeof timeZone === 'string' ? timeZone : undefined 
  });
}