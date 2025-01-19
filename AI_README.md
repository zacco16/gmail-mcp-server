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
- **GmailService** (`src/services/gmail.ts`): Central service handling all Gmail operations
- **CalendarService** (`src/services/calendar/index.ts`): Handles Google Calendar operations
- **Authentication** (`src/config/auth.ts`): OAuth2 setup and Google API initialization
- **Constants** (`src/config/constants.ts`): Configuration values and constraints

### Tools Implementation
- List Messages (`src/tools/list.ts`)
- Read Message (`src/tools/read.ts`)
- Draft Email (`src/tools/draft.ts`)
- Send Email (`src/tools/send.ts`)
- Calendar Events (`src/tools/calendar/list.ts`)

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

3. Configuration Updates:
   - New constants go in constants.ts
   - Authentication changes in auth.ts
   - Environment variables in .env

4. Tool Modifications:
   - Update both tool definition and handler
   - Register in tools/index.ts
   - Add corresponding types

## Current Backlog Status
- Draft email editing capabilities needed
- Testing framework to be implemented
- Email configuration and signatures pending
- Calendar integration in progress

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

## Testing Considerations
- Unit tests pending implementation
- Mock Gmail and Calendar API responses needed
- Error scenarios to be covered
- Calendar sync testing required

This document should be updated with any significant architectural changes or new patterns introduced.