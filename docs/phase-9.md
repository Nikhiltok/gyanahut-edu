# Phase 9 — Student Features: Bookmark, Revision, Analytics

## Objective

Give students tools to revisit and learn from their own attempt history.

## Backend

- `POST /bookmarks/` — `{ question_id }`
- `GET /bookmarks/`
- `DELETE /bookmarks/{id}/`
- `GET /revision/wrong/` — questions the student answered incorrectly across all attempts, most-recent first
- `GET /revision/difficult/` — questions flagged HARD that the student got wrong or skipped
- `GET /results/my-attempts/` (`MyAttemptsView`, already exists in `attempts` app) — gains a `?type=practice|mock` filter, so the History page can split the list. `practice` matches the existing `SELF_PRACTICE_FILTER` (`test_type=PRACTICE`, `created_by.role=STUDENT`); `mock` is everything else (admin-scheduled `MOCK`/`LIVE`/`PREVIOUS_YEAR`). No param = both, unfiltered, as today.
- `GET /analytics/dashboard/` — `tests_attempted`, `average_score`, `accuracy`, `weak_topics` (topics with below-average accuracy for this student), `strong_topics`
- `GET /analytics/performance/` — time-series data for the performance graph

Weak/strong topic computation and dashboard aggregates should be cached (Redis, short TTL) or precomputed via a Celery task after each submit, since recomputing from raw attempts on every dashboard load doesn't scale.

## Frontend

- `/bookmarks` — `BookmarkCard`, `QuestionPreview`
- `/revision/wrong`, `/revision/difficult` — reuse `QuestionCard`/`OptionButton`/`ExplanationBox` from the practice module (Phase 6) in a read-only "review" mode
- `/exam-history` (existing page, extended) — a **Self Practice / Mock Test** tab selector (`Tabs`/`TabsList`/`TabsTrigger`) drives the `?type=` param on `/results/my-attempts/`, alongside the existing "All" view. Each row links to `/result/[id]` (Phase 8).
- `/dashboard` widgets: `ProfileCard`, `ScoreCard`, `AccuracyCard`, `RankCard`, `StudyProgress`, `WeakTopicCard`, `RecentTests`, `PerformanceChart`

## Definition of Done

- [ ] Student can bookmark a question mid-test (Phase 6's attempt UI) and find it later in `/bookmarks`
- [ ] `/revision/wrong` correctly excludes questions the student has since answered correctly in a later attempt (or documents the decision if it intentionally shows all historical misses — pick one behavior and note it in the API doc)
- [ ] `/exam-history` correctly splits attempts into Self Practice / Mock Test via the tab selector, with counts matching what `/profile` and `/dashboard` show elsewhere
- [ ] Dashboard loads in a reasonable time even with 50+ historical attempts, thanks to caching/precomputation
