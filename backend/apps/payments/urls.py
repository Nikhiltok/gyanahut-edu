from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminCreditAdjustmentView,
    AdminOrderViewSet,
    AdminRechargePlanViewSet,
    MyOrdersView,
    PlatformSettingsView,
    PracticeQuotaView,
    RazorpayWebhookView,
    RechargePlanListView,
    RechargeView,
    TransactionsView,
    VerifyPaymentView,
    WalletView,
)

admin_router = DefaultRouter()
admin_router.register("orders", AdminOrderViewSet, basename="admin-order")
admin_router.register("payments/plans", AdminRechargePlanViewSet, basename="admin-recharge-plan")

urlpatterns = [
    path("payments/plans/", RechargePlanListView.as_view(), name="payments-plans"),
    path("payments/recharge/", RechargeView.as_view(), name="payments-recharge"),
    path("payments/verify/", VerifyPaymentView.as_view(), name="payments-verify"),
    path("payments/webhook/", RazorpayWebhookView.as_view(), name="payments-webhook"),
    path("payments/my-orders/", MyOrdersView.as_view(), name="payments-my-orders"),
    path("payments/wallet/", WalletView.as_view(), name="payments-wallet"),
    path("payments/transactions/", TransactionsView.as_view(), name="payments-transactions"),
    path("payments/practice-quota/", PracticeQuotaView.as_view(), name="payments-practice-quota"),
]

admin_urlpatterns = admin_router.urls + [
    path("payments/settings/", PlatformSettingsView.as_view(), name="admin-payments-settings"),
    path("payments/adjust-credit/", AdminCreditAdjustmentView.as_view(), name="admin-payments-adjust-credit"),
]
