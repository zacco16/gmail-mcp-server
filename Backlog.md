# Gmail MCP Server Backlog

## High Priority

### Testing Framework Implementation (In Progress)
- Initial Test Framework Configuration
  - ✓ Jest configuration optimized
  - ✓ Directory structure established
  - ✓ Basic test patterns implemented
  - ✓ Performance issues resolved

- Tools Layer (Primary Focus)
  - Message Tools
    - ✓ Test listEmails interface
    - ✓ Test readEmail functionality
    - ✓ Test draftEmail creation
    - ✓ Test sendEmail operations
  - Calendar Tools (Next Priority)
    - [ ] Test listEvents interface
    - [ ] Test readEvent functionality
  - Draft Tools
    - ✓ Test listDrafts functionality
    - ✓ Test readDraft operations
    - ✓ Test deleteDraft operations
      - Unit tests for deletion scenarios
      - Error handling validation
      - Input parameter checks
    - ✓ Test updateDraft operations
      - Unit tests for various update scenarios
      - Partial update support
      - Error handling validation
      - Input parameter checks

- Services Layer
  - Gmail Service
    - ✓ Basic message service tests
    - [ ] Draft management service tests
    - [ ] Email sending service tests
  - Calendar Service
    - [ ] Event service tests
    - [ ] Timezone handling
  - Error Handling Layer
    - [ ] API error scenarios
    - [ ] Rate limit handling
    - [ ] Network failures
    - [ ] Authentication failures

- Test Coverage Expansion
  - [ ] Add edge case coverage
  - [ ] Expand error scenario testing
  - [ ] Add input validation tests
  - [ ] Test response formatting

- Integration Tests (Future)
  - [ ] End-to-end email flow tests
  - [ ] Draft creation to send workflow
  - [ ] Calendar event management
  - [ ] Authentication flow
  - [ ] Rate limit recovery

- Test Infrastructure (Future)
  - [ ] Set up CI/CD test pipeline
  - [ ] Implement test coverage reporting
  - [ ] Add performance benchmarks
  - [ ] Create test data generators
  - [ ] Add snapshot testing for responses

[Rest of backlog remains unchanged...]