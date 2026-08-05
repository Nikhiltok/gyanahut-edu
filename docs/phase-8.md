# Phase 8 — Result, Ranking & Leaderboard

## Objective

After a test submission, student sees a full result breakdown and ranks update across all ranking scopes.

## Backend

- `GET /results/{attempt_id}/` — score, rank, accuracy, correct/wrong/skipped, time_taken, subject-wise breakdown
- Leaderboard population: a Celery task triggered after each `/tests/{id}/submit/`, recomputing `Leaderboard` rows for the affected exam (total_score, total_attempt, accuracy, rank)
- Ranking scopes, all derived from `Leaderboard` + `TestAttempt` with appropriate date filters:
  - `GET /leaderboard/global/` — national ranking
  - `GET /leaderboard/exam/{id}/` — exam-wise ranking
  - Weekly/Monthly ranking via query param (`?period=weekly|monthly`) filtering attempts by `submitted_at`
- Rank computed via window function (`RANK() OVER (ORDER BY total_score DESC)`) or an equivalent ORM annotation, not a Python loop, for performance at scale
- `Leaderboard(rank)` index (from Phase 2) is relied on here for fast paginated reads

## Frontend

- `/result/[id]` — score/rank/accuracy header, `PerformanceChart`, `SubjectChart`, `TimeAnalysisChart` (Recharts)
- `/ranking` — `LeaderboardTable`, `RankCard`, `FilterDropdown` (National / State / Exam-wise / Weekly / Monthly)

## Definition of Done

- [ ] Submitting a test immediately returns a correct result via `/results/{attempt_id}/`
- [ ] Within an acceptable async delay (a few seconds via Celery, not blocking the submit response), the student's rank updates on `/leaderboard/exam/{id}/`
- [ ] Weekly/Monthly filters return different result sets than the all-time global ranking
- [ ] Rank computation performs correctly with at least 1,000 seeded attempts (sanity check for the window-function approach, not a full load test)
