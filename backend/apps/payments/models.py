from django.conf import settings
from django.db import models

from apps.core.models import BaseModel
from apps.tests.models import Test


class PlatformSettings(BaseModel):
    """Singleton row holding platform-wide credit/payment configuration —
    edited from the admin Payment Settings screen instead of being hardcoded,
    so the free-practice quota can change without a deploy. The ₹→credit
    conversion itself is no longer a flat rate here — see RechargePlan."""

    free_practice_attempts_per_month = models.PositiveIntegerField(default=3)
    free_practice_max_questions = models.PositiveIntegerField(default=15)

    class Meta:
        db_table = "platform_settings"
        verbose_name_plural = "Platform Settings"

    def __str__(self):
        return "Platform Settings"

    @classmethod
    def get_solo(cls):
        obj = cls.objects.first()
        if obj is None:
            obj = cls.objects.create()
        return obj


class RechargePlan(BaseModel):
    """Admin-defined recharge option, e.g. ₹10 → 12 credits, ₹50 → 55 credits.
    Each plan sets its own amount/credits pair independently — no fixed
    platform-wide conversion rate — so admin can bonus larger packs more
    generously than smaller ones. Students can only recharge by picking one
    of these (see RechargeView), not by typing an arbitrary ₹ amount."""

    amount = models.DecimalField(max_digits=8, decimal_places=2)
    credits = models.PositiveIntegerField()
    status = models.BooleanField(default=True, help_text="Inactive plans are hidden from students but kept for history")

    class Meta:
        db_table = "recharge_plan"
        ordering = ["amount"]

    def __str__(self):
        return f"₹{self.amount} → {self.credits} credits"


class Order(BaseModel):
    """A wallet recharge — not tied to any specific Test. Paying for it credits
    the student's Wallet; what that wallet is later spent on is tracked
    separately via CreditTransaction."""

    class Status(models.TextChoices):
        CREATED = "CREATED", "Created"
        PAID = "PAID", "Paid"
        FAILED = "FAILED", "Failed"
        REFUNDED = "REFUNDED", "Refunded"

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    plan = models.ForeignKey(RechargePlan, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders")
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    credits_purchased = models.PositiveIntegerField(
        default=0, help_text="Snapshotted from RechargePlan.credits at order-creation time"
    )
    currency = models.CharField(max_length=10, default="INR")
    payment_gateway = models.CharField(max_length=30, default="razorpay")
    gateway_order_id = models.CharField(max_length=100, blank=True, default="")
    gateway_payment_id = models.CharField(max_length=100, blank=True, default="")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CREATED, db_index=True)
    purchased_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "payment_order"

    def __str__(self):
        return f"{self.student_id} - ₹{self.amount} ({self.status})"


class Wallet(BaseModel):
    student = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wallet")
    balance = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "wallet"

    def __str__(self):
        return f"{self.student_id} - {self.balance} credits"


class CreditTransaction(BaseModel):
    """Append-only ledger — the auditable source of truth behind Wallet.balance.
    Every credit/debit, whatever its reason, gets a row here."""

    class Type(models.TextChoices):
        CREDIT = "CREDIT", "Credit"
        DEBIT = "DEBIT", "Debit"

    class Source(models.TextChoices):
        RECHARGE = "RECHARGE", "Recharge"
        TEST_ATTEMPT = "TEST_ATTEMPT", "Test Attempt"
        SELF_PRACTICE = "SELF_PRACTICE", "Self Practice"
        FREE_PRACTICE = "FREE_PRACTICE", "Free Practice"
        REFUND = "REFUND", "Refund"
        ADMIN_ADJUSTMENT = "ADMIN_ADJUSTMENT", "Admin Adjustment"

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transactions")
    type = models.CharField(max_length=10, choices=Type.choices)
    source = models.CharField(max_length=20, choices=Source.choices)
    amount = models.PositiveIntegerField(default=0)
    order = models.ForeignKey(
        Order, on_delete=models.SET_NULL, null=True, blank=True, related_name="credit_transactions"
    )
    test = models.ForeignKey(
        Test, on_delete=models.SET_NULL, null=True, blank=True, related_name="credit_transactions"
    )
    test_attempt = models.ForeignKey(
        "attempts.TestAttempt",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="credit_transactions",
    )
    balance_after = models.PositiveIntegerField(default=0)
    note = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        db_table = "credit_transaction"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.wallet.student_id} {self.type} {self.amount} ({self.source})"
