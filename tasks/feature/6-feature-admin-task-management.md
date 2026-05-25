# feature/admin-task-management

## Goal

Implement admin task authoring and lifecycle tools supported by the current backend API.

The result of this feature must allow admins to create tasks, add test cases, and publish or archive tasks.

## Backend Endpoints

- `POST /api/admin/tasks`
- `PUT /api/admin/tasks/{id}`
- `POST /api/admin/tasks/{id}/test-cases`
- `POST /api/admin/tasks/{id}/publish`
- `POST /api/admin/tasks/{id}/archive`

## Functional Requirements

### 1. Admin routes

Routes:

```text
/admin/tasks/new
/admin/tasks/:id/edit
```

Routes must require `ADMIN`.

### 2. Task form

Fields:

- title
- slug
- description
- difficulty
- topic
- status
- initialCode
- solutionTemplate

Task status values:

- `DRAFT`
- `PUBLISHED`
- `ARCHIVED`

Difficulty values:

- `EASY`
- `MEDIUM`
- `HARD`

Topic values:

- `STREAM_API`

### 3. Test case form

Fields:

- input
- expectedOutput
- hidden
- orderIndex

Admins must be able to add test cases after a task exists.

### 4. Lifecycle actions

Provide actions for:

- publish
- archive

Actions must show success and error states.

### 5. Current backend limitation

The backend does not currently expose:

- `GET /api/admin/tasks`
- `GET /api/admin/tasks/{id}`

Because of that, full admin task listing and direct edit-by-url are not fully supported.

MVP behavior:

- support create task
- support editing a task that is already available in client state after creation
- clearly track the missing backend endpoints in `feature/backend-api-gaps`

## Acceptance Criteria

- [x] non-admin users cannot access admin task routes
- [x] admins can create a task
- [x] admins can add test cases to a created task
- [x] admins can publish a task
- [x] admins can archive a task
- [x] forms show validation and API errors

## Delivered

- admin task request and response DTO models
- `AdminTasksApiService` for create, update, add test case, publish, and archive endpoints
- admin landing page
- `/admin/tasks/new` create-first authoring page
- task form with title, slug, description, difficulty, topic, status, initial code, and solution template
- test case form with input, expected output, hidden flag, and order index
- lifecycle actions for publish and archive
- `/admin/tasks/:id/edit` limitation page explaining missing backend `GET /api/admin/tasks/{id}` support
- admin-only route protection
- API service tests
- task form page tests

## Dependencies

- feature/app-foundation
- feature/auth
