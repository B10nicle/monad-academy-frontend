# feature/submission-history

## Goal

Implement current user submission history.

The result of this feature must let authenticated users review their previous attempts across all tasks.

## Backend Endpoints

- `GET /api/submissions/my?page=<page>&size=<size>`

Response:

- `PageResponse<SubmissionResponse>`

## Functional Requirements

### 1. Submission history route

Route:

```text
/submissions
```

This route requires authentication.

### 2. Submission table

Render:

- status
- taskId
- createdAt
- updatedAt
- executionDurationMs
- source code preview action
- execution metadata preview action

### 3. Pagination

Use backend pagination:

- `page`
- `size`
- `totalElements`
- `totalPages`

Keep page state in query params when practical.

### 4. Source code preview

Provide a modal or drawer to inspect submitted source code.

The preview should be read-only and preserve formatting.

### 5. Execution metadata preview

Render `executionMetadata` defensively:

- pretty-print valid JSON
- show plain text otherwise
- show an empty state when absent

### 6. States

Handle:

- loading
- empty history
- API error
- unauthorized

## Acceptance Criteria

- [x] unauthenticated users cannot open `/submissions`
- [x] authenticated users can page through their submissions
- [x] source code can be inspected without leaving the page
- [x] execution metadata is readable
- [x] status badges are consistent with task workspace status badges

## Delivered

- `GET /api/submissions/my` integration
- `/submissions` page backed by authenticated API data
- query-param backed pagination through `page` and `size`
- submission table with status, task id, duration, created time, updated time, and actions
- source code preview dialog
- execution metadata preview dialog
- defensive metadata rendering for JSON, plain text, and empty values
- loading state
- empty state
- API error state with retry
- API service and page tests

## Dependencies

- feature/app-foundation
- feature/auth
