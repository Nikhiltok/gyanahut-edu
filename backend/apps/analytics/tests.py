from datetime import timedelta

import pytest
from django.urls import reverse
from django.utils import timezone

from apps.attempts.models import TestAttempt
from apps.tests.models import Test

pytestmark = pytest.mark.django_db


def _submit_attempt_on(student, test, days_ago):
    TestAttempt.objects.create(
        student=student,
        test=test,
        submitted_at=timezone.now() - timedelta(days=days_ago),
    )


@pytest.fixture
def live_test(question, admin_user):
    return Test.objects.create(
        exam=question.topic.chapter.subject.exam,
        title="Streak Test",
        test_type=Test.TestType.PRACTICE,
        duration=30,
        max_attempts=10,
        status=Test.Status.LIVE,
        created_by=admin_user,
    )


def test_dashboard_returns_zero_streak_with_no_attempts(auth_client):
    response = auth_client.get(reverse("analytics-dashboard"))
    assert response.status_code == 200
    assert response.data["data"]["day_streak"] == 0


def test_dashboard_computes_consecutive_day_streak(auth_client, student_user, live_test):
    _submit_attempt_on(student_user, live_test, days_ago=0)
    _submit_attempt_on(student_user, live_test, days_ago=1)
    _submit_attempt_on(student_user, live_test, days_ago=2)

    response = auth_client.get(reverse("analytics-dashboard"))
    assert response.status_code == 200
    assert response.data["data"]["day_streak"] == 3


def test_dashboard_streak_breaks_on_gap(auth_client, student_user, live_test):
    _submit_attempt_on(student_user, live_test, days_ago=0)
    _submit_attempt_on(student_user, live_test, days_ago=3)

    response = auth_client.get(reverse("analytics-dashboard"))
    assert response.status_code == 200
    assert response.data["data"]["day_streak"] == 1


def test_dashboard_streak_counts_from_yesterday_when_no_attempt_today(auth_client, student_user, live_test):
    _submit_attempt_on(student_user, live_test, days_ago=1)
    _submit_attempt_on(student_user, live_test, days_ago=2)

    response = auth_client.get(reverse("analytics-dashboard"))
    assert response.status_code == 200
    assert response.data["data"]["day_streak"] == 2


def test_dashboard_in_progress_attempt_is_null_with_no_unsubmitted_attempts(auth_client, student_user, live_test):
    _submit_attempt_on(student_user, live_test, days_ago=0)

    response = auth_client.get(reverse("analytics-dashboard"))
    assert response.status_code == 200
    assert response.data["data"]["in_progress_attempt"] is None


def test_dashboard_in_progress_attempt_surfaces_unsubmitted_attempt(auth_client, student_user, live_test):
    live_test.total_questions = 10
    live_test.save(update_fields=["total_questions"])
    attempt = TestAttempt.objects.create(student=student_user, test=live_test, current_question_index=4)

    response = auth_client.get(reverse("analytics-dashboard"))
    assert response.status_code == 200
    data = response.data["data"]["in_progress_attempt"]
    assert data is not None
    assert data["attempt_id"] == str(attempt.id)
    assert data["test_title"] == live_test.title
    assert data["exam_name"] == live_test.exam.name
    assert data["current_question_index"] == 4
    assert data["total_questions"] == 10
