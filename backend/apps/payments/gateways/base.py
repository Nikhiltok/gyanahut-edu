class PaymentGateway:
    """Adapter interface so Test/Order/business logic never touches a specific
    gateway's SDK directly — swap Razorpay for Cashfree/Stripe by adding a new
    adapter here, no changes needed elsewhere.
    """

    def create_order(self, amount, currency, receipt):
        raise NotImplementedError

    def verify_payment(self, gateway_order_id, gateway_payment_id, signature):
        raise NotImplementedError

    def verify_webhook_signature(self, payload, signature):
        raise NotImplementedError
