# Gmail MCP Server

A Model Context Protocol (MCP) server implementation for Gmail API integration, enabling AI assistants to interact with Gmail services.

## Features

### Core Functionality
- **Email Operations**
  - List emails with advanced filtering
  - Read specific emails with full content
  - Create and send new emails
  - Draft email management
- **Calendar Operations**
  - List upcoming calendar events
  - Read detailed event information
  - Event filtering and search
  - Timezone support
  - iOS calendar sync support
  
### Search & Filtering
- Gmail search query support
- Label-based filtering
- Customizable result limits
- Calendar event search capabilities

### Security
- Google OAuth2.0 integration
- Secure credential management
- Refresh token handling
- Multi-scope authorization support

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Cloud Platform account with Gmail and Calendar APIs enabled
- OAuth 2.0 credentials with appropriate scopes

### Installation

1. Clone and install dependencies:
   ```bash
   git clone [repository-url]
   cd gmail-mcp-server
   npm install
   ```

2. Configure environment:
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Add your credentials:
   GOOGLE_CLIENT_ID="your_client_id"
   GOOGLE_CLIENT_SECRET="your_client_secret"
   REDIRECT_URI="http://localhost:4100/code"
   GOOGLE_REFRESH_TOKEN="your_refresh_token"
   ```

3. Build and run:
   ```bash
   npm run build
   npm start
   ```

## Development

### Available Scripts
- `npm run dev` - Build and run with watch mode
- `npm run build` - Build the project
- `npm run clean` - Clean build artifacts
- `npm run watch` - Watch for changes

### Project Structure
```
gmail-mcp-server/
├── src/
│   ├── config/       # Configuration and setup
│   ├── services/     # Core business logic
│   ├── tools/        # MCP tool implementations
│   └── types/        # TypeScript definitions
├── dist/            # Compiled JavaScript
└── tests/           # Test files (pending)
```

### API Interface

#### List Messages
```typescript
list({
  maxResults?: number,    // Default: 10
  query?: string,         // Gmail search query
  labelIds?: string[],    // Filter by labels
  verbose?: boolean       // Include details
})
```

#### Read Message
```typescript
read({
  messageId: string    // Message ID to fetch
})
```

#### Create Draft
```typescript
draft({
  to: string[],
  subject: string,
  body: string,
  cc?: string[],
  bcc?: string[],
  isHtml?: boolean
})
```

#### Send Email
```typescript
send({
  to: string[],
  subject: string,
  body: string,
  cc?: string[],
  bcc?: string[],
  isHtml?: boolean,
  draftId?: string    // Optional: send existing draft
})
```

#### Calendar Operations
```typescript
// List Events
listEvents({
  maxResults?: number,    // Default: 25
  timeMin?: string,       // Start time (ISO 8601)
  timeMax?: string,       // End time (ISO 8601)
  query?: string,         // Text search term
  timeZone?: string      // Default: Australia/Brisbane
})

// Read Event Details
readEvent({
  eventId: string,       // Event ID to fetch details
  timeZone?: string     // Default: Australia/Brisbane
})
```

## Error Handling
The server implements comprehensive error handling for:
- Authentication failures
- API rate limits
- Invalid requests
- Network issues
- Calendar sync issues
- Event ID validation
- Timezone validation

## Contributing
Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Changelog
See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

## Roadmap
See [Backlog.md](Backlog.md) for planned features and improvements.

## License
MIT License - see [LICENSE](LICENSE) for details.