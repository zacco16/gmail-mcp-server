# AI Assistant Context Document

## Filesystem Access
The AI assistant has access to the local branch through the filesystem, typically located at:
- Base path: `/users/zackonstas/projects/gmail-mcp-server`
- Source code: `/users/zackonstas/projects/gmail-mcp-server/src`
- Configuration: `/users/zackonstas/projects/gmail-mcp-server/.env`

When reading or modifying files, use the filesystem paths relative to the project root.

## Project Overview
This is a Gmail Model Context Protocol (MCP) server implementation that enables AI assistants to interact with Gmail services through a standardized interface.

## Key Components

### Core Services
- **GmailService** (`src/services/gmail.ts`): Central service handling all Gmail operations
- **Authentication** (`src/config/auth.ts`): OAuth2 setup and Gmail API initialization
- **Constants** (`src/config/constants.ts`): Configuration values and constraints

### Tools Implementation
- List Messages (`src/tools/list.ts`)
- Read Message (`src/tools/read.ts`)
- Draft Email (`src/tools/draft.ts`)
- Send Email (`src/tools/send.ts`)

### Type System
- Located in `src/types/gmail.ts`
- Includes interfaces for all operations
- Contains type guards for validation

## Development Patterns

### Error Handling
- All tools wrap responses in `MessageResponse` interface
- Type validation occurs before operations
- Email validation includes format and size checks

### Configuration
- Environment variables expected in `.env`
- OAuth2 credentials required for operation
- Gmail API scopes defined in auth.ts

### Common Changes
1. Email Operations:
   - New functionality typically added to GmailService
   - Tool handlers wrap service methods
   - Type definitions needed in gmail.ts

2. Configuration Updates:
   - New constants go in constants.ts
   - Authentication changes in auth.ts
   - Environment variables in .env

3. Tool Modifications:
   - Update both tool definition and handler
   - Register in tools/index.ts
   - Add corresponding types

## Current Backlog Status
- Draft email editing capabilities needed
- Testing framework to be implemented
- Email configuration and signatures pending
- GSuite/Calendar integration planned

## Development Guidelines
1. Maintain type safety throughout
2. Follow established error handling patterns
3. Update tool registry when adding features
4. Keep documentation in sync with changes

## Common Gotchas
1. OAuth refresh token handling
2. Gmail API rate limits
3. Message size limitations
4. Email validation requirements

## Testing Considerations
- Unit tests pending implementation
- Mock Gmail API responses needed
- Error scenarios to be covered

This document should be updated with any significant architectural changes or new patterns introduced.