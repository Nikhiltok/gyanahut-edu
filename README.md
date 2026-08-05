# Gyanahut Edu

A full-stack exam-preparation platform for Indian competitive government exams (SSC, UPSC, Banking, Railways, and more) — topic-wise practice, full-length mock tests, live tests with real-time ranking, AI-assisted question generation, and a credit-wallet payment system, backed by a Django REST API and a Next.js 16 frontend.

## Tech Stack

**Backend**
- Django 5 + Django REST Framework
- PostgreSQL, Redis
- Celery (async tasks: leaderboard recompute, scheduled test activation)
- SimpleJWT (access/refresh token auth)
- Razorpay (payments) · OpenAI (AI question generation)
- drf-spectacular (OpenAPI schema / Swagger docs)

**Frontend**
- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-only theme, OKLCH tokens)
- TanStack Query (server state) + Redux Toolkit (auth/session state)
- Base UI (headless component primitives) · Recharts (analytics charts)

**Infra**
- Docker Compose (Postgres, Redis, Django, Celery worker, Celery beat)
- Frontend runs natively (`npm run dev`) against the containerized API

## Features

This section documents every screen at field/button level — it's the source of truth for UI generation, not a marketing summary. Screens are grouped as they appear in the app: **Public**, **Auth**, **Student Panel** (logged in as a student), and **Admin Panel** (logged in as ADMIN/SUPER_ADMIN, entirely separate layout from the student panel).

### Public Pages (no login)

**Home (`/`)** — Hero with a badge ("Trusted by aspirants preparing for SSC, UPSC, Banking & more"), H1 "Crack Your Government Exam with Gyanahut Edu", Sanskrit tagline, buttons "Get Started Free" (→ `/register`) and "Browse Exams" (→ `/categories`). "How It Works" — 3 steps (Pick your exam, Attempt mock tests, Track & improve) each with an icon circle and a numbered badge. "Popular Exam Categories" — a live grid of `CategoryCard`s plus a "View all categories" link. "Why Gyanahut Edu?" — 4 feature cards (Topic-wise Practice, Full-length Mock Tests, Detailed Analytics, All-India Ranking). Final CTA band + footer.

**Exam browsing drill-down** — a 5-level chain, each level a simple list/grid with a loading skeleton and an empty state, no login required:
- `/categories` → grid of `CategoryCard`s (icon inferred from category name, name, description, "Explore tests" link) → links to `/category/{slug}`
- `/category/[slug]` → category name + description header, grid of `ExamCard`s (name, exam-type badge, description, hover-revealed "Explore" link) → `/exam/{slug}`
- `/exam/[slug]` → exam name + type badge + description, a plain bullet list of that exam's subject names, one button "Browse subjects" → `/exam/{slug}/subjects`
- `/exam/[slug]/subjects` → clickable card list of subjects (name + optional description) → `/subject/{id}/chapters`
- `/subject/[id]/chapters` → clickable card list of chapters (name only — chapters have no description field) → `/chapter/{id}/topics`
- `/chapter/[id]/topics` → **non-clickable** card list of topics (name + optional description) — this is a dead end in the UI; starting practice on a topic only happens via Infinite Test, not from here.

**Features (`/features`)** — fully static marketing page: hero + "Start Practicing Free" button, a 6-card feature grid (Topic-wise Practice, Full-length Mock Tests, Accurate Negative Marking, Detailed Analytics, All-India Ranking, Bookmarks & Revision), bottom CTA with "Create Free Account" and "Browse Exams" buttons.

### Auth Pages

All four share `AuthCard`: a left panel (desktop only) with the logo, tagline, a "Master Your Exams" heading, 3 highlight cards (Live Tests, Question Bank, Performance Analytics), and "NTA Compliant"/"Secure Environment" badges; the right panel holds the form.

- **Login (`/login`)** — "Email or Phone Number" (mail icon), "Password" (lock icon, show/hide toggle) with a "Forgot password?" link, "Login" button, "Don't have an account? Create an account" link. Blocks ADMIN/SUPER_ADMIN accounts from logging in here unless they arrived via an admin-guard redirect.
- **Register (`/register`)** — two-step: **Step 1 (details)** — Full name, Email, Phone, Target Exam(s) (multi-select), Password, button "Send OTP" → sends a phone OTP. **Step 2 (otp)** — 6-digit OTP input (dev-mode shows the code inline when no SMS gateway is configured), "Verify & Create Account" button, "Change mobile number" link back to step 1. On success, auto-logs in and redirects to `/dashboard`.
- **Forgot Password (`/forgot-password`)** — single Email field, "Send reset link" button; after submit shows a static confirmation message (no email enumeration).
- **Reset Password (`/reset-password?uid=&token=`)** — single "New password" field, "Reset password" button; shows "This reset link is invalid." if the `uid`/`token` query params are missing.

