import pytest
from django.urls import reverse

from apps.payments.models import CreditTransaction, Order, PlatformSettings, RechargePlan, Wallet
from apps.tests.models import Test

pytestmark = pytest.mark.django_db


@pytest.fixture
def paid_test(question, admin_user):
    return Test.objects.create(
        exam=question.topic.chapter.subject.exam,
        title="Paid Mock Test",
        test_type=Test.TestType.MOCK,
        duration=60,
        max_attempts=3,
        status=Test.Status.LIVE,
        is_paid=True,
        credit_cost=50,
        created_by=admin_user,
    )


@pytest.fixture
def plan():
    return RechargePlan.objects.create(amount=10, credits=100, status=True)


@pytest.fixture
def inactive_plan():
    return RechargePlan.objects.create(amount=20, credits=190, status=False)


def test_recharge_plans_lists_only_active_plans(auth_client, plan, inactive_plan):
    response = auth_client.get(reverse("payments-plans"))
    assert response.status_code == 200
    ids = [p["id"] for p in response.data["data"]]
    assert str(plan.id) in ids
    assert str(inactive_plan.id) not in ids


def test_recharge_creates_order_from_plan(auth_client, plan):
    response = auth_client.post(reverse("payments-recharge"), {"plan_id": str(plan.id)})
    assert response.status_code == 201
    assert response.data["data"]["amount"] == 10.0
    assert response.data["data"]["credits"] == 100
    order = Order.objects.get(student__email="student@test.com", status=Order.Status.CREATED)
    assert order.plan_id == plan.id
    assert order.credits_purchased == 100


def test_recharge_rejects_inactive_plan(auth_client, inactive_plan):
    response = auth_client.post(reverse("payments-recharge"), {"plan_id": str(inactive_plan.id)})
    assert response.status_code == 404


def test_recharge_rejects_unknown_plan(auth_client):
    import uuid

    response = auth_client.post(reverse("payments-recharge"), {"plan_id": str(uuid.uuid4())})
    assert response.status_code == 404


def test_verify_payment_credits_wallet(auth_client, plan):
    order_response = auth_client.post(reverse("payments-recharge"), {"plan_id": str(plan.id)})
    gateway_order_id = order_response.data["data"]["gateway_order_id"]

    verify_response = auth_client.post(
        reverse("payments-verify"),
        {"gateway_order_id": gateway_order_id, "gateway_payment_id": "pay_test_123", "signature": ""},
    )
    assert verify_response.status_code == 200
    assert verify_response.data["data"]["status"] == "PAID"

    order = Order.objects.get(gateway_order_id=gateway_order_id)
    assert order.status == Order.Status.PAID
    assert order.purchased_at is not None

    wallet = Wallet.objects.get(student__email="student@test.com")
    assert wallet.balance == 100
    assert CreditTransaction.objects.filter(
        wallet=wallet, type=CreditTransaction.Type.CREDIT, source=CreditTransaction.Source.RECHARGE, amount=100
    ).exists()


def test_verify_payment_twice_is_idempotent_and_does_not_double_credit(auth_client, plan):
    order_response = auth_client.post(reverse("payments-recharge"), {"plan_id": str(plan.id)})
    gateway_order_id = order_response.data["data"]["gateway_order_id"]
    payload = {"gateway_order_id": gateway_order_id, "gateway_payment_id": "pay_test_123", "signature": ""}

    first = auth_client.post(reverse("payments-verify"), payload)
    second = auth_client.post(reverse("payments-verify"), payload)

    assert first.status_code == 200
    assert second.status_code == 200
    assert Order.objects.filter(gateway_order_id=gateway_order_id).count() == 1

    wallet = Wallet.objects.get(student__email="student@test.com")
    assert wallet.balance == 100


def test_paid_mock_test_unlocks_after_recharge(auth_client, paid_test, plan):
    order_response = auth_client.post(reverse("payments-recharge"), {"plan_id": str(plan.id)})
    gateway_order_id = order_response.data["data"]["gateway_order_id"]
    auth_client.post(
        reverse("payments-verify"),
        {"gateway_order_id": gateway_order_id, "gateway_payment_id": "pay_test_123", "signature": ""},
    )

    start_response = auth_client.post(reverse("tests-start", kwargs={"pk": paid_test.id}))
    assert start_response.status_code == 200

    wallet = Wallet.objects.get(student__email="student@test.com")
    assert wallet.balance == 50  # 100 recharged - 50 credit_cost


def test_my_orders_only_shows_own_orders(auth_client, api_client, student_user):
    from apps.users.models import User

    other_student = User.objects.create_user(email="other@test.com", password="x", role=User.Role.STUDENT)
    Order.objects.create(student=other_student, amount=10, credits_purchased=100)
    Order.objects.create(student=student_user, amount=10, credits_purchased=100)

    response = auth_client.get(reverse("payments-my-orders"))
    assert response.status_code == 200
    assert len(response.data["data"]) == 1


def test_wallet_view_returns_current_balance(auth_client):
    response = auth_client.get(reverse("payments-wallet"))
    assert response.status_code == 200
    assert response.data["data"]["balance"] == 0


def test_admin_can_adjust_student_credit_balance(admin_client, student_user):
    response = admin_client.post(
        reverse("admin-payments-adjust-credit"),
        {"student_id": str(student_user.id), "type": "CREDIT", "amount": 20, "note": "goodwill credit"},
    )
    assert response.status_code == 200
    assert response.data["data"]["balance"] == 20

    wallet = Wallet.objects.get(student=student_user)
    assert CreditTransaction.objects.filter(wallet=wallet, source=CreditTransaction.Source.ADMIN_ADJUSTMENT).exists()


def test_admin_cannot_debit_more_than_balance(admin_client, student_user):
    response = admin_client.post(
        reverse("admin-payments-adjust-credit"),
        {"student_id": str(student_user.id), "type": "DEBIT", "amount": 20},
    )
    assert response.status_code == 400


def test_admin_can_update_platform_settings(admin_client):
    response = admin_client.patch(
        reverse("admin-payments-settings"),
        {"free_practice_attempts_per_month": 5, "free_practice_max_questions": 25},
        content_type="application/json",
    )
    assert response.status_code == 200
    assert response.data["data"]["free_practice_attempts_per_month"] == 5

    settings = PlatformSettings.get_solo()
    assert settings.free_practice_attempts_per_month == 5


def test_admin_can_create_recharge_plan(admin_client):
    response = admin_client.post(
        "/api/v1/admin/payments/plans/", {"amount": "10", "credits": 12, "status": True}, format="json"
    )
    assert response.status_code == 201, response.data
    assert RechargePlan.objects.filter(amount=10, credits=12, status=True).exists()


def test_admin_can_deactivate_recharge_plan(admin_client, plan):
    response = admin_client.patch(f"/api/v1/admin/payments/plans/{plan.id}/", {"status": False}, format="json")
    assert response.status_code == 200, response.data
    plan.refresh_from_db()
    assert plan.status is False


def test_admin_can_list_all_plans_including_inactive(admin_client, plan, inactive_plan):
    response = admin_client.get("/api/v1/admin/payments/plans/")
    assert response.status_code == 200
    ids = [p["id"] for p in response.data["results"]] if "results" in response.data else [
        p["id"] for p in response.data
    ]
    assert str(plan.id) in ids
    assert str(inactive_plan.id) in ids


def test_student_cannot_manage_recharge_plans(auth_client):
    response = auth_client.post("/api/v1/admin/payments/plans/", {"amount": "10", "credits": 12}, format="json")
    assert response.status_code == 403
