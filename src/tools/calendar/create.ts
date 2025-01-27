import { createEvent } from '../../services/calendar/events.js';
import { CreateEventArgs, EventStatus } from '../../services/calendar/types.js';
import { isCreateEventArgs } from '../../types/calendar.js';

export const CREATE_EVENT_TOOL = {
  name: "createEvent",
  description: "Create a new calendar event",
  inputSchema: {
    type: "object",
    properties: {
      summary: { type: "string", description: "Event title" },
      description: { type: "string", description: "Event description" },
      location: { type: "string", description: "Event location" },
      start: {
        type: "object",
        properties: {
          dateTime: { type: "string", description: "Start time in ISO 8601 format" },
          timeZone: { type: "string", description: "Timezone for the start time" }
        },
        required: ["dateTime"]
      },
      end: {
        type: "object",
        properties: {
          dateTime: { type: "string", description: "End time in ISO 8601 format" },
          timeZone: { type: "string", description: "Timezone for the end time" }
        },
        required: ["dateTime"]
      },
      timeZone: { type: "string", description: "Default timezone for the event" },
      attendees: {
        type: "array",
        items: {
          type: "object",
          properties: {
            email: { type: "string", description: "Attendee email address" },
            displayName: { type: "string", description: "Attendee display name" },
            optional: { type: "boolean", description: "Whether the attendee is optional" }
          },
          required: ["email"]
        },
        description: "List of event attendees"
      },
      sendNotifications: { type: "boolean", description: "Whether to send notifications to attendees" },
      status: { 
        type: "string", 
        enum: Object.values(EventStatus), 
        description: "Event status" 
      }
    },
    required: ["summary", "start", "end"]
  }
};

export async function handleCreateEvent(args: Record<string, unknown>) {
  // Validate input using the type guard
  if (!isCreateEventArgs(args)) {
    throw new Error('Invalid create event arguments. Required: summary (string), start (object with dateTime), end (object with dateTime)');
  }

  // Pass through the exact input to the service
  return await createEvent(args as CreateEventArgs);
}