### Student Panel

Left sidebar (`AppSidebar`): logo + "Target: {exam names}", nav items **Overview, Infinite Test, Live Tests, Upcoming Tests, Exam History, Bookmarks**, then an "Analysis" group — **Wrong Questions, Difficult Questions, Ranking** — then **Profile, Logout** pinned to the bottom.

**Dashboard (`/dashboard`)** — full-bleed gradient banner: "Welcome back, {first name}", "Target: {exam names}", Bell/Help icon buttons, "Start Practice" button. 4 stat cards overlapping the banner: Tests Attempted (+ a real week-over-week % delta), Avg Accuracy (progress bar), Rank (from the global leaderboard, "#{rank} / Top {x}%"), Day Streak (7-dot progress). "Jump Back In" card — only shown when an in-progress (abandoned) attempt exists, with a subject-badge panel, "You're on Question X of Y", "Resume Test" button, "Last seen {relative time}". "Recent Activity" — last 3 submitted attempts. Right column: "Infinite Test" and "Live Tests" promo cards (link out), "Performance Trend" bar chart with a real month-over-month % and a floating "+" shortcut, "Next Suggested" card (weakest topic → "Begin" link).

**Infinite Test / Practice Generator (`/practice/generate`)** — full-bleed header (title, subtitle, Bell/Help/avatar). Form card: **Exam Type**, **Subject** (or "Full exam"), **Chapter** (or "Full subject"), **Topic** (or "Full chapter") selects, cascading and resetting downstream on change; **Number of Questions** pill buttons (10/20/50/100); **Duration (Minutes)** input with a clock icon and a "Suggested: 3 minutes per question." hint; "Generate Infinite Test" button (blocked until an exam is picked, blocked entirely with a "Go to Profile" prompt if the student has no target exam set). 3 highlight cards below: AI Smart Selection, Instant Performance, Updated Bank.

