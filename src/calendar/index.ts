import { MCPRequest, ServiceContext, ToolResponse } from '../types/common.js';
import { CALENDAR_TOOLS } from './tools.js';
import { CalendarHandlers } from './handlers.js';
import { ListCalendarsArgs } from './types.js';

export * from './types.js';
export { CALENDAR_TOOLS } from './tools.js';

export function registerCalendarTools(context: ServiceContext) {
  const { auth } = context;
  const handlers = new CalendarHandlers(auth);

  return async (request: MCPRequest): Promise<ToolResponse | null> => {
    const { name, arguments: args = {} } = request.params;

    switch (name) {
      case "calendar.list":
        return await handlers.listCalendars(args as ListCalendarsArgs);
      default:
        return null;
    }
  };
}