// Base calendar interfaces
export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: EventDateTime;
  end: EventDateTime;
  attendees?: Attendee[];
  status?: EventStatus;
  created?: string;
  updated?: string;
  timeZone?: string;
}

export interface EventDateTime {
  dateTime: string;  // ISO 8601 format
  timeZone?: string; // IANA timezone format
}

export interface Attendee {
  email: string;
  displayName?: string;
  optional?: boolean;
  responseStatus?: AttendeeStatus;
}

// List events arguments
export interface ListEventsArgs {
  maxResults?: number;
  timeMin?: string;   // ISO 8601
  timeMax?: string;   // ISO 8601
  query?: string;     // Free text search
  timeZone?: string;  // IANA timezone
}

// Read event arguments
export interface ReadEventArgs {
  eventId: string;
  timeZone?: string;  // IANA timezone
}

// Create/Update event arguments
export interface CreateEventArgs extends Omit<CalendarEvent, 'id' | 'created' | 'updated'> {
  sendNotifications?: boolean;
  [key: string]: unknown;  // Index signature for string keys
}

export interface UpdateEventArgs extends Partial<CreateEventArgs> {
  eventId: string;
  [key: string]: unknown;  // Index signature for string keys
}

// Enums
export enum EventStatus {
  CONFIRMED = 'confirmed',
  TENTATIVE = 'tentative',
  CANCELLED = 'cancelled'
}

export enum AttendeeStatus {
  NEEDS_ACTION = 'needsAction',
  DECLINED = 'declined',
  TENTATIVE = 'tentative',
  ACCEPTED = 'accepted'
}

// Response type (matching Gmail pattern)
export interface CalendarResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

// Type guards
export function isCreateEventArgs(args: Record<string, unknown>): args is CreateEventArgs {
  const a = args as Partial<CreateEventArgs>;
  return (
    typeof a.summary === 'string' &&
    a.start !== undefined &&
    'dateTime' in (a.start || {}) &&
    typeof (a.start as EventDateTime).dateTime === 'string' &&
    a.end !== undefined &&
    'dateTime' in (a.end || {}) &&
    typeof (a.end as EventDateTime).dateTime === 'string' &&
    (a.description === undefined || typeof a.description === 'string') &&
    (a.location === undefined || typeof a.location === 'string') &&
    (a.attendees === undefined || Array.isArray(a.attendees)) &&
    (a.timeZone === undefined || typeof a.timeZone === 'string')
  );
}

export function isUpdateEventArgs(args: Record<string, unknown>): args is UpdateEventArgs {
  const a = args as Partial<UpdateEventArgs>;
  return (
    typeof a.eventId === 'string' &&
    (a.summary === undefined || typeof a.summary === 'string') &&
    (a.description === undefined || typeof a.description === 'string') &&
    (a.location === undefined || typeof a.location === 'string') &&
    (a.start === undefined || ('dateTime' in (a.start || {}) && typeof (a.start as EventDateTime).dateTime === 'string')) &&
    (a.end === undefined || ('dateTime' in (a.end || {}) && typeof (a.end as EventDateTime).dateTime === 'string')) &&
    (a.attendees === undefined || Array.isArray(a.attendees)) &&
    (a.timeZone === undefined || typeof a.timeZone === 'string')
  );
}