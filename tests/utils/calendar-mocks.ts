export const mockListEventsResponse = {
  data: {
    items: [
      {
        id: 'event1',
        summary: 'Test Event 1',
        start: { dateTime: '2025-01-27T10:00:00Z' },
        end: { dateTime: '2025-01-27T11:00:00Z' }
      },
      {
        id: 'event2',
        summary: 'Test Event 2',
        start: { dateTime: '2025-01-27T14:00:00Z' },
        end: { dateTime: '2025-01-27T15:00:00Z' }
      }
    ]
  }
};

export const mockReadEventResponse = {
  data: {
    id: 'event1',
    summary: 'Test Event 1',
    description: 'Event description',
    location: 'Test Location',
    start: { dateTime: '2025-01-27T10:00:00Z' },
    end: { dateTime: '2025-01-27T11:00:00Z' },
    creator: { email: 'organizer@example.com' },
    attendees: [
      { email: 'attendee1@example.com', responseStatus: 'accepted' },
      { email: 'attendee2@example.com', responseStatus: 'needsAction' }
    ]
  }
};