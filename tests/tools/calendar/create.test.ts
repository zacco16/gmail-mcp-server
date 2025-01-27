import { jest } from '@jest/globals';
import { handleCreateEvent } from '../../../src/tools/calendar/create';
import * as calendarService from '../../../src/services/calendar/events';
import { EventStatus } from '../../../src/types/calendar';
import { CalendarResponse } from '../../../src/services/calendar/types';

// Mock the calendar service
jest.mock('../../../src/services/calendar/events');

describe('Create Event Tool', () => {
  const mockSuccessResponse: CalendarResponse = {
    content: [
      { type: 'text', text: 'Event created successfully. Event ID: event123' }
    ]
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (calendarService.createEvent as jest.MockedFunction<typeof calendarService.createEvent>)
      .mockResolvedValue(mockSuccessResponse);
  });

  it('creates event successfully with required parameters', async () => {
    const eventParams = {
      summary: 'Team Meeting',
      start: { 
        dateTime: '2024-02-15T10:00:00Z',
        timeZone: 'Australia/Brisbane'
      },
      end: { 
        dateTime: '2024-02-15T11:00:00Z',
        timeZone: 'Australia/Brisbane'
      }
    };
    
    const result = await handleCreateEvent(eventParams);
    
    expect(calendarService.createEvent).toHaveBeenCalledWith(eventParams);
    expect(result).toEqual(mockSuccessResponse);
  });

  it('handles optional parameters correctly', async () => {
    const eventParams = {
      summary: 'Project Kickoff',
      start: { 
        dateTime: '2024-03-01T14:00:00Z',
        timeZone: 'Australia/Sydney'
      },
      end: { 
        dateTime: '2024-03-01T15:30:00Z',
        timeZone: 'Australia/Sydney'
      },
      description: 'Initial project planning meeting',
      location: 'Conference Room A',
      attendees: [{ 
        email: 'team@example.com', 
        displayName: 'Project Team' 
      }],
      status: EventStatus.TENTATIVE,
      sendNotifications: true
    };
    
    const result = await handleCreateEvent(eventParams);
    
    expect(calendarService.createEvent).toHaveBeenCalledWith(expect.objectContaining(eventParams));
    expect(result).toEqual(mockSuccessResponse);
  });

  it('throws error for invalid input', async () => {
    const invalidParams = {
      summary: 'Incomplete Event'
      // Missing required start and end parameters
    };
    
    await expect(handleCreateEvent(invalidParams))
      .rejects
      .toThrow('Invalid create event arguments');
  });
});