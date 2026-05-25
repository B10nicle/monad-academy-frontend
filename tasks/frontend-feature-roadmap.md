# Monad Academy Frontend Feature Roadmap

This file tracks frontend feature implementation progress.

Legend:

- [x] completed
- [~] in progress
- [ ] not started

---

## Progress Overview

| Feature | Status | Notes |
|---|---:|---|
| feature/app-foundation | [ ] | Angular 21 application shell and project infrastructure |
| feature/auth | [ ] | Register, login, email verification, current user session |
| feature/task-catalog | [ ] | Public published task listing |
| feature/task-workspace | [ ] | Task detail page, code editor, submit flow |
| feature/submission-history | [ ] | Current user submission history |
| feature/admin-task-management | [ ] | Admin create/update/publish/archive task flows |
| feature/admin-submission-review | [ ] | Admin submission table and filters |
| feature/backend-api-gaps | [ ] | Track backend endpoints needed for a fuller LeetCode/Codewars experience |

---

# Features

## 1. feature/app-foundation

Status: [ ] Not started

Goal:

Create the Angular 21 application foundation used by all frontend features.

Expected deliverables:

- Angular 21 project scaffold
- routing
- app layout
- environment configuration
- typed API client foundation
- HTTP error handling
- auth token interceptor
- shared UI primitives
- base tests and quality scripts

Dependencies:

- none

---

## 2. feature/auth

Status: [ ] Not started

Goal:

Implement authentication and current user session management.

Expected deliverables:

- register page
- login page
- verify email page
- resend verification page
- `/api/users/me` session bootstrap
- auth guard
- admin guard
- token persistence
- logout

Dependencies:

- feature/app-foundation

---

## 3. feature/task-catalog

Status: [ ] Not started

Goal:

Implement public task browsing for published tasks.

Expected deliverables:

- task catalog page
- paginated API integration
- difficulty and topic badges
- loading, empty, and error states
- navigation to task details

Dependencies:

- feature/app-foundation

---

## 4. feature/task-workspace

Status: [ ] Not started

Goal:

Implement the coding task workspace where users read a task, edit code, submit a solution, and inspect the result.

Expected deliverables:

- task detail page
- problem statement panel
- public test case panel
- code editor
- submit action
- submission result panel
- task-specific submission history

Dependencies:

- feature/app-foundation
- feature/auth
- feature/task-catalog

---

## 5. feature/submission-history

Status: [ ] Not started

Goal:

Implement current user submission history.

Expected deliverables:

- `/submissions` page
- paginated API integration
- status and duration display
- source code preview
- execution metadata rendering

Dependencies:

- feature/app-foundation
- feature/auth

---

## 6. feature/admin-task-management

Status: [ ] Not started

Goal:

Implement admin task authoring and lifecycle tools supported by the current backend API.

Expected deliverables:

- admin task creation form
- task update form when a task id is available in client state
- test case creation UI
- publish action
- archive action
- admin-only route protection

Dependencies:

- feature/app-foundation
- feature/auth

Notes:

- The current backend does not expose admin task list or admin task detail endpoints.
- Full edit workflows will require additional backend API support.

---

## 7. feature/admin-submission-review

Status: [ ] Not started

Goal:

Implement admin tools for reviewing submissions.

Expected deliverables:

- admin submission table
- filters for user id, task id, and status
- pagination
- submission detail drawer or modal
- source code preview
- execution metadata rendering

Dependencies:

- feature/app-foundation
- feature/auth

---

## 8. feature/backend-api-gaps

Status: [ ] Not started

Goal:

Track backend API additions that will be needed after the frontend MVP.

Expected deliverables:

- list of required backend endpoints
- UX impact for each missing endpoint
- proposed API contracts where useful

Dependencies:

- feature/task-catalog
- feature/task-workspace
- feature/admin-task-management
- feature/submission-history
