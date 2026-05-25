# feature/task-catalog

## Goal

Implement public browsing for published coding tasks.

The result of this feature must provide a clean task catalog similar to the task lists found in coding practice platforms.

## Backend Endpoints

- `GET /api/tasks?page=<page>&size=<size>`

Response:

- `PageResponse<PublicTaskSummaryResponse>`

Task fields:

- id
- title
- slug
- difficulty
- topic

## Functional Requirements

### 1. Catalog route

Route:

```text
/tasks
```

The root route may redirect to `/tasks`.

### 2. Task list

Render a paginated list or table of tasks with:

- title
- difficulty badge
- topic badge
- navigation to details

Difficulty values:

- `EASY`
- `MEDIUM`
- `HARD`

Topic values:

- `STREAM_API`

### 3. Pagination

Use backend pagination:

- `page`
- `size`
- `totalElements`
- `totalPages`

Keep current page state in the URL query params when practical.

### 4. States

Handle:

- loading
- empty catalog
- API error
- page not found or invalid page values

### 5. Filters

The current backend does not support server-side task filtering or search.

It is acceptable to add lightweight client-side UI only if it does not imply unsupported backend behavior. Prefer leaving filter controls out of the MVP unless they are backed by API support.

## Acceptance Criteria

- [x] users can open the catalog without authentication
- [x] tasks load from the backend
- [x] pagination works against the backend response
- [x] clicking a task navigates to `/tasks/:slug`
- [x] empty and error states are visible and useful

## Delivered

- `PublicTaskSummary` model
- `TasksApiService` for `GET /api/tasks?page&size`
- `/tasks` catalog page
- backend pagination through `page` and `size` query params
- task list rows with title, difficulty badge, and topic badge
- loading state
- empty state
- API error state with retry
- invalid query param fallback handling
- `/tasks/:slug` placeholder route for the next task workspace feature
- unit tests for API request parameters and page rendering
- browser verification of catalog shell and API error state when backend is offline

## Dependencies

- feature/app-foundation
