# Testing Documentation

## Directory Structure
The test directory mirrors the main source code structure to maintain clear organization and make tests easy to locate:

```
tests/
├── services/           # Tests for core service implementations
│   ├── gmail/         # Gmail service tests
│   │   ├── messages.test.ts
│   │   ├── drafts.test.ts
│   │   └── send.test.ts
│   └── calendar/      # Calendar service tests
│       └── events.test.ts
└── tools/             # Tests for MCP tool implementations
    ├── messages/      # Email message tool tests
    │   ├── list.test.ts
    │   ├── read.test.ts
    │   ├── draft.test.ts
    │   └── send.test.ts
    ├── drafts/        # Draft management tool tests
    │   ├── list.test.ts
    │   ├── read.test.ts
    │   ├── update.test.ts
    │   └── delete.test.ts
    └── calendar/      # Calendar tool tests
        ├── list.test.ts
        └── read.test.ts
```

## Test Categories

### Service Tests
Test the core business logic and API interactions:
- Gmail Services (`services/gmail/`)
  - Message operations (list, read)
  - Draft management
  - Send functionality
- Calendar Services (`services/calendar/`)
  - Event operations
  - Timezone handling
  - Data formatting

### Tool Tests
Test the MCP tool interfaces and handlers:
- Message Tools (`tools/messages/`)
  - List messages functionality
  - Read message details
  - Draft creation
  - Send operations
- Draft Tools (`tools/drafts/`)
  - Draft management operations
  - Content updates
  - Deletion handling
- Calendar Tools (`tools/calendar/`)
  - Event listing
  - Event details retrieval

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch

# Run specific test file
npm test -- tests/services/gmail/messages.test.ts

# Run tests matching a pattern
npm test -- -t "list messages"
```

## Test Guidelines

1. **Mocking**
   - Mock external API calls (Gmail, Calendar)
   - Use Jest mock functions for dependencies
   - Provide realistic mock responses

2. **Coverage Goals**
   - Aim for 80%+ coverage
   - Focus on error handling paths
   - Test edge cases thoroughly

3. **Test Structure**
   - Group related tests with describe blocks
   - Clear test descriptions
   - One assertion per test when possible

4. **Common Scenarios to Test**
   - Happy path - expected inputs/outputs
   - Error handling
   - Edge cases
   - Input validation
   - API response parsing
   - Rate limit handling

## Examples

### Service Test Example
```typescript
describe('Gmail Service - List Messages', () => {
  it('returns formatted message list', async () => {
    // Test implementation
  });

  it('handles empty response', async () => {
    // Test implementation
  });

  it('handles API errors', async () => {
    // Test implementation
  });
});
```

### Tool Test Example
```typescript
describe('List Messages Tool', () => {
  it('processes valid arguments', async () => {
    // Test implementation
  });

  it('validates input parameters', async () => {
    // Test implementation
  });

  it('formats response correctly', async () => {
    // Test implementation
  });
});
```

## Adding New Tests

When adding new functionality:
1. Create corresponding test file matching source structure
2. Mock any external dependencies
3. Cover main functionality and edge cases
4. Update test coverage reports
5. Document any special testing considerations

## Test Utilities

Common test utilities and mocks are located in `tests/utils/`:
- API response mocks
- Test data generators
- Common test helpers