# Phase 13 — Full API Integration Hardening

## Objective

Cross-cutting cleanup pass so the frontend behaves consistently everywhere, not just in the individually-built happy paths.

## Scope

- Audit every page built in Phases 3–12: confirm all server data goes through React Query (no raw `useEffect` + `fetch`/`axios` outside the `services/` layer)
- Redux limited strictly to client/UI state (auth tokens, current theme, transient form state) — no server data duplicated into Redux
- Consistent error handling: a single toast/error-boundary pattern reused everywhere, including the Phase 7 `purchase_required` case, validation errors (422), and 5xx failures
- Token refresh race condition fixed: concurrent requests that all 401 at once must trigger only **one** refresh call, not one per request
- Rate-limit UX: if the backend throttles (e.g. login attempts), frontend shows a clear "try again in Ns" message instead of a generic error

## Definition of Done

- [ ] Grep across `frontend/src` finds no direct `axios`/`fetch` calls outside `services/*.ts`
- [ ] Forcing 5 simultaneous 401s (e.g. via devtools network throttling + multiple tabs of a component) results in exactly one refresh-token call
- [ ] Every API error shape (`success: false, message, errors`) renders through the same UI component
