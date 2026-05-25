# Monad Academy Frontend

Angular client for Monad Academy, a coding practice platform inspired by LeetCode and Codewars.

## Stack

- Angular 21
- TypeScript strict mode
- Angular Router
- Angular HTTP client
- Vitest through Angular CLI

## Requirements

Use Node compatible with Angular 21:

```bash
nvm use
```

The project currently targets Node 24 through `.nvmrc`.

## Local Development

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm start
```

The application runs at:

```text
http://localhost:4200
```

The local backend API is expected at:

```text
http://localhost:8080
```

## Quality Checks

Build:

```bash
npm run build
```

Run unit tests:

```bash
npm test -- --watch=false
```

## Project Layout

```text
src/app/
  core/      application-wide API, auth, interceptors, and session primitives
  shared/    reusable UI primitives
  features/  route-level feature areas
```

Feature planning lives in:

```text
tasks/
```
