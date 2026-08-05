# Phase 2 — Database & Core Models

## Objective

Implement every model from the DB design in their respective apps, run migrations, register everything in Django admin. This phase produces the full schema the rest of the project builds on.

## Models by App

**users**
- `User` (custom, extends `AbstractBaseUser`) — email, phone, password, first_name, last_name, role (SUPER_ADMIN / ADMIN / STUDENT), profile_image, state, city
- `StudentProfile` — user (FK), target_exam (FK → Exam), date_of_birth, gender, education

**exams**
- `ExamCategory` — name, slug, description, image, status
- `Exam` — category (FK), name, slug, description, exam_type, status
- `Subject` — exam (FK), name, description, order
- `Chapter` — subject (FK), name, order
- `Topic` — chapter (FK), name, description, order

**questions**
- `Question` — topic (FK), question_text, question_type (MCQ / TRUE_FALSE / MULTIPLE_CHOICE / IMAGE_BASED), difficulty (EASY / MEDIUM / HARD), explanation, marks, negative_marks, image, language, created_by (FK → User)
- `QuestionOption` — question (FK), option_text, is_correct, order

**tests**
- `Test` — exam (FK), title, test_type (PRACTICE / MOCK / LIVE / PREVIOUS_YEAR), duration, total_questions, total_marks, negative_marking, negative_marks, start_time, end_time, max_attempts, status (DRAFT / SCHEDULED / LIVE / COMPLETED / ARCHIVED), created_by (FK → User)
  - **Pricing fields added here** (used from Phase 6 onward, fully activated in Phase 7): `is_paid` (bool, default False), `price` (decimal 8,2, nullable), `discount_price` (decimal 8,2, nullable), `currency` (default `"INR"`)
- `TestQuestion` — test (FK), question (FK), order — M2M mapping table

**attempts**
- `TestAttempt` — student (FK), test (FK), started_at, submitted_at, score, correct_answers, wrong_answers, skipped_answers, accuracy, time_taken
- `StudentAnswer` — attempt (FK), question (FK), selected_option (FK), is_correct, time_taken

**leaderboard**
- `Leaderboard` — student (FK), exam (FK), total_score, total_attempt, accuracy, rank, updated_at

**payments** (new app, model shipped now, logic in Phase 7)
- `Order` — student (FK), test (FK), amount, currency, payment_gateway, gateway_order_id, gateway_payment_id, status (CREATED / PAID / FAILED / REFUNDED), purchased_at

## Bookmark

- `Bookmark` — student (FK), question (FK), created_at (lives in `questions` or a small `engagement` app — keep with `questions` to avoid an extra app)

## Indexing (per DB design doc)

- `User(email)`, `User(phone)`
- `Exam(slug)`
- `Question(topic_id)`, `Question(difficulty)`
- `Test(start_time)`
- `TestAttempt(student_id)`
- `Leaderboard(rank)`

## Definition of Done

- [ ] All models above created with UUID PKs via `core.BaseModel`
- [ ] `makemigrations` + `migrate` run cleanly on a fresh DB
- [ ] Every model registered in Django admin with sensible `list_display` / `search_fields` / `list_filter`
- [ ] ER diagram matches the relationships in the DB design doc (Category → Exam → Subject → Chapter → Topic → Question → QuestionOption; Exam → Test → TestQuestion → Question; Student → TestAttempt → StudentAnswer; Student → Bookmark; Student → Leaderboard)
- [ ] No API endpoints yet — this phase is schema only
