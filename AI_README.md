# AI Assistant Context Document

## Filesystem Access
The AI assistant has access to the local branch through the filesystem, typically located at:
- Base path: `/users/zackonstas/projects/gmail-mcp-server`
- Source code: `/users/zackonstas/projects/gmail-mcp-server/src`
- Configuration: `/users/zackonstas/projects/gmail-mcp-server/.env`

When reading or modifying files, use the filesystem paths relative to the project root.

## Project Overview
This is a Gmail Model Context Protocol (MCP) server implementation that enables AI assistants to interact with Gmail and Calendar services through a standardized interface.

## Key Components

### Core Services
- **GmailService** (`src/services/gmail/*.ts`): 
  - Message operations (list, read, send)
  - Draft management (create, read, update, delete)
  - Email formatting and validation
- **CalendarService** (`src/services/calendar/index.ts`): Handles Google Calendar operations
  - Event listing with full details
  - Event reading with timezone support
  - Formats human-readable outputs
  - Handles timezone conversions via luxon
  - Returns consistent response format
- **Authentication** (`src/config/auth.ts`): OAuth2 setup and Google API initialization
- **Constants** (`src/config/constants.ts`): Configuration values and constraints

### Tools Implementation
- Message Operations (`src/tools/messages/`):
  - List Messages (`list.ts`)
  - Read Message (`read.ts`)
  - Draft Email (`draft.ts`)
  - Send Email (`send.ts`)
- Draft Management (`src/tools/drafts/`):
  - List Drafts (`list.ts`)
    - Supports search and filtering
    - Shows draft IDs for reference
  - Read Draft (`read.ts`)
    - Full draft content retrieval
    - Includes all recipients and headers
  - Update Draft (`update.ts`)
    - Partial updates supported
    - Preserves unchanged content
    - Handles HTML/plain text
  - Delete Draft (`delete.ts`)
    - Safe draft removal
    - Confirms deletion success
- Calendar Operations (`src/tools/calendar/`):
  - List Events (`list.ts`)
    - Supports search and filtering
    - Handles timezone conversions
    - Shows event IDs for reference
    - Includes status and timing
  - Read Event Details (`read.ts`)
    - Full event information retrieval
    - Supports timezone specification
    - Includes organizer details
    - Shows comprehensive event data

### Type System
- Located in `src/types/gmail.ts` and `src/types/calendar.ts`
- Includes interfaces for all operations
- Contains type guards for validation
- Calendar-specific type definitions

## Development Patterns

### Error Handling
- All tools wrap responses in appropriate Response interfaces
- Type validation occurs before operations
- Email validation includes format and size checks
- Calendar operations include timezone validation

### Configuration
- Environment variables expected in `.env`
- OAuth2 credentials required for operation
- Gmail and Calendar API scopes defined in auth.ts

### Common Changes
1. Email Operations:
   - New functionality typically added to GmailService
   - Tool handlers wrap service methods
   - Type definitions needed in gmail.ts

2. Calendar Operations:
   - Functionality implemented in CalendarService
   - Event handling and timezone support
   - iOS calendar sync considerations
   - All events include unique IDs
   - Times handled in ISO 8601 format
   - Default timezone is Australia/Brisbane
   - Consistent response formatting

3. Configuration Updates:
   - New constants go in constants.ts
   - Authentication changes in auth.ts
   - Environment variables in .env

4. Tool Modifications:
   - Update both tool definition and handler
   - Register in tools/index.ts
   - Add corresponding types

## Current Backlog Status
- Event creation and modification pending
- Testing framework to be implemented
- Email configuration and signatures pending
- Recurring events handling needed
- Calendar sync implementation needed

## Development Guidelines
1. Maintain type safety throughout
2. Follow established error handling patterns
3. Update tool registry when adding features
4. Keep documentation in sync with changes
5. Consider timezone implications for calendar operations

## Common Gotchas
1. OAuth refresh token handling
2. Gmail API rate limits
3. Message size limitations
4. Email validation requirements
5. Calendar timezone conversions
6. iOS calendar sync edge cases
7. Event recurrence handling
8. Event IDs must be preserved and visible in list output
9. DateTime format consistency required
10. Event details should be complete for iOS sync
11. Draft updates must preserve unmodified content
12. Content-Type handling for HTML drafts

## Testing Considerations
- Unit tests pending implementation
- Mock Gmail and Calendar API responses needed
- Error scenarios to be covered
- Calendar sync testing required

This document should be updated with any significant architectural changes or new patterns introduced.