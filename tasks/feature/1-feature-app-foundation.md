# feature/app-foundation

## Goal

Create the Angular 21 application foundation for Monad Academy frontend.

The result of this feature must provide a maintainable base for auth, task browsing, code submission, user history, and admin workflows.

## Technical Context

Target stack:

- Angular 21
- TypeScript strict mode
- standalone components
- Angular Router
- Angular HTTP client
- reactive forms
- signals where they simplify local state
- npm scripts for common workflows

Backend API:

- base URL: `http://localhost:8080`
- OpenAPI source: `/Users/olegkhilko/Downloads/api-docs.json`

## Functional Requirements

### 1. Project scaffold

Create an Angular 21 application with:

- routing enabled
- strict TypeScript settings
- browser application build
- default development server
- test runner configured by Angular defaults

### 2. Application layout

Implement the main application frame:

- top navigation
- content outlet
- authenticated user area
- admin navigation entry visible only for admins
- responsive layout for desktop and mobile

The first screen should be the product experience, not a marketing landing page.

### 3. Environment configuration

Provide environment-level API configuration:

```text
apiBaseUrl = http://localhost:8080
```

All API services must use this configuration and must not hardcode the backend URL in feature code.

### 4. API client foundation

Create shared API primitives:

- typed page response
- typed API error shape
- HTTP parameter helpers for pagination
- centralized API error normalization

### 5. HTTP interceptors

Implement:

- auth token interceptor
- global API error interceptor if it improves consistency

The auth token interceptor must attach:

```text
Authorization: Bearer <token>
```

only when a token exists.

### 6. Shared UI primitives

Create reusable primitives needed by upcoming features:

- loading state
- empty state
- error state
- pagination
- difficulty badge
- submission status badge
- topic badge

## Non-Functional Requirements

- keep bundle dependencies minimal
- keep UI dense, readable, and practical
- avoid one-off styling in feature components when a shared primitive is appropriate
- avoid introducing global state management unless a concrete need appears

## Acceptance Criteria

- [x] application starts locally
- [x] route outlet renders
- [x] top navigation renders
- [x] API base URL is configurable
- [x] HTTP interceptor is registered
- [x] shared UI primitives compile
- [x] all generated tests pass or are intentionally updated

## Delivered

- Angular 21 application scaffold
- strict TypeScript setup
- application shell with responsive top navigation
- `/tasks`, `/submissions`, `/admin`, and `/login` placeholder routes
- environment configuration for `http://localhost:8080`
- `API_BASE_URL` injection token
- typed page response, API error normalization, and pagination helpers
- auth token storage and auth token HTTP interceptor
- API error HTTP interceptor
- current user session service
- shared loading, empty, error, pagination, difficulty badge, topic badge, and submission status badge components
- README with local development commands
- `.idea/` ignored by git

## Dependencies

- none
