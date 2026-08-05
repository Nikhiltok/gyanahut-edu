# Phase 12 — Frontend Admin Panel (Polish Pass)

## Objective

Admin can run the entire content + monetization pipeline through the UI alone, with no direct API calls needed.

## Scope

- Complete any CRUD screens not fully finished during Phases 4–7: Category, Exam, Subject, Chapter, Topic management pages — table + form + delete confirmation for each
- Question bank admin UI polish: table sorting/pagination, filter combinations, bulk-upload UX (drag-drop, progress, inline validation report)
- Scheduler UI polish: calendar view, publish/archive actions with confirmation, **price/discount price fields with currency formatting and validation** (Phase 7)
- Consistent `DataTable`, `CategoryForm`-style patterns reused across all entities to avoid one-off implementations per module

## Definition of Done

- [ ] Admin performs the full pipeline through the UI only: Category → Exam → Subject → Chapter → Topic → Question (manual + bulk) → Test → attach questions → schedule → set price → publish
- [ ] Every admin list page supports pagination, and at least basic filter/search
- [ ] Destructive actions (delete category/exam/question) require a confirmation dialog
