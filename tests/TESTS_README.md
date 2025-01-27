# Testing Documentation

## Directory Structure
The test directory mirrors the main source code structure to maintain clear organization and make tests easy to locate:

```
tests/
├── services/           # Tests for core service implementations
│   ├── gmail/         # Gmail service tests
│   │   └── messages.test.ts    # Currently limited coverage
│   └── calendar/      # Calendar service tests (pending)
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

## Current Testing Status

### Coverage Overview
- **Tools Layer**: 100% Coverage
- **Services Layer**: ~20% Coverage
- **Error Handling**: ~10% Coverage
- **Overall Project**: ~50% Coverage

### Completed Tests
- ✓ All Tools Layer Tests
  - Drafts Tools (List, Read, Update, Delete)
  - Messages Tools (List, Read, Draft, Send)
  - Calendar Tools (List, Read)

### Pending Tests
- [ ] Gmail Services Layer
  - [ ] Draft Management Service
  - [ ] Email Sending Service
- [ ] Calendar Services
  - [ ] Event Service Tests
  - [ ] Timezone Handling
- [ ] Comprehensive Error Handling
  - [ ] API Error Scenarios
  - [ ] Rate Limit Tests
  - [ ] Network Failure Simulations

## Test Development Roadmap
1. Implement Gmail Services Layer Tests
2. Develop Comprehensive Error Handling Tests
3. Add Calendar Services Tests
4. Create Integration Tests

[Rest of the previous README content remains unchanged...]