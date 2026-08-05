import random

from django.core.cache import cache

OTP_TTL_SECONDS = 600  # 10 minutes


def _cache_key(prefix, identifier):
    return f"otp:{prefix}:{identifier}"


def generate_and_store_otp(prefix, identifier):
    code = f"{random.randint(0, 999999):06d}"
    cache.set(_cache_key(prefix, identifier), code, timeout=OTP_TTL_SECONDS)
    return code


def verify_otp(prefix, identifier, code):
    cached = cache.get(_cache_key(prefix, identifier))
    if cached is None or cached != code:
        return False
    cache.delete(_cache_key(prefix, identifier))
    return True
