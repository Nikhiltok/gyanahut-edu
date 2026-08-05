# Stitch Design Prompt — Gyanahut Edu

> Copy the block below (between the horizontal rules) directly into Stitch. It covers the whole product — brand direction, navigation, and every screen across the public site, student app, and admin panel — so the generated designs stay consistent with each other and with what's already implemented in code.

---

## App Summary

**Gyanahut Edu** is an Indian competitive-exam prep platform (SSC, UPSC, BPSC, CTET, STET, Banking, Railway, Police, Defence, State Govt, Engineering, Medical, CA). Students practice via admin-scheduled Mock/Live tests and previous-year papers, or generate unlimited on-demand "Infinite Test" practice sessions themselves. Progress is tracked with rankings, weak-topic analytics, bookmarks, and a full attempt history. Paid content is unlocked with a prepaid **credit wallet** (not real-money-per-test) that students top up via admin-defined recharge plans (e.g. ₹10 → 12 credits). Admins manage the entire content pipeline: exam hierarchy, question bank (manual/bulk-import/AI-generated), test scheduling, students, and payments.

Tagline: **अभ्यासात् सिद्धिः — "Success through Practice"**

Design for **web**, responsive down to mobile (student-facing screens especially — many students are on phones). Two very different personas use this app: **students** (younger, exam-stressed, need clarity/motivation/speed) and **admins** (content managers, need dense data tables and efficient CRUD, less decoration).

## Design Direction

- **Mood:** energetic but trustworthy — a serious exam-prep tool, not a toy. Confident, warm, motivational (celebrate progress/ranks) without being childish.
- **Primary color:** a warm terracotta / burnt-orange-red (CSS `oklch(0.495 0.136 47.315)`, roughly a rust/sienna orange-red — think baked clay or terracotta pottery, NOT bright orange).
- **Gradient motif:** hero banners and primary CTAs use a diagonal gradient from the primary terracotta into a **deep maroon `#721315`** — this primary→maroon gradient is the single most recognizable brand signature, used on: dashboard/practice-generator hero banners, primary buttons, active nav states. Banners also get a subtle radial white-glow overlay (two soft radial highlights at ~15%/20% and ~85%/80% position, low opacity) for depth.
- **Secondary/accent:** a muted brick-red secondary, plus a cool blue "tertiary" accent (`oklch(0.496 0.219 261.327)`) used sparingly for charts/links/info states — keeps the palette from being all-warm.
- **Neutrals:** near-white warm-gray background, white cards, warm-gray borders. Full **dark mode** required — dark backgrounds shift toward a warm near-black brown (not pure gray/blue-black), keeping the terracotta primary but brightened for contrast.
- **Typography:** clean sans body text (Inter), a distinct heading font for titles/headings (Geist Sans) — headings should read slightly more geometric/modern than body text. Monospace (Geist Mono) only for things like timers/codes.
- **Shape language:** generously rounded corners throughout (large radius, ~12px base scaling up to pill-shaped buttons/badges). Cards, badges, and buttons all rounded; question-palette cells and option letters are circular/pill.
- **Elevation:** soft, colored shadows (e.g. a primary-tinted glow under hero banners/gradient buttons) rather than plain gray drop-shadows.
- **Iconography:** simple line icons (Lucide-style), used consistently for nav items and stat cards.
- **Data viz:** score/accuracy/performance charts use the primary terracotta + blue tertiary + a couple of supporting hues (amber, purple) — keep charts warm-led, not a generic default palette.

## Information Architecture

**Public (unauthenticated) nav:** Logo ("Gyanahut Edu" + Sanskrit tagline) — Home, Categories/Exams, Features — Login / Register CTAs.

**Student app — left sidebar** (collapses to a horizontal scrollable tab bar on mobile): Logo + "Target: {exam name}" subtitle under it, then:
- Overview (dashboard)
- Infinite Test (practice generator)
- Live Tests
- Upcoming Tests
- Exam History
- Bookmarks
- Wallet
- *(Analysis group, separately labeled)* Wrong Questions, Difficult Questions, Ranking
- *(bottom, separated by divider)* Profile, Logout

**Admin panel — left sidebar:** Overview/Dashboard, Exam Management, Questions (+ Bulk Import), Scheduler, Students, Payments.

## Screens to Design