**Live Tests (`/tests/live`) / Upcoming Tests (`/tests/upcoming`)** — identical layout: subject `Tabs` ("All Subjects" + one tab per distinct subject among the student's target-exam tests) and a search box, then a grid of `TestCard`s (colored header strip with a "Live" pulse badge, exam name, title; question count; duration; fee — "FREE" or "{credit_cost} credits"; "{n} attempt(s) left" when applicable; an "Attempt"/"Details" button, or a disabled "Attempted" state once `max_attempts` is used up). Both fall back to showing every test if the student has no target exam set.

**Exam-taking screen (`/test/[id]`)** — sticky header: test title, test-type + negative-marking badges, a pink/red pill Timer, "PROGRESS — X of Y Answered", "Submit Test" button, a thin progress bar. Question card: "Q. {n}" / "+{marks} Marks" / "−{penalty} Mark(s)" / difficulty badges, a per-question "Spent: MM:SS" stopwatch, a "Marked for Review" badge, a "Save as difficult" toggle, the question text, an optional question image, and 4 lettered options (A–D). A blue tip callout appears for Medium/Hard questions. Bottom bar: Previous / Clear Selection / Mark for Review / Next / Submit Test. Right sidebar: the Question Palette (color-coded grid, current question always shown in solid orange), a legend with live counts, and a "View Formulas" button. **Resume support**: reopening a test you'd started but never submitted restores your answers and current position and shows the true remaining time (not a fresh timer); if the original duration has fully elapsed, it auto-submits with whatever was saved and redirects straight to the result.

**Test Result (`/result/[id]`)** — full-bleed header: test title, exam badge, "Completed on {date}", "TOTAL SCORE X/Y". 4 stat cards: Accuracy (bar), Overall Rank ("#{rank} / {total candidates}", "Top {x}% of candidates"), Time Taken (+ real "faster/slower than avg." comparison against other students' attempts on the same test), Response Split (Correct/Wrong/Skipped counts). "Subject Breakdown" — per-subject accuracy bars + "View Weak Topics" link. "Strategic Insight" card — names the real weakest and strongest subject from this attempt. "Question-wise Analysis" — an All/Correct/Wrong/Skipped filter, an "Export PDF" action, and a numbered list of question cards (subject + question-type badges, "Your Answer"/"Correct Answer" boxes tinted by correctness, marks awarded, explanation), with "View N More Questions" pagination.

**Exam History (`/exam-history`)** — tabs **All / Self Practice / Mock Test**; each past attempt is a card (test title, exam name, submitted date, Score/Correct/Wrong/Accuracy stats, "View Full Detail" → the Result page).

**Bookmarks (`/bookmarks`)** — a simple list of bookmarked questions (question text + a "Remove" button per row); no options/difficulty shown here even though the API returns them.

**Revision — Wrong Questions (`/revision/wrong`)** — questions whose most recent attempt was incorrect, shown as full review cards (topic + difficulty badges, all 4 options with the correct one highlighted, an explanation panel) with **no action buttons** — this list is read-only.

**Revision — Difficult Questions (`/revision/difficult`)** — a union of admin-tagged-Hard-and-missed questions and questions the student self-flagged. Each card gets, where applicable, a "Remove from Difficult" button (only for self-flagged ones) and a "Re-attempt Question" button (resolves the question's topic → chapter → subject → exam, generates a 1-question/5-minute practice test on that topic, and jumps straight into it).

**Ranking (`/ranking`)** — a Scope select ("National (All Exams)" or a specific exam) and a Period select (All Time / Weekly / Monthly), then a table: Rank (badge, highlighted top 3), Name, Score, Attempts, Accuracy.

**Profile (`/profile`)** — avatar upload (camera-icon overlay, instant preview), email/phone verification badges. "Personal Details" form: First name, Last name, Phone, Date of birth, Gender (select), Education, State, City, Target Exam(s) (multi-select) — "Save Changes" button. "Verify your email" card (only shown if unverified) — "Send Verification Code" → 6-digit code input → "Verify Email" / "Resend Code". "Change Password" card — Current password, New password, Confirm new password (live mismatch warning) — "Update Password" button.

**Wallet (`/profile/wallet`)** — current credit balance + "Recharge" button, and a transaction table (Date, Reason, Test, Amount as a +/− credit badge, Balance After).

**Recharge (`/payments/recharge`)** — current balance, an optional "You need {n} more credit(s)" notice when arriving mid-flow, a list of recharge plans (₹ amount + credits, click to select), and a "Pay ₹{amount}" button that opens Razorpay Checkout (auto-succeeds with a synthetic payment id in dev mode when no gateway key is configured).

### Admin Panel

A completely separate layout at `/admin-dashboard/*`, guarded to ADMIN/SUPER_ADMIN only. Left sidebar (no topbar, no notifications, no admin avatar menu): **Dashboard**, **Question Management** (→ exam hierarchy), **Questions**, **Exam Management** (→ test scheduler), **Students**, **Payments**. *(Note: the nav labels are swapped from what you'd expect — "Question Management" opens the exam/subject/chapter/topic hierarchy screen, and "Exam Management" opens the test scheduler.)*

**Dashboard (`/admin-dashboard`)** — 5 stat cards: Students, Tests, Questions, Live Tests, Revenue (₹, paid orders only). 3 charts: Student Growth (30-day line chart), Test Attempts (30-day bar chart), Average Score (30-day line chart).

**Exam Hierarchy — "Question Management" (`/admin-dashboard/exam-management`)** — one page driving all 5 levels (Category → Exam → Subject → Chapter → Topic) via a breadcrumb trail; each level is a table with Edit/Delete and (for non-leaf rows) click-to-drill-in.
- Category: Name, Description, Active toggle.
- Exam: Name, Exam Type (select: SSC/UPSC/BPSC/CTET/STET/BANKING/RAILWAY/POLICE/DEFENCE/STATE_GOVT/ENGINEERING/MEDICAL/CA), Description, Active toggle.
- Subject: Name, Description, Order.
- Chapter: Name, Order (no description field).
- Topic: Name, Description, Order — plus, per topic, an "Upload" button (jumps to Bulk Import pre-scoped to that topic) and a "Generate with AI" button.
- **AI question generation dialog** — "How many questions?" (1–50), Difficulty select, "Start" button; then a live progress view (status badge, "{n}/{target} generated", progress bar, duplicate-skipped count) with "Stop" while running or "Generate More"/"Close" once finished.

**Questions (`/admin-dashboard/questions`)** — a search box (matches question text) and a table (Question, Topic, Difficulty badge, Marks). "Add Question" / per-row Edit opens a dialog: Topic select, Question textarea, exactly 4 options each with a radio to mark the correct one, Difficulty, Marks, Negative marks, Explanation. "Bulk Upload" button links to the import screen.

**Bulk Import (`/admin-dashboard/questions/import`)** — a column-reference table (topic, question_text, option_a–d, correct_option required; difficulty/marks/negative_marks/explanation/language optional), a Format select (CSV/JSON/XLSX) with downloadable templates, a drag-and-drop file dropzone, an "Upload" button, a per-row success/failure result table, and an import-history table (File, Format, Total, Success, Failed, Status).

**Test Scheduler — "Exam Management" (`/admin-dashboard/scheduler`)** — table of tests: Title, Exam, Scope (narrowest of topic/chapter/subject/full-exam), Type, Scheduled window, an interactive Status control (Publish/Schedule → LIVE or SCHEDULED, Archive → ARCHIVED, each behind a confirm dialog), Questions count, Pricing (Free or "{n} credits"), and an "Attempted By" icon that opens a table of every student's score for that test. "Add Test" / Edit opens a form: Exam, Subject/Chapter/Topic scope (cascading, all optional), Title, Test Type (Mock/Live/Previous Year), Start Time, Duration, Max Attempts, Negative Marking toggle (+ Negative Marks), Paid toggle (+ Credit Cost).
- **Test detail (`/admin-dashboard/scheduler/[id]`)** — the same header controls plus a Questions panel: "Add Questions" (search + difficulty filter, checklist, "Attach {n}") and "Auto-attach" (optional count + difficulty, random pick from the test's own scope). Once any student has attempted the test, the question set **locks** — Remove/Add/Auto-attach all disappear and a "Locked — {n} attempt(s)" badge shows instead.

**Students (`/admin-dashboard/students`)** — read-only: a search box (name/email/phone) and a table (Name, Email, Phone, Location, Target Exam, Active/Inactive status, Joined date). No create/edit/delete from this screen.

**Payments (`/admin-dashboard/payments`)** — **Recharge Plans** card (Amount, Credits, an inline Active/Inactive switch, Edit; "Add Plan" opens an Amount/Credits/Active form). **Free Practice Quota** card (two number settings + "Save Settings"). A "Total Revenue (filtered)" figure computed from the current order filters. **Orders** — search (by student) + a Status select (Paid/Created/Failed/Refunded), table of Student, Amount, Credits, Gateway, Status, Purchased At — read-only, no refund action in the UI.

## Getting Started

**Prerequisites:** Docker Desktop, Node.js 20+.

```bash
# 1. Copy environment config
cp .env.example .env

# 2. Start Postgres, Redis, Django API, and Celery (worker + beat)
docker compose up -d

# 3. Run migrations and seed the exam hierarchy (auto-run by the backend container's start command,
#    or run manually):
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py seed_exam_data

# 4. Install and run the frontend
cd frontend
npm install
npm run dev
```

- Backend API: `http://localhost:8012/api/v1/` (Swagger UI at `/api/docs/`)
- Frontend: `http://localhost:3012`

See `.env.example` for all configurable environment variables (Razorpay keys, OpenAI key, CORS, etc. — payments and AI generation gracefully no-op in dev if left blank).

## Project Structure

```
backend/
  apps/
    authentication/  # register, login, JWT, OTP, password flows
    users/           # profile, admin student management
    exams/           # category/exam/subject/chapter/topic hierarchy
    questions/       # question bank, bookmarks, difficult marks, bulk import, AI generation
    tests/           # test scheduling, start/submit/resume, practice generation
    attempts/        # attempt results, revision (wrong/difficult) lists
    leaderboard/     # global/exam rankings
    payments/        # credit wallet, Razorpay orders, admin payment tools
    analytics/       # student dashboard + admin platform analytics
    core/            # shared base models, permissions, response helpers
frontend/
  src/
    app/             # Next.js App Router routes (public, student, auth, admin)
    features/        # page-level client components (test attempt, results, etc.)
    components/      # shared UI primitives and app components
    services/        # API client functions per domain
docs/                # phase-wise build plan (SRS/DB/API/frontend reference docs)
docker/              # Dockerfiles
```

## Testing

```bash
# Backend (pytest + pytest-django)
docker compose exec backend python -m pytest

# Frontend (type-check + lint)
cd frontend
npx tsc --noEmit
npm run lint
```
