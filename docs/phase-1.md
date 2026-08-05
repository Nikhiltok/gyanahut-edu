# Phase 1 — Foundation & Project Setup

## Objective

Scaffold the monorepo, backend, and frontend so `docker-compose up` boots an empty but fully wired stack — before any business feature is written. No models, no APIs, no pages yet.

## 1.1 Repository Structure

```
gyanahut-edu/
├── backend/
│   ├── config/            # Django project (settings split)
│   ├── apps/
│   │   ├── core/          # BaseModel, shared utils
│   │   ├── authentication/
│   │   ├── users/
│   │   ├── exams/
│   │   ├── questions/
│   │   ├── tests/
│   │   ├── attempts/
│   │   ├── payments/       # NEW — see Phase 7
│   │   ├── analytics/
│   │   └── leaderboard/
│   ├── requirements/       # base.txt, dev.txt, prod.txt
│   └── manage.py
├── frontend/
│   └── src/ (per Part 4 folder structure)
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx.conf
├── docs/
└── docker-compose.yml
```

## 1.2 Backend Bootstrap

- Django project `config/` with `settings/base.py`, `dev.py`, `prod.py`
- Empty app skeletons created for all 9 apps above (including `payments`, added for Phase 7 pricing work)
- **Custom User model wired as `AUTH_USER_MODEL` before the first migration** — this cannot be changed later without pain, so it must happen in this phase even though the full model body ships in Phase 2
- `core.BaseModel` (UUID pk, `created_at`, `updated_at`, `is_active`) as an abstract base
- PostgreSQL connection via env vars
- Redis wired for cache + Celery broker
- Celery app created (worker + beat, no tasks yet)
- `djangorestframework`, `djangorestframework-simplejwt`, `django-filter`, `django-cors-headers`, `drf-spectacular` installed and wired
- Swagger at `/api/docs/`, Redoc at `/api/redoc/`
- `.env.example` with DB, Redis, JWT secret, and payment gateway key placeholders (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`)

## 1.3 Frontend Bootstrap

- Next.js 15 (App Router) + TypeScript strict mode
- Tailwind CSS + Shadcn UI installed
- Redux Toolkit store + React Query provider wired into root `layout.tsx`
- Axios instance (`services/api.ts`) with interceptor skeleton (token attach + 401 refresh placeholder, completed in Phase 3)
- Folder structure created exactly per the Frontend doc: `app/`, `components/`, `features/`, `services/`, `store/`, `hooks/`, `types/`, `utils/`, `constants/`, `middleware.ts`
- ESLint + Prettier configured

## 1.4 Docker & Dev Environment

- `docker-compose.yml` services: `postgres`, `redis`, `backend`, `frontend`, `celery-worker`, `celery-beat`, `nginx` (prod profile only)
- Backend and frontend Dockerfiles
- Dev convenience scripts (Makefile or npm scripts) for common commands

## Definition of Done

- [ ] `docker-compose up` boots Django + Next.js with no errors
- [ ] `GET /api/v1/health/` returns 200
- [ ] Swagger UI reachable at `/api/docs/`
- [ ] Custom User model registered as `AUTH_USER_MODEL` (empty fields ok for now)
- [ ] No business models/APIs/pages exist yet — scaffolding only
