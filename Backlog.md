# Gmail MCP Server Backlog

## High Priority

### Testing Framework Implementation (In Progress)
- Initial Test Framework Configuration
  - ✓ Jest configuration optimized
  - ✓ Directory structure established
  - ✓ Basic test patterns implemented
  - ✓ Performance issues resolved

- Services Layer Testing (Immediate Priority)
  - Calendar Service
    - [ ] Complete Calendar Events service tests
      - Event listing implementation
      - Error handling scenarios
      - Response formatting
    - [ ] Event service tests
    - [ ] Timezone handling tests
    - [ ] Event creation service tests
  - Gmail Service
    - [ ] Draft management service tests
    - [ ] Email sending service tests
  - Error Handling Layer
    - [ ] API error scenarios
    - [ ] Rate limit handling
    - [ ] Network failure tests
    - [ ] Authentication failure tests

- Tools Layer Testing
  - Message Tools
    - ✓ Test listEmails interface
    - ✓ Test readEmail functionality
    - ✓ Test draftEmail creation
    - ✓ Test sendEmail operations
  - Calendar Tools
    - ✓ Test listEvents interface
    - ✓ Test readEvent functionality
    - [ ] Test createEvent functionality
  - Draft Tools
    - ✓ Test listDrafts functionality
    - ✓ Test readDraft operations
    - ✓ Test deleteDraft operations
      - Comprehensive error handling
      - Input validation tests
    - ✓ Test updateDraft operations
      - Partial update support testing
      - Error scenario validation

- Test Coverage Expansion
  - [ ] Add comprehensive edge case coverage
  - [ ] Expand error scenario testing
  - [ ] Implement thorough input validation tests
  - [ ] Test response formatting consistency

- Integration Tests (Future Milestone)
  - [ ] End-to-end email workflow tests
  - [ ] Draft creation to send workflow
  - [ ] Calendar event management tests
    - [ ] Event creation test scenarios
  - [ ] Authentication flow validation
  - [ ] Rate limit recovery scenarios

- Test Infrastructure
  - [ ] Set up CI/CD test pipeline
  - [ ] Implement test coverage reporting
  - [ ] Add performance benchmarking
  - [ ] Create comprehensive test data generators
  - [ ] Implement snapshot testing for responses

## Medium Priority

### Feature Enhancements
- Email Configuration
  - [ ] Support for email signatures
  - [ ] Advanced filtering capabilities
- Calendar Improvements
  - [x] Create event functionality
  - [ ] Recurring event handling
  - [ ] Enhanced iOS calendar sync
  - [ ] Event conflict detection
  - [ ] Advanced attendee management
- Authentication
  - [ ] Refresh token management improvements
  - [ ] Multi-account support

## Low Priority

### Future Considerations
- Advanced Search Capabilities
- Machine Learning Integration
- Enhanced Reporting Features
- Cross-Platform Sync Improvements