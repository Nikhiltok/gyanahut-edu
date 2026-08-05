from django.contrib import admin

from .models import CreditTransaction, Order, PlatformSettings, RechargePlan, Wallet


@admin.register(RechargePlan)
class RechargePlanAdmin(admin.ModelAdmin):
    list_display = ("amount", "credits", "status")
    list_filter = ("status",)
    ordering = ("amount",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("student", "plan", "amount", "credits_purchased", "currency", "status", "purchased_at")
    list_filter = ("status", "payment_gateway")
    search_fields = ("student__email", "gateway_order_id", "gateway_payment_id")


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("student", "balance")
    search_fields = ("student__email",)


@admin.register(CreditTransaction)
class CreditTransactionAdmin(admin.ModelAdmin):
    list_display = ("wallet", "type", "source", "amount", "balance_after", "created_at")
    list_filter = ("type", "source")
    search_fields = ("wallet__student__email",)


@admin.register(PlatformSettings)
class PlatformSettingsAdmin(admin.ModelAdmin):
    list_display = ("free_practice_attempts_per_month", "free_practice_max_questions")

    def has_add_permission(self, request):
        # Singleton — only allow creating the first row.
        return not PlatformSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
