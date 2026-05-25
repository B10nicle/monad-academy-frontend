# feature/backend-api-gaps

## Goal

Track backend API additions needed for a fuller LeetCode/Codewars-style frontend experience.

This feature is a planning and coordination artifact. It should be updated as frontend implementation reveals missing backend capabilities.

## Current Backend Limitations

### 1. Task catalog filtering and search

Current endpoint:

```text
GET /api/tasks?page&size
```

Missing capabilities:

- search by title or text
- filter by difficulty
- filter by topic
- sort options
- solved or attempted state for the current user

Suggested future endpoint shape:

```text
GET /api/tasks?page&size&query&difficulty&topic&status
```

### 2. User progress API

The backend has progress domain logic, but the current public API does not expose user progress.

Missing capabilities:

- list solved tasks
- show attempts count per task
- show solved count
- show in-progress tasks
- show user progress summary

Suggested future endpoints:

```text
GET /api/progress/me
GET /api/tasks/{taskId}/progress/my
```

### 3. Admin task listing and detail

Current admin endpoints support create, update, publish, archive, and add test case, but not listing or fetching admin task details.

Missing endpoints:

```text
GET /api/admin/tasks?page&size&status
GET /api/admin/tasks/{id}
```

Impact:

- admin task edit pages cannot be reliably opened directly by URL
- admins cannot browse drafts or archived tasks
- frontend cannot build a complete admin task management table

### 4. Submission detail endpoint

Current APIs return submissions through paginated lists and create response.

Missing endpoint:

```text
GET /api/submissions/{id}
```

Optional admin variant:

```text
GET /api/admin/submissions/{id}
```

Impact:

- direct links to individual submissions are not possible
- detail drawers must rely on list data

### 5. Profiles and leaderboard

Missing capabilities:

- public user profile
- solved task count
- ranking
- leaderboard
- streaks or activity history

Potential endpoints:

```text
GET /api/users/{username}
GET /api/leaderboard
```

### 6. Discussions and comments

Missing capabilities:

- task comments
- solution discussion
- editorial content

Potential endpoints:

```text
GET /api/tasks/{taskId}/comments
POST /api/tasks/{taskId}/comments
```

## Acceptance Criteria

- this document is updated when a frontend feature is blocked by missing backend API support
- each missing endpoint includes the UX impact
- future backend work can be derived from this file without reverse-engineering frontend assumptions

## Dependencies

- feature/task-catalog
- feature/task-workspace
- feature/admin-task-management
- feature/submission-history
