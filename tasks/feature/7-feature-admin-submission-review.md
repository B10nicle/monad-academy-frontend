# feature/admin-submission-review

## Goal

Implement admin tools for reviewing user submissions.

The result of this feature must let admins inspect submissions across users and tasks.

## Backend Endpoints

- `GET /api/admin/submissions`
- `GET /api/admin/users/{userId}/submissions`

Supported query parameters:

- userId
- taskId
- status
- page
- size

## Functional Requirements

### 1. Admin submission route

Route:

```text
/admin/submissions
```

This route requires `ADMIN`.

### 2. Submission table

Render:

- id
- userId
- taskId
- status
- executionDurationMs
- createdAt
- updatedAt
- source code preview action
- execution metadata preview action

### 3. Filters

Support backend filters:

- user id
- task id
- status

Supported statuses:

- `PENDING`
- `RUNNING`
- `ACCEPTED`
- `WRONG_ANSWER`
- `COMPILATION_ERROR`
- `RUNTIME_ERROR`
- `TIME_LIMIT_EXCEEDED`
- `INTERNAL_ERROR`

Keep filter state in query params when practical.

### 4. Pagination

Use backend pagination:

- `page`
- `size`
- `totalElements`
- `totalPages`

### 5. Detail preview

Provide a drawer or modal for:

- source code
- execution metadata

Render metadata defensively because it is a string.

## Acceptance Criteria

- non-admin users cannot access `/admin/submissions`
- admins can list submissions
- admins can filter by user id, task id, and status
- admins can inspect source code
- admins can inspect execution metadata
- pagination works with filters

## Dependencies

- feature/app-foundation
- feature/auth
