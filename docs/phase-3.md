# Phase 3 — Authentication Module

## Objective

Full register/login/JWT/profile flow working end-to-end, both backend and frontend.

## Backend (`/api/v1/auth/`, `/api/v1/users/`)

- `POST /auth/register/` — name, email, phone, password → creates User (role=STUDENT) + StudentProfile
- `POST /auth/login/` — returns `access_token` + `refresh_token`
- `POST /auth/token/refresh/`
- `POST /auth/logout/` — blacklist refresh token
- `POST /auth/password/forgot/` — sends reset link/OTP
- `POST /auth/password/reset/`
- `GET /users/profile/`
- `PATCH /users/profile/`

Implementation notes:
- `djangorestframework-simplejwt` for access/refresh tokens
- Password hashing via Django's default hasher
- Login endpoint throttled (`django-ratelimit` or DRF throttle classes) to prevent brute force
- Serializer-level validation for email/phone uniqueness and password strength

## Frontend

- `/login`, `/register` pages (`LoginForm`, `RegisterForm`, `AuthCard`, `InputField`, `ExamSelector` components)
- `authSlice` in Redux store (user, tokens, isAuthenticated)
- `services/auth.service.ts` (register, login, refreshToken, logout, getProfile, updateProfile)
- Axios interceptor completed: attach `access_token` on every request; on 401, call refresh endpoint once, retry original request, else force logout
- `middleware.ts` protects `/dashboard`, `/admin/*`, and any authenticated-only route

## Definition of Done

- [ ] Student can register, login, and receive both tokens
- [ ] Protected `/users/profile/` endpoint returns data only with a valid access token
- [ ] Expired access token triggers a silent refresh on the frontend without logging the user out
- [ ] Forgot/reset password flow works end-to-end
- [ ] Admin/Super Admin roles exist in the User model but no role-gated UI yet (that starts in Phase 4)
