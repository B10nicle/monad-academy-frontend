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

- users can open the catalog without authentication
- tasks load from the backend
- pagination works against the backend response
- clicking a task navigates to `/tasks/:slug`
- empty and error states are visible and useful

## Dependencies

- feature/app-foundation
