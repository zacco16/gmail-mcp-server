import { calendar } from '../../config/auth.js';
import { CALENDAR_CONSTANTS, DEFAULTS } from '../../config/constants.js';
import { ListEventsArgs, ReadEventArgs, CalendarResponse } from '../../types/calendar.js';
import { DateTime } from 'luxon';
import { calendar_v3 } from 'googleapis';
import { GaxiosError } from 'gaxios';

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
      let output = '';
      
      for (const [index, event] of events.entries()) {
        const start = event.start?.dateTime || event.start?.date;
        const end = event.end?.dateTime || event.end?.date;
        const startDt = DateTime.fromISO(start || '', { zone: timeZone });
        const endDt = DateTime.fromISO(end || '', { zone: timeZone });
        
        output += `${index + 1}. ${event.summary || '(No title)'}`;
        output += `\n   Event ID: ${event.id}`;
        output += `\n   When: ${startDt.toLocaleString(DateTime.DATETIME_FULL)} to ${endDt.toLocaleString(DateTime.DATETIME_FULL)}`;
        output += `\n   Status: ${event.status || 'unspecified'}`;
        if (event.attendees?.length) {
          output += `\n   Attendees: ${event.attendees.length}`;
        }
        if (event.recurringEventId) {
          output += '\n   (Part of recurring series)';
        }
        output += '\n\n';
      }

      console.log('Found events:', events.length);
      console.log('First event ID:', events[0]?.id);
      
      return {
        content: [{ 
          type: "text",
          text: output.trim()
        }]
      };

    } catch (error) {
      console.error('List events error:', error);
      throw error;
    }
  }

  static async readEvent({ 
    eventId, 
    timeZone = DEFAULTS.DEFAULT_TIMEZONE 
  }: ReadEventArgs): Promise<CalendarResponse> {
    try {
      const response = await calendar.events.get({
        calendarId: 'primary',
        eventId,
        timeZone
      });

      const event = response.data;
      const start = event.start?.dateTime || event.start?.date;
      const end = event.end?.dateTime || event.end?.date;
      const startDt = DateTime.fromISO(start || '', { zone: timeZone });
      const endDt = DateTime.fromISO(end || '', { zone: timeZone });

      const details = [
        `Event ID: ${event.id}`,
        `Summary: ${event.summary || '(No title)'}`,
        `When: ${startDt.toLocaleString(DateTime.DATETIME_FULL)} to ${endDt.toLocaleString(DateTime.DATETIME_FULL)}`,
        `Status: ${event.status || 'unspecified'}`,
        event.description ? `Description: ${event.description}` : null,
        event.location ? `Location: ${event.location}` : null,
        event.hangoutLink ? `Meeting Link: ${event.hangoutLink}` : null,
        event.recurringEventId ? 'Part of recurring series' : null,
        event.creator?.email ? `Organizer: ${event.creator.email}` : null,
        event.attendees?.length ? `Attendees:\n${event.attendees.map(a => 
          `   - ${a.email}${a.responseStatus ? ` (${a.responseStatus})` : ''}`
        ).join('\n')}` : null
      ].filter(Boolean).join('\n');

      return {
        content: [{
          type: "text",
          text: details
        }]
      };
    } catch (error: unknown) {
      if (error instanceof GaxiosError && error.response?.status === 404) {
        return {
          content: [{
            type: "text",
            text: `Event not found. The event may have been deleted or you may not have access to it.`
          }],
          isError: true
        };
      }
      console.error('Read event error:', error);
      throw error;
    }
  }
}