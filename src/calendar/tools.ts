export const CALENDAR_TOOLS = {
  listCalendars: {
    name: "listCalendars",
    description: "List available Google calendars",
    inputSchema: {
      type: "object",
      properties: {
        maxResults: {
          type: "number",
          description: "Maximum number of calendars to return (default: 10)"
        },
        showDeleted: {
          type: "boolean",
          description: "Include deleted calendars in the results"
        }
      }
    }
  }
} as const;

export type CalendarToolNames = keyof typeof CALENDAR_TOOLS;