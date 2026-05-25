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

- unauthenticated users can browse public tasks
- authenticated-only pages redirect unauthenticated users to login
- admin pages reject non-admin users
- JWT is attached to protected API calls
- refresh with a valid token restores the current user
- logout clears token and user state

## Dependencies

- feature/app-foundation
