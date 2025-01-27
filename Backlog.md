# Gmail MCP Server Backlog

## High Priority

### Core Functionality
- Enhanced Draft Features
  - Draft templates support
  - Scheduled drafts
  - Draft categories/labels
  - Batch draft operations

### Calendar Integration (In Progress)
- Complete Google Calendar API integration
  - Event listing functionality (✓ implemented)
  - Event reading functionality (✓ implemented)
  - Event creation and modification (pending)
  - Handle recurring events
  - Add comprehensive timezone support
- iOS Calendar Sync
  - Implement sync mechanism
  - Handle sync conflicts
  - Support for local calendar updates
  - Offline sync capability
- Calendar UI/Response Formatting
  - Standardize event display format (✓ implemented)
  - Add support for different view types
  - Implement filtering options

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
  - Add Calendar API mock responses
  - Test error handling scenarios
  - Add integration tests for critical paths
  - Add draft operation test coverage

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
  - Add calendar sync monitoring

### Documentation
- Improve API documentation
  - Add OpenAPI/Swagger specifications
  - Create postman collection
  - Add code examples for common operations
  - Document calendar integration features (✓ completed)
  - Document draft management features (✓ completed)

## Future Enhancements

### GSuite Integration
- Integrate with Google Drive for Lions schedule
  - Add file search capabilities
  - Implement file reading/downloading
  - Handle different file formats (docs, sheets, etc.)
  - Add file metadata handling

### Performance Optimization
- Implement caching system
  - Cache frequently accessed messages
  - Add message metadata caching
  - Cache calendar event data
  - Optimize API calls
  - Cache draft metadata
- Add batch operations support
  - Implement bulk message operations
  - Add parallel processing where applicable
  - Support batch calendar operations
  - Support batch draft operations

## Technical Debt
- Refactor authentication flow
- Clean up type definitions
- Add request validation middleware
- Standardize logging format
- Add health check endpoints
- Improve calendar sync error handling
- Refine draft update error handling