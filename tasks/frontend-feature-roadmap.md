# Monad Academy Frontend Feature Roadmap

This file tracks frontend feature implementation progress.

Legend:

- [x] completed
- [~] in progress
- [ ] not started

---

## Progress Overview

| Feature                         | Status | Notes                                                                    |
| ------------------------------- | -----: | ------------------------------------------------------------------------ |
| feature/app-foundation          |    [x] | Implemented in feature/app-foundation                                    |
| feature/auth                    |    [x] | Implemented in feature/auth                                              |
| feature/task-catalog            |    [x] | Implemented in feature/task-catalog                                      |
| feature/task-workspace          |    [x] | Implemented in feature/task-workspace                                    |
| feature/submission-history      |    [x] | Implemented in feature/submission-history                                |
| feature/admin-task-management   |    [x] | Implemented in feature/admin-task-management                             |
| feature/admin-submission-review |    [ ] | Admin submission table and filters                                       |
| feature/backend-api-gaps        |    [ ] | Track backend endpoints needed for a fuller LeetCode/Codewars experience |

---

# Features

## 1. feature/app-foundation

Status: [x] Completed

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

Delivered:

- Angular 21 project scaffold
- strict TypeScript configuration
- application shell with top navigation and route outlet
- environment API base URL configuration
- HTTP client with auth token and API error interceptors
- typed pagination and API error helpers
- current user session primitives
- shared loading, empty, error, pagination, topic, difficulty, and submission status UI primitives
- placeholder feature routes for the next planned features
- build and unit test verification

Dependencies:

- none

---

## 2. feature/auth

Status: [x] Completed

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

Delivered:

- typed auth API client and DTO models
- register page
- login page with redirect support
- verify email page
- resend verification page
- current user session bootstrap from stored JWT
- auth, guest, and admin guards
- bearer token HTTP interceptor coverage
- session and guard tests

Dependencies:

- feature/app-foundation

---

## 3. feature/task-catalog

Status: [x] Completed

Goal:

Implement public task browsing for published tasks.

Expected deliverables:

- task catalog page
- paginated API integration
- difficulty and topic badges
- loading, empty, and error states
- navigation to task details

Delivered:

- typed public task summary model
- public tasks API service for `GET /api/tasks`
- `/tasks` catalog page backed by API pagination
- query-param backed `page` and `size`
- loading, empty, and error states
- task rows with difficulty and topic badges
- navigation to `/tasks/:slug`
- task detail placeholder for the upcoming workspace feature
- service and page unit tests

Dependencies:

- feature/app-foundation

---

## 4. feature/task-workspace

Status: [x] Completed

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

Delivered:

- public task detail API integration
- Monaco-backed Java code editor
- problem statement and public test case panels
- authenticated submit flow
- latest submission result panel
- current user task-specific submission history
- submitted source preview
- unauthenticated login redirect for submit
- task workspace and submissions API tests

Dependencies:

- feature/app-foundation
- feature/auth
- feature/task-catalog

---

## 5. feature/submission-history

Status: [x] Completed

Goal:

Implement current user submission history.

Expected deliverables:

- `/submissions` page
- paginated API integration
- status and duration display
- source code preview
- execution metadata rendering

Delivered:

- current user submissions API integration
- authenticated `/submissions` page
- query-param backed pagination
- submission table with status, task id, duration, created, and updated timestamps
- source code preview dialog
- execution metadata preview dialog with defensive formatting
- loading, empty, and API error states
- service and page tests

Dependencies:

- feature/app-foundation
- feature/auth

---

## 6. feature/admin-task-management

Status: [x] Completed

Goal:

Implement admin task authoring and lifecycle tools supported by the current backend API.

Expected deliverables:

- admin task creation form
- task update form when a task id is available in client state
- test case creation UI
- publish action
- archive action
- admin-only route protection

Delivered:

- admin task API client and DTO models
- admin landing page
- `/admin/tasks/new` task authoring workflow
- create and update actions for the current created task
- add test case form
- publish and archive actions
- `/admin/tasks/:id/edit` limitation page for missing backend detail endpoint
- admin-only routes
- API and page tests

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
