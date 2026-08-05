# Phase 7 — Credit Wallet & Payments

> **Revision (2026-07-16):** This phase originally specified flat per-test pricing (Admin sets a fixed ₹ price per Mock/Live test). It is now replaced by a prepaid **Credit Wallet**: students recharge a wallet with real money. Two different cost rules apply depending on how a test came into existence — see below.
>
> **Revision 2 (2026-07-16):** The recharge side no longer uses a flat ₹→credit conversion rate (`credits_per_rupee`). Instead, Admin defines discrete **Recharge Plans** — e.g. ₹10 → 12 credits, ₹50 → 55 credits, ₹100 → 110 credits — each priced independently (bigger packs can carry a proportionally bigger bonus, admin's call per plan, not a formula). Students pick one of these plans; there's no free-text ₹ amount entry anymore. See **Recharge Plans** below.
>
> **Implemented** — see Implementation Status at the bottom.

## The Two Test Origins (and why they're priced differently)

The codebase already has two structurally different ways a `Test` gets created ([tests/views.py](../backend/apps/tests/views.py)):

| Origin | Endpoint | `test_type` | Who sets it up |
|---|---|---|---|
| **Self-practice** | `GeneratePracticeTestView` ([tests/views.py:324](../backend/apps/tests/views.py#L324)) | `PRACTICE`, `created_by.role=STUDENT` | Student picks scope + question count on demand, goes `LIVE` instantly |
| **Admin-scheduled** | `TestAdminViewSet` ([tests/views.py:88](../backend/apps/tests/views.py#L88)) | `MOCK` / `LIVE` / `PREVIOUS_YEAR` (typically) | Admin builds the question set (manual/auto-attach), publishes/schedules it |

These get **different pricing rules**, because they're different products from a business point of view: self-practice is a commodity (any question, any time, student picks the count), while an admin-built Mock/Live test is curated content the admin wants to price on its own merit — not forced into a fixed per-question formula.

| Origin | Cost rule |
|---|---|
| **Self-practice** | **Formula-based**: `question_count` credits, minus a monthly free quota (see below). Debited **at generation time**, since the test goes live immediately. |
| **Admin-scheduled (Mock/Live/etc.)** | **Admin-decided flat number**: Admin manually enters a credit cost per test (like the old `price` field, but denominated in credits, not ₹). Debited **at `/start/`**, same checkpoint as today. |

## Platform Settings (admin-configurable, not hardcoded)

Singleton `PlatformSettings` model (one row, edited from an admin screen) — now scoped to the self-practice free quota only, since recharge pricing moved to Recharge Plans (below):

| Field | Type | Default | Notes |
|---|---|---|---|
| `free_practice_attempts_per_month` | PositiveIntegerField | 3–4 (admin sets) | How many self-practice attempts per calendar month are free |
| `free_practice_max_questions` | PositiveIntegerField | 15 (admin sets) | A self-practice attempt only qualifies as free if `question_count` is at or under this cap — request more questions than this and the whole attempt is paid, not just the excess |

## Recharge Plans (admin-defined, no flat conversion rate)

New `payments.RechargePlan` model — each row is one purchasable option, e.g. ₹10 → 12 credits, ₹50 → 55 credits, ₹100 → 110 credits:

| Field | Type | Notes |
|---|---|---|
| `amount` | DecimalField | ₹ price |
| `credits` | PositiveIntegerField | Credits granted — set independently of `amount`, so bigger packs can carry a bigger bonus without needing a formula |
| `status` | BooleanField (default `True`) | Inactive plans are hidden from students but kept for history — past `Order` rows still reference them |

- `GET /payments/plans/` (authenticated) — active plans only, for the student recharge picker
- `GET/POST/PATCH/DELETE /admin/payments/plans/` (`AdminRechargePlanViewSet`, admin-only) — full CRUD, including inactive plans, for the admin management screen

Students can only recharge by picking one of these plans (`POST /payments/recharge/` takes `plan_id`, not a free-text ₹ amount) — this keeps pricing entirely admin-curated, matching how the old flat-price-per-test model gave admin per-test discretion.

Editing or deactivating a plan only affects **future** recharges — `Order.credits_purchased` is snapshotted from `RechargePlan.credits` at order-creation time, so past orders never change if a plan is later edited.

## Model Changes

### `Test` (`backend/apps/tests/models.py`)

| Field | Change |
|---|---|
| `is_paid` | Keep — for admin-scheduled tests only. `False` = free test. `True` = `credit_cost` applies at `/start/`. (Self-practice tests don't use this field — their cost is computed from `question_count`, not admin-set.) |
| `credit_cost` | **Add** — PositiveIntegerField, null/blank, required when `is_paid=True`. Admin types this in directly; no relationship to `total_questions` is enforced (admin has full discretion — a 100-question mock could cost 20 credits or 200, that's a business call, not a formula). |
| `price`, `discount_price`, `currency` | **Remove** — superseded by `credit_cost` (credits, not ₹). |

### `payments.Order` — repurposed as a wallet top-up record

`test` FK removed (an order is a recharge, not a test purchase); `amount` (₹ paid) and `credits_purchased` stay, both snapshotted from the chosen `RechargePlan` at order-creation time. New `plan` FK (nullable, `SET_NULL`) points at the `RechargePlan` that was purchased, for traceability — nullable so deleting a plan later doesn't cascade-delete order history.

### New: `payments.Wallet`

`student` (OneToOne → User), `balance` (PositiveIntegerField, credits).

### New: `payments.CreditTransaction` (ledger)

| Field | Notes |
|---|---|
| `wallet` | FK |
| `type` | `CREDIT` / `DEBIT` |
| `source` | `RECHARGE`, `TEST_ATTEMPT` (admin-scheduled paid test), `SELF_PRACTICE` (paid self-practice), `FREE_PRACTICE` (0-amount, exists purely to count quota usage for the month), `REFUND`, `ADMIN_ADJUSTMENT` |
| `amount` | Credits moved (0 for `FREE_PRACTICE`) |
| `order` / `test` (nullable FKs) | Whichever is relevant to the source |
| `balance_after`, `note` | Same as before — audit snapshot / free text |

## Self-Practice Credit Gating (`GeneratePracticeTestView`)

New logic inserted before the `Test.objects.create(...)` call at [tests/views.py:363](../backend/apps/tests/views.py#L363):

```
free_used_this_month = CreditTransaction.objects.filter(
    wallet__student=request.user, source="FREE_PRACTICE",
    created_at__year=now.year, created_at__month=now.month,
).count()

settings = PlatformSettings.get_solo()
qualifies_free = (
    free_used_this_month < settings.free_practice_attempts_per_month
    and data["question_count"] <= settings.free_practice_max_questions
)

if qualifies_free:
    # write a 0-amount FREE_PRACTICE ledger row (quota tracking only)
else:
    cost = data["question_count"]
    with transaction.atomic():
        wallet = Wallet.objects.select_for_update().get(student=request.user)
        if wallet.balance < cost:
            return 402 insufficient_credits {required, available, shortfall}
        # debit wallet, write SELF_PRACTICE ledger row

# only now create Test + TestQuestion rows — nothing is created if payment fails
```

Debiting (or granting the free slot) **before** creating the `Test` row means a failed payment never leaves an orphaned practice test behind.

## Access Control Change (admin-scheduled tests)

`POST /tests/{id}/start/` ([tests/views.py:387](../backend/apps/tests/views.py#L387)) — same checkpoint as today's `if test.is_paid:` block (currently lines 402–414, checking for a paid `Order`), now debits `test.credit_cost` credits instead:

```
if test.is_paid:
    cost = test.credit_cost
    with transaction.atomic():
        wallet = Wallet.objects.select_for_update().get(student=request.user)
        if wallet.balance < cost:
            return 402 {
                "errors": {"code": "insufficient_credits", "required": cost,
                           "available": wallet.balance, "shortfall": cost - wallet.balance}
            }
        wallet.balance -= cost
        wallet.save(update_fields=["balance"])
        CreditTransaction.objects.create(
            wallet=wallet, type="DEBIT", source="TEST_ATTEMPT",
            amount=cost, test=test, balance_after=wallet.balance,
        )
```

`select_for_update()` on the wallet row prevents a double-click / two-tab race from spending the same credits twice — same reasoning as the self-practice path above.

**Resume case** ([tests/views.py:422](../backend/apps/tests/views.py#L422)): an already-started attempt resumes without a second debit — the credit spend happens once, at first `/start/`, not on every resume call. This matches the existing comment in that code about re-checking access on resume (e.g. a refunded order) — same idea applies: if credits were refunded after the attempt started, resuming should probably be blocked, but finishing an attempt already paid for should never be charged twice.

## Refunds

Unchanged from prior revision: Admin-triggered `CreditTransaction(type=CREDIT, source=REFUND)` for cancelled/archived tests or server-side attempt errors. Manual action for MVP, no automatic trigger.

## Admin UI

- **"Recharge Plans" card** (`/admin-dashboard/payments`) — table of all plans (active + inactive), "Add Plan" dialog (amount, credits, active toggle), inline status toggle per row, "Edit" per row
- **"Free Practice Quota" card** (same page) — edits `PlatformSettings`: free practice attempts/month, free practice max questions
- Scheduler form (`/admin/scheduler`) — "Is Paid Test" toggle stays; **Price/Discount fields replaced by a single "Credit Cost" number input** (admin types it directly — no auto-computation from question count, per the decision above)
- Admin dashboard Revenue widget — sums `Order.amount` (₹ recharged, `status=PAID`)
- `/admin/orders` — recharge history + per-student manual credit adjustment (writes `ADMIN_ADJUSTMENT` ledger rows)

## Frontend (Student)

- Wallet balance always visible — "Wallet" sidebar link (`AppSidebar`)
- `/payments/recharge` (under the already-protected `/payments` route prefix) — fetches `GET /payments/plans/` and shows each active plan as a selectable card ("₹10 → 12 credits", etc.); pre-selects the cheapest plan covering any `shortfall` query param → Razorpay Checkout.js → `/payments/verify/` → balance refreshes. No ₹ amount is ever typed by the student.
- Self-practice generation form (`PracticeGeneratorClient`) — calls `GET /payments/practice-quota/` and shows "Free (N/month remaining)" or "Costs X credits" live as the student adjusts question count, before they submit
- Admin-scheduled test card (`TestCard`) — "N credits" badge or "Free"
- `insufficient_credits` from either flow (test start or self-practice generation) → redirect to `/payments/recharge?redirect=<origin>&shortfall=<n>`, pre-filling the suggested recharge amount
- `/profile/wallet` (renamed from the old `/profile/purchases`) — full ledger (recharges, self-practice debits, mock-test debits, free-practice usage, refunds, admin adjustments) via `GET /payments/transactions/`

## Open Questions (flagged for review before implementation)

1. **Free-quota scope** — is `free_practice_attempts_per_month` per student globally, or per-exam? Doc assumes **global per student** (simplest); flag if per-exam quotas are actually wanted.
2. **Existing paid `Order` rows** — same migration concern as before: any live paid-Order data from the old flat-price model needs a one-time backfill decision before cutover.
3. **Credit expiry / RBI PPI compliance** — still open: a real-money-backed wallet likely falls under RBI's Prepaid Payment Instrument rules (minimum validity, refund-to-source, KYC thresholds). Needs legal/CA sign-off before this ships, independent of the cost-rule design above.
4. **No plans configured yet** — a fresh install has zero `RechargePlan` rows until Admin creates some from the "Recharge Plans" card; until then `/payments/recharge` has nothing to show. Not a bug, just an onboarding step to remember (maybe worth a seed migration with a few sane defaults — not done here, flagging for a product decision).

~~**Admin-created `PRACTICE`-type tests falling through the cracks**~~ — **resolved**: [phase-6.md](phase-6.md) now excludes `PRACTICE` from the admin scheduler's `test_type` choices entirely, so a `PRACTICE` test can only ever come from `GeneratePracticeTestView` (student self-serve). The origin split this doc relies on is enforced at the scheduler level, not just assumed.

~~**Recharge pack sizes / minimum recharge**~~ — **resolved by the Recharge Plans model**: admin defines each plan's exact ₹ amount and credit payout directly (e.g. ₹10 → 12, ₹50 → 55, ₹100 → 110), no formula or conversion rate involved.

## Implementation Status

**Implemented** (backend + frontend, 2026-07-16, including the Recharge Plans revision) — 54 backend tests passing in `apps/payments/tests.py` + `apps/tests/tests.py`, full 82-test backend suite green, frontend typecheck/lint/production build all clean. Razorpay integration still runs in the existing dev-mode fallback (no live keys configured) — that part is untested against real Razorpay, same as it always was.

## Definition of Done

- [x] Admin creates Recharge Plans (₹10→12, ₹50→55, ₹100→110) and a free-practice quota (3/month, max 15 questions) from the admin Payments screen
- [x] Student recharges via the ₹10→12-credit plan, wallet balance becomes 12 credits (from the plan's stored `credits`, not a computed rate)
- [x] Deactivating a plan hides it from `/payments/plans/` (student picker) but the plan and its past `Order` rows remain intact
- [x] Recharging against an inactive or nonexistent `plan_id` is rejected (404)
- [x] Student generates a 15-question self-practice test within their free quota — no credits deducted, a `FREE_PRACTICE` ledger row is written
- [x] Student generates a 4th self-practice test in the same month (quota exhausted) — credits deducted equal to actual question count
- [x] Student requests a 20-question self-practice test (over the 15-question free cap) even with quota remaining — full 20 credits deducted, not treated as free
- [x] Admin creates a Mock test, toggles "Is Paid", sets Credit Cost = 50 — no relation to the test's actual question count required
- [x] Student with < 50 credits gets `insufficient_credits` (402) from `/start/` on that mock test
- [x] Student with ≥ 50 credits starts the mock test, wallet debits by exactly 50, a `TEST_ATTEMPT` ledger row is created
- [x] Resuming an in-progress attempt never debits credits a second time
- [x] Two concurrent requests that would each individually succeed but not both together (self-practice or `/start/`) never both succeed — race covered by `select_for_update`
- [x] Admin can manually adjust a student's credit balance, producing an `ADMIN_ADJUSTMENT` ledger row
- [x] Webhook handler remains idempotent — replaying a webhook payload never double-credits the wallet
- [x] `/profile/wallet` shows the full ledger — every source type, each with a running balance
