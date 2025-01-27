# AI Assistant Context Document

[Previous content remains the same until Tools Implementation section]

### Tools Implementation
- Message Operations (`src/tools/messages/`):
  - List Emails (`listEmails`)
  - Read Email (`readEmail`)
  - Draft Email (`draftEmail`)
  - Send Email (`sendEmail`)
- Draft Management (`src/tools/drafts/`):
  - List Drafts (`listDrafts`)
    - Supports search and filtering
    - Shows draft IDs for reference
  - Read Draft (`readDraft`)
    - Full draft content retrieval
    - Includes all recipients and headers
  - Update Draft (`updateDraft`)
    - Partial updates supported
    - Preserves unchanged content
    - Handles HTML/plain text
  - Delete Draft (`deleteDraft`)
    - Safe draft removal
    - Confirms deletion success
- Calendar Operations (`src/tools/calendar/`):
  - List Events (`listEvents`)
    - Supports search and filtering
    - Handles timezone conversions
    - Shows event IDs for reference
    - Includes status and timing
  - Read Event Details (`readEvent`)
    - Full event information retrieval
    - Supports timezone specification
    - Includes organizer details
    - Shows comprehensive event data

[Rest of the content remains exactly the same]