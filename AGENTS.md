# Monad Academy Frontend - AI Agent Instructions

This document defines rules and expectations for AI coding agents working in the Monad Academy frontend repository.

Related repositories:

- `monad-academy-frontend` - Angular client application
- `monad-academy-backend` - Spring Boot REST API

This repository contains frontend logic only.

---

# Project Context

Monad Academy is a lightweight educational coding platform inspired by LeetCode and Codewars.

The frontend must provide:

- authentication flows
- public task browsing
- coding task workspace
- solution submission
- user submission history
- admin task management
- admin submission review

The backend API is the source of truth for domain rules, authorization, task data, submission execution, and persistence.

Do not duplicate backend business rules in the client beyond what is required for user-friendly validation and UI state.

---

# Repository Rules

Permanent branches:

```text
main
develop
```

Rules:

- never work directly in `main`
- branch from `develop`
- feature work must target `develop`
- use one focused branch per feature or chore
- keep changes scoped to the requested feature
- do not rewrite branch history unless explicitly requested
- after a PR is approved, merge it first, update local `develop`, then branch again for the next task

Example:

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/<feature-name>
```

For non-feature repository work, use a descriptive chore branch:

```bash
git switch develop
git pull --ff-only origin develop
git switch -c chore/<short-name>
```

---

# Technology Direction

Target stack:

- Angular 21
- TypeScript strict mode
- standalone components
- Angular Router
- Angular HTTP client
- signals for local reactive state where appropriate
- reactive forms for non-trivial forms
- Monaco Editor for the coding workspace unless a better project-local choice is introduced

Do not introduce a state management library by default. Add one only when the application has a concrete cross-feature state problem that Angular services/signals cannot handle cleanly.

Local tooling notes:

- this project targets Angular 21 and requires a modern Node runtime
- on the current development machine, use Homebrew Node first:

```bash
PATH=/opt/homebrew/bin:$PATH npm run build
PATH=/opt/homebrew/bin:$PATH npm test -- --watch=false
PATH=/opt/homebrew/bin:$PATH npm start -- --host 127.0.0.1 --port 4200
```

- do not rely on the default shell Node if it is older than Angular's supported range

---

# Architecture Rules

Use feature-oriented structure:

```text
src/app/
  core/
  shared/
  features/
    auth/
    tasks/
    submissions/
    admin/
