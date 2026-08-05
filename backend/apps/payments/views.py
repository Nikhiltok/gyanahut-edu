import json

from django.db import transaction
from django.utils import timezone
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from apps.core.permissions import IsAdminOrSuperAdmin
from apps.core.responses import error_response, success_response
from apps.core.viewsets import AdminModelViewSet
from apps.users.models import User

from .gateways import get_gateway
from .models import CreditTransaction, Order, PlatformSettings, RechargePlan, Wallet
from .serializers import (
    AdminCreditAdjustmentSerializer,
    AdminOrderSerializer,
    CreditTransactionSerializer,
    OrderSerializer,
    PlatformSettingsSerializer,
    RechargePlanSerializer,
    RechargeSerializer,
    VerifyPaymentSerializer,
    WalletSerializer,
)


def _credit_wallet_for_order(order):
    """Credits order.credits_purchased into the student's wallet and writes a
    RECHARGE ledger row. Only call this when an order is transitioning into
    PAID for the first time — callers (VerifyPaymentView, RazorpayWebhookView)
    both guard on the prior status so a replay never double-credits."""
    Wallet.objects.get_or_create(student=order.student)
    with transaction.atomic():
        wallet = Wallet.objects.select_for_update().get(student=order.student)
        wallet.balance += order.credits_purchased
        wallet.save(update_fields=["balance"])
        CreditTransaction.objects.create(
            wallet=wallet,
            type=CreditTransaction.Type.CREDIT,
            source=CreditTransaction.Source.RECHARGE,
            amount=order.credits_purchased,
            order=order,
            balance_after=wallet.balance,
        )


class RechargePlanListView(APIView):
    """Active recharge plans a student can pick from. Inactive plans are
    excluded — they're kept in the DB only so past Orders that reference them
    keep resolving, not so students can still buy them."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        plans = RechargePlan.objects.filter(status=True).order_by("amount")
        return success_response(RechargePlanSerializer(plans, many=True).data)


class AdminRechargePlanViewSet(AdminModelViewSet, ModelViewSet):
    queryset = RechargePlan.objects.all().order_by("amount")
    serializer_class = RechargePlanSerializer


class RechargeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RechargeSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)

        try:
            plan = RechargePlan.objects.get(id=serializer.validated_data["plan_id"], status=True)
        except RechargePlan.DoesNotExist:
            return error_response("This recharge plan is not available", status=404)

        order = Order.objects.create(
            student=request.user,
            plan=plan,
            amount=plan.amount,
            credits_purchased=plan.credits,
            payment_gateway="razorpay",
        )

        gateway = get_gateway()
        gateway_order = gateway.create_order(float(plan.amount), order.currency, receipt=str(order.id))
        order.gateway_order_id = gateway_order["id"]
        order.save(update_fields=["gateway_order_id"])

        return success_response(
            {
                "order_id": str(order.id),
                "gateway_order_id": gateway_order["id"],
                "amount": float(plan.amount),
                "credits": plan.credits,
                "currency": order.currency,
                "key": "" if gateway.client is None else gateway.client.auth[0],
            },
            "Order created",
            status=201,
        )


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)

        data = serializer.validated_data
        try:
            order = Order.objects.get(student=request.user, gateway_order_id=data["gateway_order_id"])
        except Order.DoesNotExist:
            return error_response("Order not found", status=404)

        if order.status == Order.Status.PAID:
            return success_response(OrderSerializer(order).data, "Payment already verified")

        gateway = get_gateway()
        is_valid = gateway.verify_payment(
            data["gateway_order_id"], data["gateway_payment_id"], data.get("signature", "")
        )
        if not is_valid:
            order.status = Order.Status.FAILED
            order.save(update_fields=["status"])
            return error_response("Payment verification failed", status=400)

        order.status = Order.Status.PAID
        order.gateway_payment_id = data["gateway_payment_id"]
        order.purchased_at = timezone.now()
        order.save(update_fields=["status", "gateway_payment_id", "purchased_at"])
        _credit_wallet_for_order(order)

        return success_response(OrderSerializer(order).data, "Payment verified")


class RazorpayWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        signature = request.headers.get("X-Razorpay-Signature", "")
        gateway = get_gateway()
        if not gateway.verify_webhook_signature(request.body.decode("utf-8"), signature):
            return error_response("Invalid webhook signature", status=400)

        payload = json.loads(request.body.decode("utf-8"))
        try:
            entity = payload["payload"]["payment"]["entity"]
            gateway_order_id = entity["order_id"]
            gateway_payment_id = entity["id"]
        except (KeyError, TypeError):
            return error_response("Malformed webhook payload", status=400)

        order = Order.objects.filter(gateway_order_id=gateway_order_id).first()
        if not order:
            return success_response(message="No matching order — ignored")

        if order.status != Order.Status.PAID:
            order.status = Order.Status.PAID
            order.gateway_payment_id = gateway_payment_id
            order.purchased_at = timezone.now()
            order.save(update_fields=["status", "gateway_payment_id", "purchased_at"])
            _credit_wallet_for_order(order)

        return success_response(message="Webhook processed")


class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(student=request.user).order_by("-created_at")
        return success_response(OrderSerializer(orders, many=True).data)


class WalletView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet, _ = Wallet.objects.get_or_create(student=request.user)
        return success_response(WalletSerializer(wallet).data)


class PracticeQuotaView(APIView):
    """Lets the self-practice generation form show 'Free (N/month remaining)'
    vs 'Costs X credits' before the student submits, without guessing at
    PlatformSettings values client-side."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        platform_settings = PlatformSettings.get_solo()
        now = timezone.now()
        used = CreditTransaction.objects.filter(
            wallet__student=request.user,
            source=CreditTransaction.Source.FREE_PRACTICE,
            created_at__year=now.year,
            created_at__month=now.month,
        ).count()
        return success_response(
            {
                "free_attempts_per_month": platform_settings.free_practice_attempts_per_month,
                "free_used_this_month": used,
                "free_remaining_this_month": max(0, platform_settings.free_practice_attempts_per_month - used),
                "free_max_questions": platform_settings.free_practice_max_questions,
            }
        )


class TransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet, _ = Wallet.objects.get_or_create(student=request.user)
        transactions = wallet.transactions.select_related("test", "order").all()
        return success_response(CreditTransactionSerializer(transactions, many=True).data)


class AdminOrderViewSet(ReadOnlyModelViewSet):
    permission_classes = [IsAdminOrSuperAdmin]
    queryset = Order.objects.all().select_related("student").order_by("-created_at")
    serializer_class = AdminOrderSerializer
    filter_backends = [SearchFilter]
    search_fields = ["student__email", "student__first_name", "student__last_name"]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param.upper())
        return queryset


class PlatformSettingsView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def get(self, request):
        return success_response(PlatformSettingsSerializer(PlatformSettings.get_solo()).data)

    def patch(self, request):
        instance = PlatformSettings.get_solo()
        serializer = PlatformSettingsSerializer(instance, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)
        serializer.save()
        return success_response(serializer.data, "Settings updated")


class AdminCreditAdjustmentView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def post(self, request):
        serializer = AdminCreditAdjustmentSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)

        data = serializer.validated_data
        try:
            student = User.objects.get(id=data["student_id"], role=User.Role.STUDENT)
        except User.DoesNotExist:
            return error_response("Student not found", status=404)

        Wallet.objects.get_or_create(student=student)
        with transaction.atomic():
            wallet = Wallet.objects.select_for_update().get(student=student)
            if data["type"] == CreditTransaction.Type.DEBIT:
                if wallet.balance < data["amount"]:
                    return error_response(
                        "Cannot debit more than the student's current balance",
                        {"balance": wallet.balance},
                        status=400,
                    )
                wallet.balance -= data["amount"]
            else:
                wallet.balance += data["amount"]
            wallet.save(update_fields=["balance"])
            CreditTransaction.objects.create(
                wallet=wallet,
                type=data["type"],
                source=CreditTransaction.Source.ADMIN_ADJUSTMENT,
                amount=data["amount"],
                balance_after=wallet.balance,
                note=data["note"],
            )

        return success_response(WalletSerializer(wallet).data, "Wallet adjusted")
