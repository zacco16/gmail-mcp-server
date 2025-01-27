# AI Assistant Context Document

## Filesystem Access
The AI assistant has access to the local branch through the filesystem, typically located at:
- Base path: `/users/zackonstas/projects/gmail-mcp-server`
- Source code: `/users/zackonstas/projects/gmail-mcp-server/src`
- Configuration: `/users/zackonstas/projects/gmail-mcp-server/.env`

When reading or modifying files, use the filesystem paths relative to the project root.

## Project Overview
A Model Context Protocol (MCP) server that enables AI assistants to interact with Gmail and Calendar services through a standardized, type-safe interface.

## Key Components

### Core Services Architecture

#### GmailService (`src/services/gmail/*.ts`)
- **Message Operations**
  - List messages with advanced filtering
  - Read specific message details
  - Send emails
  - Comprehensive email validation

- **Draft Management**
  - Create new drafts
  - List and read existing drafts
  - Update draft content
  - Delete drafts
  - Preserve draft metadata
  - Support HTML and plain text

#### CalendarService (`src/services/calendar/index.ts`)
- **Event Handling**
  - Full event details retrieval
  - Timezone conversion (via luxon)
  - Consistent response formatting
  - Event status and timing metadata

#### Authentication (`src/config/auth.ts`)
- OAuth2 setup
- Google API initialization
- Secure token management
- Multi-scope authorization

#### Constants (`src/config/constants.ts`)
- Configuration value definitions
- API scope constraints
- Default parameter settings

### Tools Layer Implementation

#### Message Tools (`src/tools/messages/`)
- Granular operation handlers
- Separate concerns for each email action
- Consistent input validation
- Wrapped service method calls

#### Draft Management Tools (`src/tools/drafts/`)
- Focused tool implementations
  - List drafts with search/filter
  - Read full draft content
  - Partial update support
  - Safe deletion mechanism
- Preserves unmodified content
- Handles HTML/plain text drafts

#### Calendar Tools (`src/tools/calendar/`)
- Event listing with advanced filtering
- Timezone-aware event reading
- Reference ID preservation
- Comprehensive event data exposure

### Type System Design
- Located in `src/types/gmail.ts` and `src/types/calendar.ts`
- Strict interface definitions
- Type guard implementations
- Comprehensive validation

## Development Patterns

### Error Handling Strategy
- Uniform response interfaces
- Pre-operation type validation
- Detailed error messaging
- Graceful degradation
- Specific error type handling

### Configuration Management
- Environment-driven configuration
- Secure credential handling
- Explicit API scope definitions
- Modular configuration approach

### Common Implementation Patterns

1. **Email Operations**
   - Service method encapsulation
   - Type-safe tool handlers
   - Consistent validation logic

2. **Calendar Operations**
   - ISO 8601 time handling
   - Default timezone (Australia/Brisbane)
   - Consistent response formatting
   - Unique ID preservation

3. **Tool Modifications**
   - Dual update (tool + handler)
   - Type definition synchronization
   - Registry updates

## Key Implementation Watchouts

1. OAuth refresh token management
2. Gmail API rate limit handling
3. Message size limitations
4. Email address validation
5. Timezone conversion complexity
6. Calendar sync edge cases
7. Content-Type handling

## Testing Considerations
- Comprehensive unit test coverage
- Mock API response generation
- Error scenario validation
- Integration path testing

## Development Guidelines
1. Maintain strict type safety
2. Follow established error patterns
3. Keep documentation synchronized
4. Consider cross-platform implications
5. Prioritize modular design

This document tracks significant architectural patterns and implementation insights. Update with any substantial changes to project structure or design philosophy.
