import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { ListCalendarsArgs, CalendarError } from './types.js';

export class CalendarHandlers {
  private calendar;

  constructor(auth: OAuth2Client) {
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async listCalendars({ maxResults = 10, showDeleted = false }: ListCalendarsArgs) {
    try {
      const response = await this.calendar.calendarList.list({
        maxResults,
        showDeleted
      });

      return {
        content: [{
          type: "text",
          text: response.data.items?.map(cal => 
            `${cal.summary}${cal.primary ? ' (Primary)' : ''} [${cal.id}]`
          ).join('\n') || 'No calendars found'
        }]
      };
    } catch (error) {
      console.error('List calendars error:', error);
      const calendarError = error as CalendarError;
      return {
        content: [{
          type: "text",
          text: `Error listing calendars: ${calendarError.message}`
        }],
        isError: true
      };
    }
  }
}