### A. Public / Marketing
1. **Landing page (`/`)** — hero with gradient banner, headline + subhead selling the platform, primary CTA ("Start Practicing Free" → register), secondary CTA (browse exams). Sections below: exam categories grid, "why Gyanahut" feature highlights (3-4 cards, icon + title + description — mirror the tone of "AI Smart Selection / Instant Performance / Updated Bank" used elsewhere), testimonials or stats strip (students, questions, exams covered), footer.
2. **Features page (`/features`)** — longer-form marketing page expanding on platform capabilities (practice engine, mock tests, analytics, leaderboard, credit wallet) — icon+text feature blocks.
3. **Categories (`/categories`)** — grid of exam categories (SSC, UPSC, Banking, Railway, etc.), each a card with an image/icon, name, short description.
4. **Category detail (`/category/[slug]`)** — exams within that category, listed as cards.
5. **Exam detail (`/exam/[slug]`)** — one exam's overview: description, exam type badge, subjects covered summary, CTA to view subjects or start practicing.
6. **Exam subjects (`/exam/[slug]/subjects`)**, **Subject chapters (`/subject/[id]/chapters`)**, **Chapter topics (`/chapter/[id]/topics`)** — three nested drill-down listing pages, consistent breadcrumb + card-grid pattern, each level narrowing scope (Exam → Subject → Chapter → Topic), used both for browsing and as the scope-picker feeding into practice generation.

### B. Auth
7. **Login (`/login`)** — centered card, email/phone + password, "Forgot password" link, link to Register. Clean, minimal, brand logo above the card.
8. **Register (`/register`)** — centered card, name/email or phone/password/target-exam fields.
9. **Forgot Password (`/forgot-password`)** — email input, "send reset link" confirmation state.
10. **Reset Password (`/reset-password`)** — new password + confirm fields.

### C. Student App

11. **Dashboard (`/dashboard`)** — the student's home. Gradient hero banner with greeting + notification/help icons + avatar. Below: a stat-card row (score, accuracy, rank, streak/study-progress), a weak-topics card (topics needing work, called out visually as a gentle warning, not harsh), a recent-tests list (mini test cards, "in progress attempt" resume banner if one exists), and a performance-over-time line/area chart.
12. **Infinite Test / Practice Generator (`/practice/generate`)** — gradient hero ("Infinite Test — Create your custom practice session"), a card overlapping the hero (negative margin) containing: cascading Exam → Subject → Chapter → Topic selects, a pill-button question-count picker (10/20/50/100), a duration number input, a **live cost indicator** ("Free — 2 of 3 free practice tests left this month" in green, or "Costs 20 credits" in muted text, updating as the student changes question count), and a large gradient "Generate Infinite Test" button. Below: 3 highlight cards explaining the feature (AI-selection, instant analytics, fresh question bank).
13. **Live Tests (`/tests/live`)** and **Upcoming Tests (`/tests/upcoming`)** — grid of test cards; each card shows exam badge, LIVE pulse indicator (live page only), title, question count, duration, a **Fee badge** ("FREE" in green or "N credits"), attempts-left note, and a primary action button. A subject/tag filter tab row above the grid.
14. **Test attempt screen (`/test/[id]`)** — the core exam-taking UI, full-height, no sidebar. Sticky top bar: test title + type + negative-marking badge, countdown timer, "answered X of Y" counter, thin progress bar beneath, Submit button. Main area: question card (question number pill, marks/negative-marks/difficulty badges, question text, optional image, lettered A/B/C/D options as large selectable rows, a stopwatch, "mark for review" and "save as difficult" toggles) with Previous/Clear/Mark-for-Review/Next controls below. Right rail: a question-palette grid (color-coded: not visited / not answered / answered / marked / answered+marked), plus a subtle tip card. Modals: submit confirmation (answered vs unanswered count) and a "time's up" dialog.
15. **Result page (`/result/[id]`)** — score/rank header, then a performance chart, a subject-wise accuracy chart, and a time-analysis chart, followed by a full per-question review list (your answer vs correct answer, explanation).
16. **Exam History (`/exam-history`)** — a tab selector (**All / Self Practice / Mock Test**), then a grid of attempt-summary cards (test title, exam name, date badge, score/correct/wrong/accuracy mini-stats, "View Full Detail" button).
17. **Bookmarks (`/bookmarks`)** — saved-question cards with a short preview and remove action.
18. **Revision — Wrong Questions / Difficult Questions (`/revision/wrong`, `/revision/difficult`)** — read-only review list reusing the question-card/option/explanation pattern from the attempt screen, but non-interactive.
19. **Ranking (`/ranking`)** — a filter dropdown (National / State / Exam-wise / Weekly / Monthly), the current student's own rank card pinned near the top, then a leaderboard table (rank, avatar+name, score, accuracy).
20. **Profile (`/profile`)** — avatar, editable name/target-exam/contact fields, account section (change password), logout.
21. **Wallet (`/profile/wallet`)** — a balance card ("current balance: N credits" + "Recharge" button), below it a full transaction ledger table (date, reason — Recharge/Mock Test/Self Practice/Free Practice/Refund/Admin Adjustment, related test if any, amount with +/− coloring, running balance after).
22. **Recharge (`/payments/recharge`)** — current-balance summary, an optional "you need N more credits" amber notice (when arriving here after being blocked), a vertical list of selectable plan cards (each: "₹10" left-aligned bold, "12 credits" right-aligned muted, selected state = primary border + tinted background), and a "Pay ₹N" gradient button.

