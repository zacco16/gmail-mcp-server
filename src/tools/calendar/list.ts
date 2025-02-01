import { CalendarService } from '../../services/calendar/events.js';
import { ListEventsArgs } from '../../services/calendar/types.js';
import { DEFAULTS } from '../../config/constants.js';

export const LIST_EVENTS_TOOL = {
  name: "listEvents",
  description: "List upcoming calendar events",
  inputSchema: {
    type: "object",
    properties: {
      maxResults: {
        type: "number",
        description: "Maximum number of events to return (default: 25)"
      },
      timeMin: {
        type: "string",
        description: "Start time (ISO 8601). Default: now"
      },
      timeMax: {
        type: "string",
        description: "End time (ISO 8601). Default: 30 days from now"
      },
      query: {
        type: "string",
        description: "Text search term"
      },
      timeZone: {
        type: "string",
        description: `Timezone (default: ${DEFAULTS.DEFAULT_TIMEZONE})`
      }
    }
  }
};

export async function handleListEvents(args: ListEventsArgs = { maxResults: DEFAULTS.CALENDAR_MAX_RESULTS }) {
  return await CalendarService.listEvents(args);
}