# Gmail MCP Server Backlog

## High Priority

### Core Functionality
- Draft email editing capabilities
  - Ability to modify existing drafts
  - Support for updating subject, body, and recipients
  - Handle HTML formatting properly
  - Add endpoints for listing and deleting drafts

### Security & Stability
- Implement rate limiting
  - Add request throttling
  - Handle Gmail API quotas gracefully
  - Add retry mechanisms for failed requests
- Improve error handling
  - Standardize error responses
  - Add detailed error logging
  - Implement error recovery strategies

### Testing and Quality
- Implement comprehensive unit testing framework
  - Set up Jest testing environment
  - Add test coverage reporting (aim for 80%+ coverage)
  - Create mock Gmail API responses
  - Test error handling scenarios
  - Add integration tests for critical paths

## Medium Priority

### Email Configuration
- Add support for email configuration and signatures
  - Implement small text signature "Sent by Zac's AI assistant"
  - Support for HTML formatting in signatures
  - Allow customizable signature templates
  - Handle different email formats (plain text vs HTML)
  - Add signature position options

### Monitoring & Logging
- Add structured logging system
  - Implement request/response logging
  - Add performance monitoring
  - Set up error tracking
  - Create log rotation system

### Documentation
- Improve API documentation
  - Add OpenAPI/Swagger specifications
  - Create postman collection
  - Add code examples for common operations

## Future Enhancements

### GSuite Integration
- Integrate with Google Drive for Lions schedule
  - Add file search capabilities
  - Implement file reading/downloading
  - Handle different file formats (docs, sheets, etc.)
  - Add file metadata handling

### Calendar Integration
- Add support for Google Calendar and iOS calendar
  - Event creation and modification
  - Calendar search and filtering
  - Handle recurring events
  - Cross-platform calendar sync consideration
  - Add timezone handling

### Performance Optimization
- Implement caching system
  - Cache frequently accessed messages
  - Add message metadata caching
  - Optimize API calls
- Add batch operations support
  - Implement bulk message operations
  - Add parallel processing where applicable

## Technical Debt
- Refactor authentication flow
- Clean up type definitions
- Add request validation middleware
- Standardize logging format
- Add health check endpoints