### D. Admin Panel

23. **Admin Dashboard (`/admin-dashboard`)** — platform-wide stat cards (students, tests, questions, revenue), a growth chart (signups/activity over time), and a revenue widget.
24. **Exam Management (`/admin-dashboard/exam-management`)** — a nested tree/tab CRUD interface across Category → Exam → Subject → Chapter → Topic, with add/edit dialogs at each level and a data table or nested list view.
25. **Questions (`/admin-dashboard/questions`)** — searchable/filterable question table (topic, difficulty, type columns), with actions to add/edit/delete a question (including its options and correct-answer marking) and an entry point to Bulk Import.
26. **Bulk Import (`/admin-dashboard/questions/import`)** — file upload (CSV/XLSX/JSON) area, format guidance, and an import-results summary (success/failed counts, error list) plus a history of past import runs.
27. **Scheduler (`/admin-dashboard/scheduler`)** — table/calendar of all tests (title, exam, type, status badge, question count, "Pricing" column showing "N credits" or "Free", attempted-by count), a status menu per row (Publish/Archive), and an Add/Edit Test dialog (exam+scope selects, title, type — **Mock/Live/Previous Year only, no Practice option**, duration, start time, max attempts, negative marking toggle+value, "Paid (Credit Wallet)" toggle revealing a Credit Cost number field).
28. **Scheduler test detail (`/admin-dashboard/scheduler/[id]`)** — a single test's question set management: attach questions manually (searchable picker) or auto-attach by scope+difficulty+count, reorder/remove attached questions, and a list of students who've attempted it with their scores.
29. **Students (`/admin-dashboard/students`)** — student list/table (name, email, target exam, join date, status) with search and a detail/edit view.
30. **Payments (`/admin-dashboard/payments`)** — two cards side by side: **Recharge Plans** (table of all plans with amount/credits/status columns, inline active/inactive switch per row, "Edit" per row, "Add Plan" button opening a small dialog) and **Free Practice Quota** (two number inputs: free attempts/month, free max questions, "Save Settings"). Below: a total-revenue summary card, then a searchable/filterable (by status) table of all recharge orders (student, amount, credits, gateway, status badge, purchased-at).

## Consistent Components (reuse across every screen)

- **Gradient hero banner** — rounded-2xl, primary→maroon diagonal gradient, white text, radial glow overlay. Used on: dashboard, practice generator, and other student "landing" moments within the app.
- **Stat card** — small label on top (muted, uppercase, tiny), bold value beneath, occasionally an icon or trend indicator.
- **Test/content card** — colored gradient header strip (exam badge + optional LIVE pulse + title) over a white body (question count / duration / fee / attempts-left / action button).
- **Question palette grid** — small square/rounded cells, color-coded by status, in a sidebar card.
- **Status badges** — pill-shaped, color-coded (LIVE=pulsing accent, PAID/Active=primary-filled, FREE/Inactive=neutral, FAILED/error=destructive red).
- **Data tables (admin)** — clean, dense, zebra-free, sortable-looking headers, row actions on the right, search input + status-filter dropdown above.
- **Dialogs/forms** — centered modal, grouped labeled fields, cancel (outline) + primary (gradient/filled) action pair in the footer.
- **Empty/loading states** — skeleton blocks for loading; short friendly copy + relevant icon for empty states (e.g. "You haven't attempted any test yet").

## Notes for Stitch

- Design **light and dark mode** for every screen — dark mode is a warm near-black, not a generic gray/blue dark theme.
- Design **mobile-responsive** versions of the student-facing screens especially (dashboard, test attempt, exam history, wallet) — assume a large share of students are on phones; the admin panel can be desktop-first.
- Keep the terracotta→maroon gradient as the *one* strong accent — most of the UI should otherwise be calm neutrals so the gradient banners/CTAs stand out rather than competing with color everywhere.
- The exam-attempt screen (#14) is the highest-stakes screen in the product (timed, high-stress) — prioritize clarity, minimal distraction, and unmistakable timer/progress visibility over decoration.
- Generate a cohesive design system (color tokens, type scale, spacing, button/card/badge/table styles) first if possible, then apply it consistently across all screens listed above.

---
