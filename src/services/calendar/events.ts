import { calendar } from '../../config/auth.js';
import { CALENDAR_CONSTANTS, DEFAULTS } from '../../config/constants.js';
import { 
  ListEventsArgs, 
  ReadEventArgs, 
  CalendarResponse, 
  CreateEventArgs, 
  EventStatus,
  ListEventsFunction,
  ReadEventFunction
} from './types.js';
import { DateTime } from 'luxon';
import { GaxiosError } from 'gaxios';
import { calendar_v3 } from 'googleapis';

export const listEvents: ListEventsFunction = async ({ 
  maxResults = DEFAULTS.CALENDAR_MAX_RESULTS,
  timeMin,
  timeMax,
  query,
  timeZone = DEFAULTS.DEFAULT_TIMEZONE 
}: ListEventsArgs = {}): Promise<CalendarResponse> => {
  try {
    const now = DateTime.now().setZone(timeZone);
    const defaultTimeMin = now.toISO();
    const defaultTimeMax = now.plus({ days: 30 }).toISO();

    const response = await calendar.events.list({
      userId: 'me',
      calendar: 'primary',
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
};

export const readEvent: ReadEventFunction = async ({ 
  eventId, 
  timeZone = DEFAULTS.DEFAULT_TIMEZONE 
}: ReadEventArgs): Promise<CalendarResponse> => {
  try {
    const response = await calendar.events.get({
      calendar: 'primary',
      eventId,
      timeZone
    } as calendar_v3.Params$Resource$Events$Get);

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
};

export async function createEvent({ 
  summary, 
  description, 
  location, 
  start, 
  end, 
  timeZone = DEFAULTS.DEFAULT_TIMEZONE,
  attendees = [],
  sendNotifications = false,
  status = EventStatus.CONFIRMED
}: CreateEventArgs): Promise<CalendarResponse> {
  try {
    // Validate event duration
    const startDt = DateTime.fromISO(start.dateTime, { zone: timeZone });
    const endDt = DateTime.fromISO(end.dateTime, { zone: timeZone });

    // Check event duration constraints
    const eventDurationMinutes = endDt.diff(startDt, 'minutes').minutes;
    if (eventDurationMinutes < CALENDAR_CONSTANTS.MIN_EVENT_LENGTH) {
      throw new Error(`Event must be at least ${CALENDAR_CONSTANTS.MIN_EVENT_LENGTH} minute(s) long`);
    }
    if (eventDurationMinutes > CALENDAR_CONSTANTS.MAX_EVENT_LENGTH * 60) {
      throw new Error(`Event cannot be longer than ${CALENDAR_CONSTANTS.MAX_EVENT_LENGTH} hours`);
    }

    // Validate number of attendees
    if (attendees.length > CALENDAR_CONSTANTS.MAX_ATTENDEES) {
      throw new Error(`Maximum of ${CALENDAR_CONSTANTS.MAX_ATTENDEES} attendees allowed`);
    }

    // Validate timezone
    if (!CALENDAR_CONSTANTS.VALID_TIMEZONES.includes(timeZone)) {
      throw new Error(`Invalid timezone. Supported timezones: ${CALENDAR_CONSTANTS.VALID_TIMEZONES.join(', ')}`);
    }

    // Prepare event object
    const event: calendar_v3.Schema$Event = {
      summary,
      description,
      location,
      start: {
        dateTime: start.dateTime,
        timeZone
      },
      end: {
        dateTime: end.dateTime,
        timeZone
      },
      status: status as calendar_v3.Schema$Event['status'],
      attendees: attendees.map(attendee => ({
        email: attendee.email,
        displayName: attendee.displayName,
        optional: attendee.optional
      }))
    };

    // Create event
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendNotifications
    });

    // Construct response
    return {
      content: [{
        type: "text",
        text: `Event created successfully. Event ID: ${response.data.id}`
      }]
    };

  } catch (error) {
    console.error('Create event error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      // Check for specific error scenarios
      if (error.message.includes('insufficient permissions')) {
        return {
          content: [{
            type: "text",
            text: "Error: Insufficient permissions to create event"
          }],
          isError: true
        };
      }
    }

    throw error;
  }
}