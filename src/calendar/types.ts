export interface ListCalendarsArgs {
  maxResults?: number;
  showDeleted?: boolean;
}

export interface CalendarValidationResult {
  valid: boolean;
  error?: string;
}

// Response type from Google Calendar API
export interface CalendarListResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  items?: {
    id: string;
    summary: string;
    description?: string;
    location?: string;
    timeZone?: string;
    primary?: boolean;
    deleted?: boolean;
  }[];
}

export interface CalendarError extends Error {
  code?: string;
  status?: number;
}