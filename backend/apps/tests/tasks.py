from celery import shared_task
from django.utils import timezone

from .models import Test


@shared_task
def activate_scheduled_tests():
    """Runs periodically (Celery beat) — flips SCHEDULED tests to LIVE once
    their start_time arrives, and LIVE tests to COMPLETED once end_time passes.
    """
    now = timezone.now()
    Test.objects.filter(status=Test.Status.SCHEDULED, start_time__lte=now).update(status=Test.Status.LIVE)
    Test.objects.filter(status=Test.Status.LIVE, end_time__isnull=False, end_time__lte=now).update(
        status=Test.Status.COMPLETED
    )
