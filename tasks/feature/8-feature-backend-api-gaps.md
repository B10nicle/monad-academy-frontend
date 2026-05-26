# feature/backend-api-gaps

## Goal

Track backend API additions needed for a fuller LeetCode/Codewars-style frontend experience.

This feature is a planning and coordination artifact. It records concrete frontend blockers found while implementing the Angular MVP and translates them into backend-ready endpoint requests.

## Source Context

Frontend implementation covered:

- public task catalog and task detail workspace
- authenticated submission flow
- user submission history
- admin task creation and lifecycle actions
- admin submission review

Backend reference:

- local OpenAPI file: `/Users/olegkhilko/Downloads/api-docs.json`
- backend roadmap: `monad-academy-backend/tasks/backend-feature-roadmap.md`
- backend branch policy: branch from `develop`, target `develop`, keep PRs small, do not rewrite history without explicit request

## Priority Summary

| Priority | Gap                                   | Frontend Impact                                      |
| -------- | ------------------------------------- | ---------------------------------------------------- |
| P0       | Admin task listing and detail         | Admin task management cannot support full edit flows |
| P1       | Public task filters and search        | Catalog is limited to plain pagination               |
| P1       | User progress read API                | Solved/attempted states cannot be shown              |
| P2       | Submission detail endpoint            | Direct submission links are not possible             |
| P3       | Profiles and leaderboard              | Social/ranking features cannot be built              |
| P3       | Discussions, comments, and editorials | Community learning features cannot be built          |

## Current Backend Limitations

### 1. Admin Task Listing And Detail

Priority: P0

Current admin endpoints:

```text
POST /api/admin/tasks
PUT /api/admin/tasks/{id}
POST /api/admin/tasks/{id}/publish
POST /api/admin/tasks/{id}/archive
POST /api/admin/tasks/{id}/test-cases
```

Missing endpoints:

```text
GET /api/admin/tasks?page&size&status&query&difficulty&topic
GET /api/admin/tasks/{id}
```

Required response fields:

- task id
- title
- slug
- difficulty
- topic
- status
- initial code
- solution template
- createdAt
- updatedAt
- test cases including hidden test cases

UX impact:

- `/admin/tasks/:id/edit` is intentionally limited in the frontend
- admins cannot open an edit page by URL after refresh
- admins cannot browse drafts or archived tasks
- admins cannot quickly inspect or revise existing test cases
- the current frontend can only update a task while it remains in client state after creation

Suggested backend work:

- add an admin task summary response for list rows
- add an admin task detail response that includes hidden test cases
- support filtering by status first; search, difficulty, and topic can follow if needed
- keep access restricted to `ADMIN`

### 2. Public Task Catalog Filtering And Search

Priority: P1

Current endpoint:

```text
GET /api/tasks?page&size
```

Missing capabilities:

- search by title or text
- filter by difficulty
- filter by topic
- sort by newest, title, difficulty, or popularity when popularity exists
- optionally include current user's solved or attempted state

Suggested future endpoint shape:

```text
GET /api/tasks?page&size&query&difficulty&topic&sort&progress
```

UX impact:

- task catalog cannot scale beyond a small list
- users cannot find tasks by topic or difficulty
- LeetCode/Codewars-style browsing and practice selection is incomplete

Suggested backend work:

- add optional filters without changing the existing default list behavior
- keep only published tasks in public responses
- validate enum filters consistently with existing DTO validation

### 3. User Progress Read API

Priority: P1

Backend roadmap says progress persistence exists, but the OpenAPI surface does not expose read endpoints for the frontend.

Missing capabilities:

- show solved tasks
- show attempted tasks
- show attempts count per task
- show solved count
- show in-progress tasks
- show user progress summary

Suggested future endpoints:

```text
GET /api/progress/me
GET /api/tasks/{taskId}/progress/my
```

Suggested response fields:

```text
GET /api/progress/me
- solvedCount
- attemptedCount
- totalPublishedTasks
- recentSolvedTasks[]
- recentAttempts[]

GET /api/tasks/{taskId}/progress/my
- taskId
- status
- attemptsCount
- solvedAt
- lastSubmissionId
```

UX impact:

- catalog cannot display solved or attempted badges
- task workspace cannot show user's current task status
- dashboard/profile progress widgets cannot be built

Suggested backend work:

- expose read-only progress endpoints for authenticated users
- keep progress mutation internal to submission execution
- return stable enum values for task progress status

### 4. Submission Detail Endpoint

Priority: P2

Current APIs return submissions through paginated lists and create responses:

```text
POST /api/submissions
GET /api/submissions/my
GET /api/tasks/{taskId}/submissions/my
GET /api/admin/submissions
GET /api/admin/users/{userId}/submissions
```

Missing endpoints:

```text
GET /api/submissions/{id}
GET /api/admin/submissions/{id}
```

UX impact:

- direct links to individual submissions are not possible
- detail dialogs must rely on list data
- a user cannot bookmark or share a submission result page
- admin review cannot deep-link to a suspicious submission

Suggested backend work:

- allow users to fetch only their own submissions
- allow admins to fetch any submission
- return the same submission DTO shape currently used in list endpoints

### 5. Profiles And Leaderboard

Priority: P3

Missing capabilities:

- public user profile
- solved task count
- ranking
- leaderboard
- streaks or activity history

Potential endpoints:

```text
GET /api/users/{username}
GET /api/users/{username}/stats
GET /api/leaderboard?page&size&period
```

UX impact:

- user identity is limited to current session data
- there is no competitive or community discovery surface
- Codewars-like ranking cannot be represented

Suggested backend work:

- keep profile data minimal until privacy rules are defined
- avoid exposing email addresses on public profile endpoints
- derive ranking from accepted submissions or progress records

### 6. Discussions, Comments, And Editorials

Priority: P3

Missing capabilities:

- task comments
- solution discussion
- editorial content
- voting or moderation model

Potential endpoints:

```text
GET /api/tasks/{taskId}/comments?page&size
POST /api/tasks/{taskId}/comments
GET /api/tasks/{taskId}/editorial
```

UX impact:

- learners cannot discuss solutions inside the platform
- task pages cannot provide official explanations
- admins cannot publish editorial guidance

Suggested backend work:

- define moderation and visibility rules before implementation
- keep editorial authoring admin-only
- keep comments authenticated-only for writes

## Backend Work Candidates

Recommended backend feature order:

1. `feature/admin-task-read-api`
2. `feature/task-catalog-filters`
3. `feature/progress-read-api`
4. `feature/submission-detail-api`
5. `feature/user-profiles`
6. `feature/task-discussions`

## Acceptance Criteria

- [x] this document is updated when a frontend feature is blocked by missing backend API support
- [x] each missing endpoint includes the UX impact
- [x] future backend work can be derived from this file without reverse-engineering frontend assumptions
- [x] missing endpoints are prioritized for backend planning
- [x] security and visibility expectations are noted where relevant

## Dependencies

- feature/task-catalog
- feature/task-workspace
- feature/admin-task-management
- feature/submission-history
- feature/admin-submission-review
