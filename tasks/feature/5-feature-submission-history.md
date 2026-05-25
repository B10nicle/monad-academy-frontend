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

- unauthenticated users cannot open `/submissions`
- authenticated users can page through their submissions
- source code can be inspected without leaving the page
- execution metadata is readable
- status badges are consistent with task workspace status badges

## Dependencies

- feature/app-foundation
- feature/auth
