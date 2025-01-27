export * from './events.js';
export * from './types.js';

import { listEvents, readEvent } from './events.js';

// Backward compatibility
export const Calendar = {
  listEvents,
  readEvent
};