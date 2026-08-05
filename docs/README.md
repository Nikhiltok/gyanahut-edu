# Gyanahut Education — Phase-Wise Build Plan

Is folder me pura project **15 phases** me toda gaya hai, exactly usi architecture (SRS + DB + API + Frontend docs) ke hisaab se jo already finalize ho chuka hai. Coding start karne se pehle yeh docs reference ke liye hain — har phase apne aap me ek deliverable unit hai (scaffold → backend module → frontend module → hardening → deploy).

> **Important addition (not in original SRS):** Paid Mock/Live Tests are unlocked via a prepaid **Credit Wallet** (₹1 = 10 credits, cost = 1 credit per question) instead of a flat per-test price. This adds **Phase 7: Credit Wallet & Payments**. Baaki sab phases originally scoped MVP ke hi hain.

## Phase Index

| # | Phase | Covers |
|---|-------|--------|
| 1 | [Foundation & Project Setup](phase-1.md) | Monorepo, Django + Next.js scaffolding, Docker, env config |
| 2 | [Database & Core Models](phase-2.md) | All models from DB design, UUID PKs, migrations, indexes |
| 3 | [Authentication Module](phase-3.md) | Register, Login, JWT, Refresh, Forgot/Reset Password, Profile |
| 4 | [Exam Management Module](phase-4.md) | Category → Exam → Subject → Chapter → Topic CRUD |
| 5 | [Question Bank Module](phase-5.md) | Question CRUD, search/filter, bulk CSV/JSON/XLSX import |
| 6 | [Test Engine & Scheduler](phase-6.md) | Test creation, scheduling, start/submit, result calculation |
| 7 | [Credit Wallet & Payments](phase-7.md) | **Prepaid credit wallet** (₹1 = 10 credits, 1 credit/question), recharge checkout, payment verification, access gating |
| 8 | [Result, Ranking & Leaderboard](phase-8.md) | Score/result detail, national/state/exam/weekly/monthly ranks |
| 9 | [Student Features](phase-9.md) | Bookmarks, wrong-question revision, personal analytics |
| 10 | [Admin Dashboard & Analytics](phase-10.md) | Platform stats, growth charts, revenue widget |
| 11 | [Frontend Student Portal Polish](phase-11.md) | Remaining public/SEO pages, responsive + empty/loading states |
| 12 | [Frontend Admin Panel Polish](phase-12.md) | Remaining admin CRUD screens end-to-end |
| 13 | [Full API Integration Hardening](phase-13.md) | React Query + Redux discipline, token refresh, error UX |
| 14 | [Testing](phase-14.md) | pytest/Django tests, Jest/RTL tests |
| 15 | [Deployment](phase-15.md) | Docker, Nginx, Gunicorn, SSL, CI/CD, production checklist |

## Sequencing Rule

Phases are meant to be executed **in order** for backend-critical items (1 → 2 → 3 → ... → 10), since each depends on models/APIs from the previous phase. Frontend polish (11–12), integration hardening (13), testing (14), and deployment (15) can start once their corresponding backend phase is functionally done, and can run partially in parallel with later backend phases.

Coding is **not** in scope of these documents — each phase doc defines objective, models/APIs/pages, and Definition of Done only. Actual implementation happens after this planning pass is reviewed.
