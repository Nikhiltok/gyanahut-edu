# Phase 4 — Exam Management Module

## Objective

Full CRUD for the Category → Exam → Subject → Chapter → Topic hierarchy, with student read-only access and admin full control.

## Backend

Public/student (read-only):
- `GET /categories/`, `GET /categories/{id}/`
- `GET /exams/?category=slug`, `GET /exams/{id}/`
- `GET /subjects/?exam=id`
- `GET /chapters/?subject=id`
- `GET /topics/?chapter=id`

Admin (`IsAdminOrSuperAdmin` permission class):
- `POST/PUT/DELETE /admin/categories/{id}/`
- `POST/PUT/DELETE /admin/exams/{id}/`
- `POST/PUT/DELETE /admin/subjects/{id}/`
- `POST/PUT/DELETE /admin/chapters/{id}/`
- `POST/PUT/DELETE /admin/topics/{id}/`

Cross-cutting: pagination on all list endpoints, `django-filter` for query params, slug auto-generation for Category/Exam.

## Frontend

Student pages: `/categories`, `/category/[slug]`, `/exam/[slug]`, `/exam/[slug]/subjects`, `/subject/[slug]/chapters`, `/chapter/[slug]/topics`
Components: `CategoryGrid`, `CategoryCard`, `ExamGrid`, `ExamCard`, `ExamHeader`, `SubjectList`, `TestList`

Admin pages: `/admin/categories`, `/admin/exams`, `/admin/subjects`, `/admin/chapters`, `/admin/topics`
Components: `DataTable`, `CategoryForm` (reused/adapted per entity), `DeleteDialog`

## Definition of Done

- [ ] Admin can create a full chain: Category → Exam → Subject → Chapter → Topic through the API (Postman/Swagger is enough at this stage; UI lands with this same phase if time allows, otherwise carries into Phase 12)
- [ ] Student-facing list/detail endpoints correctly filter by parent (e.g. `/subjects/?exam=<uuid>` only returns that exam's subjects)
- [ ] Only ADMIN/SUPER_ADMIN roles can hit the `/admin/*` endpoints — verified with a STUDENT-role token getting 403