```

## Core

Core contains application-wide infrastructure:

- API client configuration
- auth token storage
- HTTP interceptors
- route guards
- current user session service
- app-level error handling

Core must not contain feature UI.

## Shared

Shared contains reusable presentation utilities:

- buttons
- badges
- pagination controls
- status labels
- loading and empty states
- form helpers

Shared components must not depend on feature services.

## Features

Features own their pages, feature services, forms, and models.

Keep API DTOs typed and close to the API layer. Map DTOs to UI view models only when it removes real complexity.

---

# API Integration Rules

Backend base URL for local development:

```text
http://localhost:8080
```

Local frontend development uses Angular's dev proxy for API calls. Keep `environment.development.ts` API base URL empty unless there is a concrete reason to bypass the proxy.

Authentication:

- login returns `AuthResponse.token`
- attach JWT as `Authorization: Bearer <token>`
- call `GET /api/users/me` after login or application bootstrap when a token exists
- protect authenticated routes with an auth guard
- protect admin routes with a role guard for `ADMIN`

Important backend behavior:

- `GET /api/tasks` and `GET /api/tasks/{slug}` are public
- `/api/submissions/**` requires authentication
- `/api/admin/**` requires `ADMIN`
- Swagger may not declare security schemes, but backend security still applies
- backend validation and authorization errors should be shown through existing loading, empty, and error states where possible

Do not hardcode generated sample data into feature screens once API integration exists. Use explicit empty and loading states instead.

When adding an API integration:

- create a typed feature service near the feature that owns the workflow
- keep request/response models explicit
- add `HttpTestingController` tests for endpoint path, method, body, and query params
- use `PageResponse<T>` and existing pagination helpers for paginated endpoints
- preserve query params for list filters and pagination when it helps users share or reload the view

---

# UI and UX Rules

Build the actual application experience first. Do not create a marketing landing page unless explicitly requested.

The application should feel like a practical coding platform:

- dense but readable task catalog
- clear difficulty and topic badges
- task page with problem statement, test cases, editor, submit action, and result panel
- submission history that is easy to scan
- admin screens optimized for repeated task and submission review work

Avoid decorative UI that does not help users solve tasks, inspect submissions, or administer content.

All interactive states must be handled:

- loading
- empty
- success
- validation error
- API error
- unauthorized
- forbidden

---

# Code Style

General rules:

- keep TypeScript strict
- prefer explicit domain types over `any`
- avoid large components; move focused behavior into services or child components
- keep templates readable
- use reactive forms for auth and admin task forms
- keep route-level components responsible for composition, not low-level formatting
- avoid comments unless they explain non-obvious behavior

Angular rules:

- prefer standalone components
- prefer `inject()` consistently when it matches local style
- avoid `NgModule` unless a dependency requires it
- keep route definitions close to the feature where practical
- use guards for auth/admin access rather than hiding broken pages after navigation
- unsubscribe explicitly only when needed; prefer `async` pipe, signals, or framework-managed lifecycles

Testing expectations:

- add unit tests for guards, interceptors, and non-trivial services
- add focused component tests for forms and important state transitions
- add e2e or integration coverage for critical flows once the app skeleton exists
- run `npm run build` and `npm test -- --watch=false` before pushing a branch
- after frontend route or UI changes, verify the relevant local route in the browser and check for console errors

Formatting:

- use Prettier for touched TypeScript, HTML templates, CSS-in-TS styles, and Markdown
- avoid unrelated formatting churn in files outside the requested change

---

# Current API Surface

The frontend planning is based on:

- local OpenAPI file: `/Users/olegkhilko/Downloads/api-docs.json`
- backend repository branch: `monad-academy-backend/develop`

Primary supported features:

- auth: register, login, verify email, resend verification, logout, session bootstrap
- current user session with auth, guest, and admin guards
- public task catalog and task details
- task workspace with Monaco editor, submit action, result panel, and task-specific submission history
- authenticated user submission history with source and metadata previews
- admin task creation, update-after-create, test case creation, publish, and archive actions
- admin submission review with filters, pagination, source preview, and metadata preview

Known backend limitations:

- no public task search/filter parameters yet
- no task progress endpoint exposed yet
- no admin endpoint to list or fetch draft/archived tasks
- no standalone endpoint to fetch a single submission by id
- no profile, leaderboard, comments, collections, or ranking API yet

---

# Current Routes

Public:

- `/tasks`
- `/tasks/:slug`

Guest-only:

- `/login`
- `/register`
- `/verify-email`
- `/resend-verification`

Authenticated:

- `/submissions`

Admin:

- `/admin`
- `/admin/tasks/new`
- `/admin/tasks/:id/edit`
- `/admin/submissions`

`/admin/tasks/:id/edit` is intentionally limited because the backend does not currently expose an admin task detail endpoint.

---

# Feature Planning Files

Task planning lives in:

```text
tasks/frontend-feature-roadmap.md
tasks/feature/
```

Keep these files current when completing features:

- mark the feature status in `tasks/frontend-feature-roadmap.md`
- update the matching `tasks/feature/*` acceptance criteria
- document backend limitations instead of hiding incomplete workflows in the UI

---

# Pull Request Expectations

PRs should include:

- concise summary of user-visible and API changes
- tests run
- browser verification when routes or UI are touched
- known limitations, especially when blocked by missing backend endpoints

Use reviewers consistently with the repository workflow. Do not merge your own PR until the user confirms approval.
