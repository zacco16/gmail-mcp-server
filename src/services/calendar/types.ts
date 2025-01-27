import { calendar_v3 } from 'googleapis';
import { EventStatus } from '../../types/calendar.js';

export type Schema$Event = calendar_v3.Schema$Event;

export interface CalendarResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

export interface ListEventsFunction {
  (args?: ListEventsArgs): Promise<CalendarResponse>;
}

export interface ReadEventFunction {
  (args: ReadEventArgs): Promise<CalendarResponse>;
}

export interface ListEventsArgs {
  maxResults?: number;
  timeMin?: string;
  timeMax?: string;
  query?: string;
  timeZone?: string;
}

export interface ReadEventArgs {
  eventId: string;
  timeZone?: string;
}

export interface CreateEventArgs {
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  timeZone?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    optional?: boolean;
  }>;
  sendNotifications?: boolean;
  status?: EventStatus;
}

export { EventStatus };