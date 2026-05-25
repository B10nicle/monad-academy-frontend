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
- keep changes scoped to the requested feature
- do not rewrite branch history unless explicitly requested

Example:

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/<feature-name>
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

Do not hardcode generated sample data into feature screens once API integration exists. Use explicit empty and loading states instead.

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

---

# Current API Surface

The frontend planning is based on:

- local OpenAPI file: `/Users/olegkhilko/Downloads/api-docs.json`
- backend repository branch: `monad-academy-backend/develop`

Primary supported features:

- auth
- current user session
- public task list and details
- authenticated code submissions
- user submission history
- admin task creation and lifecycle actions
- admin submission review

Known backend limitations:

- no public task search/filter parameters yet
- no task progress endpoint exposed yet
- no admin endpoint to list or fetch draft/archived tasks
- no standalone endpoint to fetch a single submission by id
- no profile, leaderboard, comments, collections, or ranking API yet
