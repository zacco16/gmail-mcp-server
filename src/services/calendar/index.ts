import { calendar } from '../../config/auth.js';
import { CALENDAR_CONSTANTS, DEFAULTS } from '../../config/constants.js';
import { ListEventsArgs, CalendarResponse } from '../../types/calendar.js';
import { DateTime } from 'luxon';
import { calendar_v3 } from 'googleapis';

type Schema$Event = calendar_v3.Schema$Event;

export class CalendarService {
  static async listEvents({ 
    maxResults = DEFAULTS.CALENDAR_MAX_RESULTS,
    timeMin,
    timeMax,
    query,
    timeZone = DEFAULTS.DEFAULT_TIMEZONE 
  }: ListEventsArgs = {}): Promise<CalendarResponse> {
    try {
      // Set default time range if not provided (now to 30 days from now)
      const now = DateTime.now().setZone(timeZone);
      const defaultTimeMin = now.toISO();
      const defaultTimeMax = now.plus({ days: 30 }).toISO();

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || defaultTimeMin,
        timeMax: timeMax || defaultTimeMax,
        maxResults,
        timeZone,
        q: query,
        singleEvents: true,
        orderBy: 'startTime'
      } as calendar_v3.Params$Resource$Events$List);

      const events = response.data.items || [];
      
      // Format events for display
      const formattedEvents = events.map((event: Schema$Event) => {
        const start = event.start?.dateTime || event.start?.date;
        const end = event.end?.dateTime || event.end?.date;
        const startDt = DateTime.fromISO(start || '', { zone: timeZone });
        const endDt = DateTime.fromISO(end || '', { zone: timeZone });

        return {
          id: event.id || '',
          summary: event.summary || '(No title)',
          start: startDt.toLocaleString(DateTime.DATETIME_FULL),
          end: endDt.toLocaleString(DateTime.DATETIME_FULL),
          attendees: event.attendees?.length || 0,
          status: event.status || 'unspecified'
        };
      });

      return {
        content: [{
          type: "text",
          text: formattedEvents.map((event, index: number) => 
            `${index + 1}. ${event.summary}\n   When: ${event.start} to ${event.end}\n   Status: ${event.status}${event.attendees ? `\n   Attendees: ${event.attendees}` : ''}`
          ).join('\n\n')
        }]
      };

    } catch (error) {
      console.error('List events error:', error);
      throw error;
    }
  }
}