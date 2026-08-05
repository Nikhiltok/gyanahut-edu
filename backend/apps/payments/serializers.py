from rest_framework import serializers

from .models import CreditTransaction, Order, PlatformSettings, RechargePlan, Wallet


class RechargePlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = RechargePlan
        fields = ("id", "amount", "credits", "status")


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            "id", "plan", "amount", "credits_purchased", "currency", "payment_gateway",
            "gateway_order_id", "status", "purchased_at", "created_at",
        )
        read_only_fields = fields


class AdminOrderSerializer(OrderSerializer):
    student_name = serializers.CharField(source="student.get_full_name", read_only=True)
    student_email = serializers.CharField(source="student.email", read_only=True)

    class Meta(OrderSerializer.Meta):
        fields = OrderSerializer.Meta.fields + ("student", "student_name", "student_email")
        read_only_fields = fields


class RechargeSerializer(serializers.Serializer):
    plan_id = serializers.UUIDField()


class VerifyPaymentSerializer(serializers.Serializer):
    gateway_order_id = serializers.CharField()
    gateway_payment_id = serializers.CharField()
    signature = serializers.CharField(required=False, allow_blank=True)


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ("balance",)
        read_only_fields = fields


class CreditTransactionSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source="test.title", read_only=True, default=None)

    class Meta:
        model = CreditTransaction
        fields = (
            "id", "type", "source", "amount", "order", "test", "test_title",
            "balance_after", "note", "created_at",
        )
        read_only_fields = fields


class PlatformSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSettings
        fields = ("free_practice_attempts_per_month", "free_practice_max_questions")


class AdminCreditAdjustmentSerializer(serializers.Serializer):
    student_id = serializers.UUIDField()
    type = serializers.ChoiceField(choices=CreditTransaction.Type.choices)
    amount = serializers.IntegerField(min_value=1)
    note = serializers.CharField(required=False, allow_blank=True, default="")
