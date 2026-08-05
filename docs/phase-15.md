# Phase 15 — Deployment

## Objective

Ship the full stack to a production Linux server, behind Nginx with SSL, with the production checklist verified.

## Scope

- Production Docker images for backend (Gunicorn) and frontend (Next.js standalone build)
- Nginx reverse proxy: routes `/api/*` to backend, everything else to frontend, serves static/media, handles gzip
- Celery worker + beat as separate long-running services (not inside the web dyno)
- SSL via Let's Encrypt/Certbot, auto-renewal configured
- Environment/secrets management: DB credentials, JWT secret, **Razorpay live keys** (Phase 7) kept out of source control, injected via server-level env or a secrets manager
- CI/CD pipeline: run Phase 14's test suites on every push, build+push Docker images, deploy on merge to main (or manual trigger, per team preference)

## Production Checklist (from the original SRS, verified here)

**Security**
- [ ] JWT secret rotated from dev default, access token lifetime sane (short), refresh token rotation enabled
- [ ] Passwords hashed (Django default — verify not overridden)
- [ ] CORS restricted to the actual frontend origin(s), not `*`
- [ ] Rate limiting on login and payment order creation
- [ ] Input validation on every serializer, including file upload size/type limits (Phase 5)
- [ ] Razorpay webhook signature verification enforced (Phase 7) — no webhook payload trusted without it

**Performance**
- [ ] DB indexes from Phase 2 present in production migrations
- [ ] Redis cache active for dashboard/analytics aggregates (Phase 9/10)
- [ ] Pagination enforced on every list endpoint
- [ ] Static assets served via CDN or Nginx with proper cache headers

**Quality**
- [ ] Swagger/Redoc reachable in production (or gated behind admin auth, per preference)
- [ ] Phase 14 test suites green in CI
- [ ] Structured logging in place (at minimum: auth failures, payment events, 5xx errors)
- [ ] Error handling returns the standard `{ success, message, errors }` shape everywhere, no raw stack traces leaked to clients

## Definition of Done

- [ ] `docker-compose -f docker-compose.prod.yml up` deploys the full stack on the target server
- [ ] Site reachable over HTTPS with a valid certificate
- [ ] A real (or test-mode) end-to-end purchase + test attempt succeeds against the production deployment
- [ ] All checklist items above verified, not assumed
