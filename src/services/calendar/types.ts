import { calendar_v3 } from 'googleapis';

export type Schema$Event = calendar_v3.Schema$Event;

export interface CalendarResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
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