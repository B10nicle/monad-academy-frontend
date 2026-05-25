# feature/task-workspace

## Goal

Implement the coding task workspace where users read a problem, edit Java code, submit a solution, and inspect the result.

This is the core product experience.

## Backend Endpoints

- `GET /api/tasks/{slug}`
- `POST /api/submissions`
- `GET /api/tasks/{taskId}/submissions/my?page=<page>&size=<size>`

## Functional Requirements

### 1. Task detail route

Route:

```text
/tasks/:slug
```

Load task details by slug.

Task fields:

- id
- title
- slug
- description
- difficulty
- topic
- initialCode
- public testCases
- createdAt
- updatedAt

### 2. Workspace layout

Provide a practical coding layout:

- problem statement panel
- public test cases panel
- code editor panel
- submit controls
- latest result panel
- task-specific submission history

The layout must work on desktop and remain usable on smaller screens.

### 3. Code editor

Use Monaco Editor unless project constraints require a different editor.

Editor requirements:

- initialize from `initialCode`
- support Java syntax highlighting
- preserve user edits while submitting
- disable submit while request is in flight

### 4. Submit solution

Request:

```json
{
  "taskId": "uuid",
  "sourceCode": "..."
}
```

Behavior:

- require authentication before submit
- send source code to backend
- render returned submission result
- refresh task-specific submission history after submit

Submission statuses:

- `PENDING`
- `RUNNING`
- `ACCEPTED`
- `WRONG_ANSWER`
- `COMPILATION_ERROR`
- `RUNTIME_ERROR`
- `TIME_LIMIT_EXCEEDED`
- `INTERNAL_ERROR`

### 5. Result panel

Show:

- status
- executionDurationMs
- executionMetadata
- createdAt

Render `executionMetadata` defensively because it is returned as a string and may contain JSON or plain text.

### 6. Task-specific history

Show current user's submissions for the task:

- status
- createdAt
- executionDurationMs
- source code preview action

Unauthenticated users should see the task but not authenticated history.

## Acceptance Criteria

- [x] public users can read task details
- [x] unauthenticated submit attempts redirect or prompt for login
- [x] authenticated users can submit a solution
- [x] result status is visible after submission
- [x] task submission history loads for authenticated users
- [x] code editor remains usable during normal error states

## Delivered

- `GET /api/tasks/{slug}` integration
- task detail page at `/tasks/:slug`
- problem statement panel
- public test case panel
- Monaco-backed Java editor initialized from `initialCode`
- authenticated `POST /api/submissions` submit flow
- unauthenticated submit redirect to login with `redirectTo`
- latest submission result panel with status, duration, created time, and defensive metadata rendering
- current user task submissions via `GET /api/tasks/{taskId}/submissions/my`
- submitted source preview dialog
- submissions API service and tests
- task detail API and page tests
- browser verification of task route error state when backend is offline

## Dependencies

- feature/app-foundation
- feature/auth
- feature/task-catalog
