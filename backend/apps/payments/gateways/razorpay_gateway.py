import uuid

import razorpay
from django.conf import settings

from .base import PaymentGateway


class RazorpayGateway(PaymentGateway):
    """Wraps the Razorpay SDK. Falls back to a local test-mode order id when no
    RAZORPAY_KEY_ID is configured, so local/dev environments work without live keys.
    """

    def __init__(self):
        if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
            self.client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        else:
            self.client = None

    def create_order(self, amount, currency, receipt):
        if not self.client:
            return {
                "id": f"order_test_{uuid.uuid4().hex[:16]}",
                "amount": int(amount * 100),
                "currency": currency,
            }
        return self.client.order.create(
            {"amount": int(amount * 100), "currency": currency, "receipt": receipt}
        )

    def verify_payment(self, gateway_order_id, gateway_payment_id, signature):
        if not self.client:
            # Dev/test mode: accept any payment_id paired with a test-mode order.
            return gateway_order_id.startswith("order_test_") and bool(gateway_payment_id)
        try:
            self.client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": gateway_order_id,
                    "razorpay_payment_id": gateway_payment_id,
                    "razorpay_signature": signature,
                }
            )
            return True
        except razorpay.errors.SignatureVerificationError:
            return False

    def verify_webhook_signature(self, payload, signature):
        if not self.client:
            return True
        try:
            self.client.utility.verify_webhook_signature(payload, signature, settings.RAZORPAY_WEBHOOK_SECRET)
            return True
        except razorpay.errors.SignatureVerificationError:
            return False
