# Phase 5 — Question Bank Module

## Objective

Admin can create, search, filter, and bulk-import questions at scale.

## Backend

- `GET /questions/?topic=&difficulty=&search=` — student practice feed
- `GET /questions/{id}/`
- Admin CRUD: `POST/PUT/DELETE /admin/questions/{id}/`
- `POST /admin/questions/import/` — multipart file upload (`file`, `format` = csv/json/xlsx)
  - Parses file, validates each row (topic exists, options count, exactly one correct answer, marks/negative_marks numeric)
  - Duplicate detection (same question_text + topic already exists)
  - Returns `{ total, success, failed }` plus a downloadable/inline error report for failed rows
  - Import run recorded in an `ImportHistory` model (file name, uploaded_by, total/success/failed, created_at) so admin can audit past imports

## Frontend (Admin)

- `/admin/questions` — `QuestionTable` (search, filter by topic/difficulty), `QuestionForm` (manual create/edit with dynamic option rows)
- `CSVUploader`, `ImportPreview` (shows parsed rows before commit), `ValidationReport` (shows failed rows + reason)
- Import history list

## Definition of Done

- [ ] Admin creates one question manually with 4 options and a correct answer
- [ ] Admin bulk-imports a CSV of 100 questions; report correctly shows success/failed counts with reasons for failures
- [ ] Duplicate question (same text + topic) is flagged, not silently re-inserted
- [ ] Student `GET /questions/?topic=x&difficulty=easy` returns only matching, active questions
