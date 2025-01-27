import { jest } from '@jest/globals';
import { handleReadEvent } from '../../../src/tools/calendar/read';
import * as calendarService from '../../../src/services/calendar/events';
import { CalendarResponse } from '../../../src/services/calendar/types';

// Mock the calendar service
jest.mock('../../../src/services/calendar/events');

describe('Read Event Tool', () => {
  const mockEvent: CalendarResponse = {
    content: [
      { type: 'text', text: 'Test Event Details' }
    ]
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (calendarService.readEvent as jest.MockedFunction<typeof calendarService.readEvent>)
      .mockResolvedValue(mockEvent);
  });

  it('returns event details with required parameters', async () => {
    const params = { eventId: 'test123' };
    const result = await handleReadEvent(params);
    
    expect(calendarService.readEvent).toHaveBeenCalledWith({
      eventId: 'test123',
      timeZone: undefined
    });
    expect(result).toEqual(mockEvent);
  });

  it('includes timezone when provided', async () => {
    const params = { 
      eventId: 'test123',
      timeZone: 'Australia/Sydney'
    };
    
    const result = await handleReadEvent(params);
    expect(calendarService.readEvent).toHaveBeenCalledWith(params);
    expect(result).toEqual(mockEvent);
  });

  it('validates eventId parameter', async () => {
    await expect(handleReadEvent({} as any))
      .rejects.toThrow('eventId is required and must be a string');

    await expect(handleReadEvent({ eventId: 123 } as any))
      .rejects.toThrow('eventId is required and must be a string');
  });

  it('handles service errors', async () => {
    const error = new Error('API Error');
    (calendarService.readEvent as jest.MockedFunction<typeof calendarService.readEvent>)
      .mockRejectedValue(error);
    
    await expect(handleReadEvent({ eventId: 'test123' }))
      .rejects.toThrow('API Error');
  });
});