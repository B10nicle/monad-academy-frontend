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

- public users can read task details
- unauthenticated submit attempts redirect or prompt for login
- authenticated users can submit a solution
- result status is visible after submission
- task submission history loads for authenticated users
- code editor remains usable during normal error states

## Dependencies

- feature/app-foundation
- feature/auth
- feature/task-catalog
