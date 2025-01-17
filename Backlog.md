# Gmail MCP Server Backlog

## Features and Improvements

### Core Functionality
- Draft email editing capabilities
  - Ability to modify existing drafts
  - Support for updating subject, body, and recipients
  - Handle HTML formatting properly

### Testing and Quality
- Implement comprehensive unit testing framework
  - Set up Jest or similar testing framework
  - Add test coverage reporting
  - Create mock Gmail API responses
  - Test error handling scenarios

### Email Configuration
- Add support for email configuration and signatures
  - Implement small text signature "Sent by Zac's AI assistant"
  - Support for HTML formatting in signatures
  - Allow customizable signature templates
  - Handle different email formats (plain text vs HTML)

### GSuite Integration
- Integrate with Google Drive for Lions schedule
  - Add file search capabilities
  - Implement file reading/downloading
  - Handle different file formats (docs, sheets, etc.)

### Calendar Integration
- Add support for Google Calendar and iOS calendar
  - Event creation and modification
  - Calendar search and filtering
  - Handle recurring events
  - Cross-platform calendar sync consideration

## Technical Debt
- Error Handling Implementation (HIGH PRIORITY)
  - Create centralized error handling utility in lib/errors:
    - Custom error classes for different scenarios
    - Type guards for validation
    - Error response formatting
  - Implement validation utilities in lib/validation:
    - Email validation
    - Request parameter validation
    - Type checking utilities
  - Integration points:
    - Replace current type checks with new utilities
    - Standardize error responses
    - Add logging for errors
- Add request validation
- Implement rate limiting
- Add logging system
- Improve documentation