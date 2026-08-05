import logging

from django.conf import settings

logger = logging.getLogger(__name__)


def send_otp_sms(phone, code):
    """Sends an OTP SMS. Falls back to logging the code when no SMS gateway is
    configured, so local/dev environments work without a live SMS account —
    same convention as the Razorpay gateway's dev/test-mode fallback.
    """
    if not settings.SMS_API_KEY:
        logger.info("[DEV MODE] OTP for %s: %s", phone, code)
        return

    import requests

    requests.post(
        settings.SMS_API_URL,
        json={"to": phone, "message": f"Your Gyanahut Edu OTP is {code}. Valid for 10 minutes."},
        headers={"Authorization": f"Bearer {settings.SMS_API_KEY}"},
        timeout=10,
    )
