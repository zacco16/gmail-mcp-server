import { jest } from '@jest/globals';
import { handleListEvents } from '../../../src/tools/calendar/list';
import * as calendarService from '../../../src/services/calendar/events';
import { DEFAULTS } from '../../../src/config/constants';
import { CalendarResponse } from '../../../src/services/calendar/types';

// Mock the calendar service
jest.mock('../../../src/services/calendar/events');

describe('List Events Tool', () => {
  const mockEvents: CalendarResponse = {
    content: [
      { type: 'text', text: 'Test Event 1 at 2pm' },
      { type: 'text', text: 'Test Event 2 at 3pm' }
    ]
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (calendarService.listEvents as jest.MockedFunction<typeof calendarService.listEvents>)
      .mockResolvedValue(mockEvents);
  });

  it('returns events with default parameters', async () => {
    const result = await handleListEvents();
    expect(calendarService.listEvents).toHaveBeenCalledWith({ 
      maxResults: DEFAULTS.CALENDAR_MAX_RESULTS 
    });
    expect(result).toEqual(mockEvents);
  });

  it('passes all parameters to service', async () => {
    const params = {
      maxResults: 10,
      timeMin: '2024-01-27T00:00:00Z',
      timeMax: '2024-02-27T00:00:00Z',
      query: 'test',
      timeZone: 'UTC'
    };
    
    const result = await handleListEvents(params);
    expect(calendarService.listEvents).toHaveBeenCalledWith(params);
    expect(result).toEqual(mockEvents);
  });

  it('handles service errors', async () => {
    const error = new Error('API Error');
    (calendarService.listEvents as jest.MockedFunction<typeof calendarService.listEvents>)
      .mockRejectedValue(error);
    
    await expect(handleListEvents()).rejects.toThrow('API Error');
  });
});