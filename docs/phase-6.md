# Phase 6 — Test Engine & Exam Scheduler

## Objective

Admin can create and schedule a test (practice/mock/live/previous-year), and a student can start, attempt, and submit it with a correctly computed result.

## Backend

**Scheduler / CRUD** (`/admin/scheduler/` or `/admin/tests/`):
- `POST /scheduler/` — title, exam, test_type, start_time, end_time, duration, total_questions, total_marks, negative_marking, negative_marks, max_attempts
  - **`test_type` choices on the admin scheduler form are `MOCK` / `LIVE` / `PREVIOUS_YEAR` only — `PRACTICE` is deliberately excluded here.** Practice tests are exclusively student self-serve, generated on demand via `GeneratePracticeTestView` ([tests/views.py:324](../backend/apps/tests/views.py#L324)), never admin-scheduled. This keeps the two test origins unambiguous — see Phase 7's credit-cost split, which prices them differently and depends on this separation being clean (no admin-created `PRACTICE` test to fall through the cracks).
  - **Includes `is_paid` and `price` fields on the create/update form now** (columns already exist from Phase 2). Payment enforcement itself is not wired yet — that is Phase 7 — but admin can flag a test as paid and set a price starting in this phase.
- `PUT /scheduler/{id}/`
- `PATCH /scheduler/{id}/publish/` — DRAFT/SCHEDULED → LIVE
- `PATCH /scheduler/{id}/archive/` — COMPLETED → ARCHIVED
- `POST /admin/tests/{id}/questions/` — attach questions to a test via `TestQuestion` (with order), either manually selected or auto-picked by topic/difficulty rules

**Student flow**:
- `GET /tests/upcoming/`, `GET /tests/live/`, `GET /tests/{id}/`
- `POST /tests/{id}/start/` — validates: test is LIVE, within start/end window, `max_attempts` not exceeded for this student → creates `TestAttempt`, returns `attempt_id`, `duration`, and the question snapshot (without `is_correct`/answers)
- `POST /tests/{id}/submit/` — accepts `{ attempt_id, answers: [{question, option}] }`, computes:
  - correct/wrong/skipped counts
  - score = correct×marks − wrong×negative_marks
  - accuracy = correct / (correct + wrong)
  - time_taken = submitted_at − started_at
  - Writes `StudentAnswer` rows, updates `TestAttempt`

Status state machine enforced server-side: `DRAFT → SCHEDULED → LIVE → COMPLETED → ARCHIVED` (no skipping states, no going backward except explicit admin override).

## Frontend

Student: `/tests/upcoming` (`UpcomingTestCard`), `/tests/live` (`LiveTestCard`), `/test/[id]` attempt interface — `TestHeader`, `Timer`, `QuestionCard`, `OptionList`, `NavigationButtons`, `QuestionPalette`, `SubmitModal`, auto-submit on timer expiry.

Admin: `/admin/scheduler` — `SchedulerCalendar`, `ScheduleForm` (now includes Price + "Is Paid" toggle inputs, disabled/hidden state acceptable until Phase 7 activates them), `LiveTestCard`, `UpcomingTestCard`.

## Definition of Done

- [ ] Admin schedules a **free** mock test with 20 questions and publishes it
- [ ] Student starts the test, answers questions, navigates via palette, and submits (manually and via auto-submit on timeout)
- [ ] Score, accuracy, correct/wrong/skipped counts are verified correct against a hand-computed example
- [ ] `max_attempts` is enforced — a second `/start/` call beyond the limit is rejected
- [ ] Price/is_paid fields exist on the model and form but are **not yet enforced** at `/start/` — that gating logic is explicitly Phase 7's job
