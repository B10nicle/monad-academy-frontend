# feature/auth

## Goal

Implement authentication, email verification, and current user session management.

The result of this feature must allow users to register, verify email, log in, stay authenticated across refreshes, and access protected routes.

## Backend Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `GET /api/users/me`

## Functional Requirements

### 1. Auth models

Implement typed models for:

- `RegisterRequest`
- `LoginRequest`
- `VerifyEmailRequest`
- `ResendVerificationRequest`
- `AuthResponse`
- `MessageResponse`
- `UserResponse`

Supported roles:

- `USER`
- `ADMIN`

Supported user statuses:

- `PENDING_EMAIL_VERIFICATION`
- `ACTIVE`
- `BLOCKED`
- `DELETED`

### 2. Register page

Route:

```text
/register
```

Fields:

- email
- username
- password

Behavior:

- submit registration request
- show backend success message
- guide user to verify email
- show validation and API errors

### 3. Login page

Route:

```text
/login
```

Fields:

- login
- password

Behavior:

- submit login request
- store JWT token
- call `/api/users/me`
- redirect to task catalog after success
- show meaningful errors for invalid credentials, blocked users, and unverified email

### 4. Verify email page

Route:

```text
/verify-email?token=<token>
```

Behavior:

- read token from query params
- submit verification request
- show success state
- provide navigation to login
- show invalid or expired token errors

### 5. Resend verification page

Route:

```text
/resend-verification
```

Fields:

- email

Behavior:

- request a new verification email
- show backend message
- handle API errors

### 6. Session service

Implement a session service responsible for:

- token persistence
- current user loading
- logout
- computed authenticated state
- computed admin state

### 7. Route guards

Implement:

- auth guard for authenticated pages
- guest guard for login/register pages where useful
- admin guard for `/admin/**`

## Acceptance Criteria

- [x] unauthenticated users can browse public tasks
- [x] authenticated-only pages redirect unauthenticated users to login
- [x] admin pages reject non-admin users
- [x] JWT is attached to protected API calls
- [x] refresh with a valid token restores the current user
- [x] logout clears token and user state

## Delivered

- auth request/response DTO models
- auth API service for register, login, verify email, and resend verification
- login page with backend error mapping and `redirectTo` support
- register page with client validation and backend success/error states
- verify email page that reads `token` from query params
- resend verification page
- session initialization that restores `/api/users/me` from a stored JWT
- auth token persistence and logout flow
- auth, guest, and admin route guards
- route protection for `/submissions` and `/admin`
- app navigation updates for login, register, current user, and logout
- unit tests for session loading, token interceptor, and guards
- browser verification for public route, protected redirect, and auth pages

## Dependencies

- feature/app-foundation
