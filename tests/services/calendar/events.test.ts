import { jest } from '@jest/globals';
import { calendar } from '../../../src/config/auth';
import { CalendarService } from '../../../src/services/calendar/events';
import { DEFAULTS } from '../../../src/config/constants';
import type { calendar_v3 } from 'googleapis';

// Mock the auth module
jest.mock('../../../src/config/auth', () => ({
  calendar: {
    events: {
      list: jest.fn()
    }
  }
}));

describe('CalendarService', () => {
  const mockEvents: calendar_v3.Schema$Events = {
    items: [
      {
        id: 'event1',
        summary: 'Test Event 1',
        start: { dateTime: '2024-02-15T10:00:00Z' },
        end: { dateTime: '2024-02-15T11:00:00Z' }
      },
      {
        id: 'event2',
        summary: 'Test Event 2',
        start: { dateTime: '2024-02-15T14:00:00Z' },
        end: { dateTime: '2024-02-15T15:00:00Z' }
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listEvents', () => {
    it('lists events with default parameters', async () => {
      ((calendar.events.list as any) as jest.Mock).mockResolvedValue({
        data: mockEvents,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        request: {}
      });

      const result = await CalendarService.listEvents();

      expect(calendar.events.list).toHaveBeenCalledWith(expect.objectContaining({
        calendarId: 'primary',
        maxResults: DEFAULTS.CALENDAR_MAX_RESULTS,
        timeZone: DEFAULTS.DEFAULT_TIMEZONE,
        singleEvents: true,
        orderBy: 'startTime'
      }));

      expect(result.content[0].text).toContain('Test Event 1');
      expect(result.content[0].text).toContain('Test Event 2');
    });

    it('handles calendar not found error', async () => {
      const error = new Error('Calendar not found');
      (error as any).response = { status: 404 };
      ((calendar.events.list as any) as jest.Mock).mockRejectedValue(error);

      const result = await CalendarService.listEvents();

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Calendar not found or no access');
    });

    it('throws other errors', async () => {
      const error = new Error('Unknown error');
      ((calendar.events.list as any) as jest.Mock).mockRejectedValue(error);

      await expect(CalendarService.listEvents()).rejects.toThrow('Unknown error');
    });
  });
});