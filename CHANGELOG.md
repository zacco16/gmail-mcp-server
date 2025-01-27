# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-01-27

### Added
- Comprehensive test suite for draft management tools
  - Delete draft tool testing
  - Update draft tool testing
  - Expanded error handling test coverage
- Enhanced test error handling strategies
- Detailed test documentation in AI_README.md

### Changed
- Refined error handling in draft management tools
- Improved test isolation and mocking techniques
- Updated project testing documentation

### Fixed
- Inconsistent parameter handling in draft update tool
- Type safety improvements in draft management tests
- Suppressed unnecessary console errors during testing

## [1.3.0] - 2025-01-27

### Added
- Jest testing framework setup with TypeScript support
- Initial test structure mirroring source code
- Gmail service message listing tests
- Test utilities for mocking Gmail and Calendar APIs
- Testing documentation and guidelines

### Changed
- Updated project scripts to include test commands
- Enhanced Node.js memory handling for tests

## [1.2.0] - 2025-01-27

### Changed
- Renamed core email tool interfaces for better clarity:
  - `list` -> `listEmails`
  - `read` -> `readEmail`
  - `draft` -> `draftEmail`
  - `send` -> `sendEmail`
- Updated documentation to reflect new tool names

### Breaking Changes
- Email tool name changes require updates to any client implementations
- Previous tool names are no longer supported

[Previous entries remain unchanged...]