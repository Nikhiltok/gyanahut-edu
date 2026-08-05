# Phase 11 — Frontend Student Portal (Polish Pass)

## Objective

Complete every remaining student-facing page beyond what earlier phases already delivered, and make the whole student journey production-quality.

## Scope

- Public/marketing pages: `/` (Hero, CategoryCard, ExamCard, FeatureSection, LeaderboardPreview, Testimonials, Footer)
- SEO landing pages: `/ssc-cgl`, `/upsc`, `/bpsc`, `/ctet`, `/banking`, etc. — each with exam info, syllabus, linked mock tests (including price, from Phase 7), and previous papers
- Loading / error / empty states added consistently across every student page built in Phases 3–9 (skeleton loaders, retry buttons, "no data yet" illustrations/copy)
- Responsive pass across `sm`/`md`/`lg`/`xl` breakpoints for every student page
- SEO metadata (`generateMetadata`, OpenGraph tags) for public/SEO pages

## Definition of Done

- [ ] Full journey navigable end-to-end on a real device/browser: landing → register → browse exam → practice → buy a paid mock test → attempt → result → ranking
- [ ] No student page shows a raw error, infinite spinner, or blank screen for an empty/error API response
- [ ] Lighthouse mobile score is reasonable on the landing and one SEO page (no hard numeric target required for MVP, but no obvious regressions like unoptimized images)
