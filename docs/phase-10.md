# Phase 10 — Admin Dashboard & Platform Analytics

## Objective

Give Admin/Super Admin a top-level view of platform health, including revenue from paid mock tests.

## Backend

- `GET /admin/dashboard/stats/` — `students` (total count), `tests` (total), `questions` (total), `live_tests` (currently LIVE), `revenue` (sum of `Order.amount` where status=PAID — ties directly to Phase 7)
- `GET /admin/dashboard/growth/` — time-series of new student signups (for `StudentGrowthChart`)
- `GET /admin/dashboard/attempts/` — time-series of test attempts (for `TestAttemptChart`)
- `GET /admin/dashboard/performance/` — aggregate average score/accuracy trend across the platform

All of the above are Admin/Super Admin only (`IsAdminOrSuperAdmin`).

## Frontend

- `/admin/dashboard` widgets: total students, total exams, questions count, live tests, **revenue** (Phase 7 dependency)
- Charts: `StudentGrowthChart`, `TestAttemptChart`, `PerformanceChart` (Recharts)

## Definition of Done

- [ ] Dashboard stats match real DB counts (verified against a manual query)
- [ ] Revenue widget correctly sums only `PAID` orders, excluding CREATED/FAILED
- [ ] Growth/attempt charts render real time-series data, not placeholder/mock data
