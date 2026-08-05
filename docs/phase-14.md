# Phase 14 — Testing

## Objective

Automated coverage on the highest-risk logic before deployment, especially anything touching money or scoring.

## Backend (pytest + Django `TestCase`)

- Auth: register/login/refresh/logout, invalid credential handling, throttling
- Exam hierarchy: CRUD permission boundaries (student blocked from `/admin/*`)
- Question bank: bulk import success/failure counts, duplicate detection
- Test engine: start/submit flow, `max_attempts` enforcement, score/accuracy calculation correctness (multiple fixture scenarios: all correct, all wrong, mixed with negative marking, skipped questions)
- **Payments (Phase 7)** — highest priority for test coverage:
  - Order creation only allowed for `is_paid=True` tests
  - `/start/` correctly blocks an unpaid student and allows a paid one
  - Signature verification rejects tampered payloads
  - Webhook handler is idempotent under replay
- Leaderboard/ranking: rank ordering correctness with seeded attempts

## Frontend (Jest + React Testing Library)

- `TestAttempt` flow: answer selection, mark-for-review, timer expiry auto-submit
- Checkout flow: purchase-required redirect, successful payment → redirect into test
- Forms: register/login validation, question form validation

## Definition of Done

- [ ] CI runs both suites and they pass green
- [ ] Score-calculation and payment-verification logic each have explicit, named test cases covering edge cases (not just the happy path)
- [ ] Coverage report exists (no specific % gate required for MVP, but critical modules above are visibly covered)
