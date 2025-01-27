# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [1.1.1] - 2025-01-27

### Added
- Comprehensive draft message management functionality
  - List drafts with search and filtering
  - Read draft content with headers
  - Update draft content and recipients
  - Delete drafts safely
- New Gmail service structure with modular organization

### Changed
- Restructured repository for better code organization
  - Separated services into focused modules
  - Reorganized tools by functionality
  - Improved type definitions and validation
- Enhanced documentation with detailed API examples
- Standardized error handling across services

### Fixed
- Schema inconsistencies in API responses
- Draft update content preservation issues
- Various bugs in underlying functionality

## [1.1.0] - 2025-01-25

### Added
- Calendar event reading functionality
  - Full event details retrieval
  - Support for timezone handling
  - Comprehensive event information display
- Event ID visibility in list outputs
- Enhanced event detail formatting
- Event organizer information display

### Changed
- Updated documentation to reflect calendar feature completion
- Improved confidence assessment from 8/10 to 9/10
- Enhanced event display formatting

### Fixed
- Event ID visibility in list outputs
- DateTime formatting consistency
- Timezone handling in event displays

## [1.0.0] - Initial Release

### Added
- Gmail integration with OAuth2 support
- Basic calendar functionality
- Event listing capability
- Message handling features
- Email operations support