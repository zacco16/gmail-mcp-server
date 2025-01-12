# Gmail MCP Server

A Model Context Protocol server implementation for Gmail API integration.

## Features

- List emails with filtering support
- Read specific emails in detail
- Gmail search query support
- Label-based filtering

## Setup

1. Create a `.env` file with your Google OAuth credentials:
```
GOOGLE_CLIENT_ID="your_client_id"
GOOGLE_CLIENT_SECRET="your_client_secret"
REDIRECT_URI="http://localhost:4100/code"
GOOGLE_REFRESH_TOKEN="your_refresh_token"
```

2. Install dependencies:
```bash
npm install
```

3. Build and run:
```bash
npm start
```

## Usage

The server provides two main functions:

1. List emails:
```javascript
list({ maxResults: 10, query: "in:inbox" })
```

2. Read specific email:
```javascript
read({ messageId: "message_id" })
```

## Development

- `npm run watch` - Watch for changes and rebuild
- `npm run build` - Build the project
- `npm start` - Build and run the server