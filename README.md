# Gmail MCP Server

A Model Context Protocol (MCP) server implementation for Gmail API integration, enabling AI assistants to interact with Gmail services.

## Features

### Email Management
- List emails with advanced filtering
- Read specific emails with full content and attachments
- Create and send new emails
- Draft email management
- Gmail search query support
- Label-based filtering

### Authentication
- Google OAuth2.0 integration
- Secure credential management
- Refresh token handling

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Cloud Platform account with Gmail API enabled
- OAuth 2.0 credentials

## Setup

1. **Google Cloud Platform Setup**
   - Create a new project in Google Cloud Console
   - Enable Gmail API
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **Environment Configuration**
   Create a `.env` file with your Google OAuth credentials:
   ```
   GOOGLE_CLIENT_ID="your_client_id"
   GOOGLE_CLIENT_SECRET="your_client_secret"
   REDIRECT_URI="http://localhost:4100/code"
   GOOGLE_REFRESH_TOKEN="your_refresh_token"
   ```

3. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]
   cd gmail-mcp-server

   # Install dependencies
   npm install

   # Build the project
   npm run build
   ```

## Usage

### Starting the Server
```bash
npm start
```

### API Functions

1. **List Emails**
   ```javascript
   list({
     maxResults: 10,          // Optional: Number of results (default: 10)
     query: "in:inbox",       // Optional: Gmail search query
     labelIds: ["INBOX"],     // Optional: Filter by labels
     verbose: false           // Optional: Include full message details
   })
   ```

2. **Read Email**
   ```javascript
   read({
     messageId: "message_id"  // Required: ID of the message to read
   })
   ```

3. **Create Draft**
   ```javascript
   draft({
     to: ["recipient@example.com"],
     subject: "Email Subject",
     body: "Email body content",
     cc: ["cc@example.com"],        // Optional
     bcc: ["bcc@example.com"],      // Optional
     isHtml: false                  // Optional: Set true for HTML content
   })
   ```

4. **Send Email**
   ```javascript
   send({
     to: ["recipient@example.com"],
     subject: "Email Subject",
     body: "Email body content",
     cc: ["cc@example.com"],        // Optional
     bcc: ["bcc@example.com"],      // Optional
     isHtml: false,                 // Optional: Set true for HTML content
     draftId: "draft_id"            // Optional: Send existing draft
   })
   ```

## Development

### Available Scripts
- `npm run watch` - Watch for changes and rebuild
- `npm run build` - Build the project
- `npm start` - Build and run the server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Project Structure
```
gmail-mcp-server/
├── src/                # Source code
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── services/      # Business logic
│   └── types/         # TypeScript type definitions
├── dist/              # Compiled JavaScript
└── tests/             # Test files
```

### Error Handling
The server implements comprehensive error handling for:
- Authentication failures
- API rate limits
- Invalid requests
- Network issues

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Backlog
See [Backlog.md](Backlog.md) for planned features and improvements.

## License
MIT License - see [LICENSE](LICENSE) for details