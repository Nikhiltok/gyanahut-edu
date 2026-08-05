from datetime import timedelta

import pytest
from django.urls import reverse
from django.utils import timezone

from apps.attempts.models import StudentAnswer, TestAttempt
from apps.exams.models import Chapter, Subject
from apps.tests.models import Test, TestQuestion

pytestmark = pytest.mark.django_db


@pytest.fixture
def live_test(question, admin_user, max_attempts=1):
    test = Test.objects.create(
        exam=question.topic.chapter.subject.exam,
        title="Practice Test",
        test_type=Test.TestType.PRACTICE,
        duration=30,
        max_attempts=max_attempts,
        negative_marking=True,
        negative_marks=0.5,
        status=Test.Status.LIVE,
        created_by=admin_user,
    )
    TestQuestion.objects.create(test=test, question=question, order=0)
    return test


def start_and_submit(auth_client, test, question, option_id):
    start = auth_client.post(reverse("tests-start", kwargs={"pk": test.id}))
    assert start.status_code == 200
    attempt_id = start.data["data"]["attempt_id"]

    submit = auth_client.post(
        reverse("tests-submit", kwargs={"pk": test.id}),
        {"attempt_id": attempt_id, "answers": [{"question": str(question.id), "option": option_id}]},
        format="json",
    )
    return submit


def test_generate_practice_test_creates_live_test_with_questions(auth_client, student_user, question):
    response = auth_client.post(
        reverse("tests-practice-generate"),
        {"exam": str(question.topic.chapter.subject.exam_id), "topic": str(question.topic_id), "question_count": 5, "duration": 20},
        format="json",
    )
    assert response.status_code == 201
    data = response.data["data"]
    assert data["status"] == "LIVE"
    assert data["test_type"] == "PRACTICE"
    # Only one question exists in this scope (the `question` fixture) even
    # though 5 were requested — generation truncates to what's available.
    assert data["question_count"] == 1

    test = Test.objects.get(id=data["id"])
    assert test.created_by_id == student_user.id
    assert test.duration == 20


def test_generate_practice_test_errors_when_scope_has_no_questions(auth_client, topic):
    # Use the topic's own exam but a scope with zero questions: a fresh
    # subject/chapter under the same exam that has no questions attached.
    empty_subject = Subject.objects.create(exam=topic.chapter.subject.exam, name="Empty Subject")
    empty_chapter = Chapter.objects.create(subject=empty_subject, name="Empty Chapter")
    response = auth_client.post(
        reverse("tests-practice-generate"),
        {"exam": str(topic.chapter.subject.exam_id), "chapter": str(empty_chapter.id), "question_count": 5, "duration": 20},
        format="json",
    )
    assert response.status_code == 400


def test_self_generated_practice_test_excluded_from_live_listing(auth_client, question):
    generate = auth_client.post(
        reverse("tests-practice-generate"),
        {"exam": str(question.topic.chapter.subject.exam_id), "topic": str(question.topic_id), "question_count": 5, "duration": 20},
        format="json",
    )
    assert generate.status_code == 201

    live = auth_client.get(reverse("tests-live"))
    assert generate.data["data"]["id"] not in [t["id"] for t in live.data["data"]]


def test_self_practice_free_quota_then_requires_credits(auth_client, topic, admin_user, student_user):
    from apps.payments.models import Wallet

    make_questions(topic, admin_user, 20)
    payload = {
        "exam": str(topic.chapter.subject.exam_id),
        "topic": str(topic.id),
        "question_count": 5,
        "duration": 20,
    }

    # PlatformSettings default: 3 free attempts/month, max 15 questions/attempt.
    for _ in range(3):
        response = auth_client.post(reverse("tests-practice-generate"), payload, format="json")
        assert response.status_code == 201, response.data

    assert not Wallet.objects.filter(student=student_user, balance__gt=0).exists()

    # Quota exhausted and the student has 0 credits -> blocked.
    blocked = auth_client.post(reverse("tests-practice-generate"), payload, format="json")
    assert blocked.status_code == 402
    assert blocked.data["errors"]["code"] == "insufficient_credits"
    assert blocked.data["errors"]["required"] == 5


def test_self_practice_over_free_question_cap_always_charges(auth_client, topic, admin_user):
    make_questions(topic, admin_user, 20)
    payload = {
        "exam": str(topic.chapter.subject.exam_id),
        "topic": str(topic.id),
        "question_count": 16,  # over the default free_practice_max_questions=15
        "duration": 20,
    }

    # Quota is completely fresh (0 used this month) but the question count
    # exceeds the free cap, so this is treated as paid, not free.
    response = auth_client.post(reverse("tests-practice-generate"), payload, format="json")
    assert response.status_code == 402
    assert response.data["errors"]["code"] == "insufficient_credits"
    assert response.data["errors"]["required"] == 16


def test_self_practice_spends_credits_once_quota_exhausted(auth_client, topic, admin_user, student_user):
    from apps.payments.models import CreditTransaction, Wallet

    make_questions(topic, admin_user, 20)
    Wallet.objects.create(student=student_user, balance=10)
    payload = {
        "exam": str(topic.chapter.subject.exam_id),
        "topic": str(topic.id),
        "question_count": 5,
        "duration": 20,
    }
    for _ in range(3):
        assert auth_client.post(reverse("tests-practice-generate"), payload, format="json").status_code == 201

    response = auth_client.post(reverse("tests-practice-generate"), payload, format="json")
    assert response.status_code == 201

    wallet = Wallet.objects.get(student=student_user)
    assert wallet.balance == 5  # 10 - 5
    assert CreditTransaction.objects.filter(
        wallet=wallet, source=CreditTransaction.Source.SELF_PRACTICE, amount=5
    ).exists()


def test_correct_answer_scores_full_marks(auth_client, live_test, question):
    correct_option = question.options.get(is_correct=True)
    response = start_and_submit(auth_client, live_test, question, str(correct_option.id))
    assert response.status_code == 200
    assert response.data["data"]["score"] == 2.0
    assert response.data["data"]["correct"] == 1
    assert response.data["data"]["wrong"] == 0


def test_wrong_answer_applies_negative_marking(auth_client, live_test, question):
    wrong_option = question.options.filter(is_correct=False).first()
    response = start_and_submit(auth_client, live_test, question, str(wrong_option.id))
    assert response.status_code == 200
    # marks=2, negative_marks=0.5 -> wrong answer should be -0.5, not clamped to 0.
    assert response.data["data"]["score"] == -0.5
    assert response.data["data"]["wrong"] == 1


def test_negative_marking_falls_back_to_test_level_when_question_unset(auth_client, live_test, question):
    # Question carries no explicit negative_marks override (0) -> the test's flat
    # rate (live_test.negative_marks=0.5) applies as the default penalty.
    question.negative_marks = 0
    question.save(update_fields=["negative_marks"])

    wrong_option = question.options.filter(is_correct=False).first()
    response = start_and_submit(auth_client, live_test, question, str(wrong_option.id))
    assert response.status_code == 200
    assert response.data["data"]["score"] == -0.5


def test_negative_marking_question_override_takes_precedence(auth_client, live_test, question):
    # Question explicitly sets its own negative_marks (0.3), different from the
    # test's flat rate (0.5) -> some competitive exams weight penalties per
    # question (e.g. mixed-scheme previous-year papers), so the override should win.
    question.negative_marks = 0.3
    question.save(update_fields=["negative_marks"])

    wrong_option = question.options.filter(is_correct=False).first()
    response = start_and_submit(auth_client, live_test, question, str(wrong_option.id))
    assert response.status_code == 200
    assert response.data["data"]["score"] == -0.3


def test_skipped_question_scores_zero_no_penalty(auth_client, live_test, question):
    response = start_and_submit(auth_client, live_test, question, None)
    assert response.status_code == 200
    assert response.data["data"]["score"] == 0
    assert response.data["data"]["skipped"] == 1


def test_starting_twice_without_submitting_resumes_same_attempt(auth_client, live_test):
    # An abandoned (never-submitted) attempt used to permanently burn a max_attempts
    # slot with no way back in. Now it's resumable — starting again returns the same
    # attempt_id instead of erroring or creating a second attempt.
    first = auth_client.post(reverse("tests-start", kwargs={"pk": live_test.id}))
    assert first.status_code == 200
    assert first.data["data"]["resumed"] is False

    second = auth_client.post(reverse("tests-start", kwargs={"pk": live_test.id}))
    assert second.status_code == 200
    assert second.data["data"]["resumed"] is True
    assert second.data["data"]["attempt_id"] == first.data["data"]["attempt_id"]
    assert TestAttempt.objects.filter(test=live_test).count() == 1


def test_resume_includes_autosaved_answer_and_position(auth_client, live_test, question):
    start = auth_client.post(reverse("tests-start", kwargs={"pk": live_test.id}))
    attempt_id = start.data["data"]["attempt_id"]
    correct_option = question.options.get(is_correct=True)

    progress = auth_client.post(
        reverse("tests-save-progress", kwargs={"pk": live_test.id, "attempt_id": attempt_id}),
        {"question": str(question.id), "option": str(correct_option.id), "current_question_index": 3},
        format="json",
    )
    assert progress.status_code == 200

    resume = auth_client.post(reverse("tests-start", kwargs={"pk": live_test.id}))
    assert resume.status_code == 200
    assert resume.data["data"]["resumed"] is True
    assert resume.data["data"]["current_question_index"] == 3
    assert resume.data["data"]["answers"][str(question.id)] == str(correct_option.id)


def test_submit_after_autosave_scores_correctly_with_no_crash(auth_client, live_test, question):
    start = auth_client.post(reverse("tests-start", kwargs={"pk": live_test.id}))
    attempt_id = start.data["data"]["attempt_id"]
    correct_option = question.options.get(is_correct=True)

    progress = auth_client.post(
        reverse("tests-save-progress", kwargs={"pk": live_test.id, "attempt_id": attempt_id}),
        {"question": str(question.id), "option": str(correct_option.id), "current_question_index": 0},
        format="json",
    )
    assert progress.status_code == 200
    assert StudentAnswer.objects.filter(attempt_id=attempt_id, question=question).count() == 1

    submit = auth_client.post(
        reverse("tests-submit", kwargs={"pk": live_test.id}),
        {"attempt_id": attempt_id, "answers": [{"question": str(question.id), "option": str(correct_option.id)}]},
        format="json",
    )
    assert submit.status_code == 200
    assert submit.data["data"]["score"] == 2.0
    assert submit.data["data"]["correct"] == 1
    # update_or_create must not have left a duplicate row alongside the autosaved one.
    assert StudentAnswer.objects.filter(attempt_id=attempt_id, question=question).count() == 1


def test_max_attempts_blocks_after_submitted_attempts_not_abandoned_ones(auth_client, question, admin_user):
    test = Test.objects.create(
        exam=question.topic.chapter.subject.exam,
        title="Two Attempt Test",
        test_type=Test.TestType.PRACTICE,
        duration=30,
        max_attempts=1,
        status=Test.Status.LIVE,
        created_by=admin_user,
    )
    TestQuestion.objects.create(test=test, question=question, order=0)
    correct_option = question.options.get(is_correct=True)

    submit = start_and_submit(auth_client, test, question, str(correct_option.id))
    assert submit.status_code == 200

    blocked = auth_client.post(reverse("tests-start", kwargs={"pk": test.id}))
    assert blocked.status_code == 400
    assert blocked.data["success"] is False


def test_expired_attempt_auto_finalizes_on_resume(auth_client, live_test, question):
    start = auth_client.post(reverse("tests-start", kwargs={"pk": live_test.id}))
    attempt_id = start.data["data"]["attempt_id"]
    correct_option = question.options.get(is_correct=True)

    auth_client.post(
        reverse("tests-save-progress", kwargs={"pk": live_test.id, "attempt_id": attempt_id}),
        {"question": str(question.id), "option": str(correct_option.id), "current_question_index": 0},
        format="json",
    )

    attempt = TestAttempt.objects.get(id=attempt_id)
    attempt.started_at = timezone.now() - timedelta(minutes=live_test.duration + 5)
    attempt.save(update_fields=["started_at"])

    resume = auth_client.post(reverse("tests-start", kwargs={"pk": live_test.id}))
    assert resume.status_code == 200
    assert resume.data["data"]["expired"] is True
    assert resume.data["data"]["score"] == 2.0

    attempt.refresh_from_db()
    assert attempt.submitted_at is not None


def test_progress_endpoint_rejects_after_submitted(auth_client, live_test, question):
    correct_option = question.options.get(is_correct=True)
    submit = start_and_submit(auth_client, live_test, question, str(correct_option.id))
    attempt_id = submit.data["data"]["attempt_id"]

    response = auth_client.post(
        reverse("tests-save-progress", kwargs={"pk": live_test.id, "attempt_id": attempt_id}),
        {"question": str(question.id), "option": str(correct_option.id), "current_question_index": 0},
        format="json",
    )
    assert response.status_code == 400


def test_cannot_start_draft_test(auth_client, live_test):
    live_test.status = Test.Status.DRAFT
    live_test.save(update_fields=["status"])

    response = auth_client.post(reverse("tests-start", kwargs={"pk": live_test.id}))
    assert response.status_code == 400


def test_paid_test_blocks_start_without_enough_credits(auth_client, live_test):
    live_test.is_paid = True
    live_test.credit_cost = 49
    live_test.save(update_fields=["is_paid", "credit_cost"])

    response = auth_client.post(reverse("tests-start", kwargs={"pk": live_test.id}))
    assert response.status_code == 402
    assert response.data["errors"]["code"] == "insufficient_credits"
    assert response.data["errors"]["shortfall"] == 49


def test_paid_test_unlocks_with_enough_wallet_balance(auth_client, live_test, student_user):
    from apps.payments.models import Wallet

    live_test.is_paid = True
    live_test.credit_cost = 49
    live_test.save(update_fields=["is_paid", "credit_cost"])
    Wallet.objects.create(student=student_user, balance=49)

    response = auth_client.post(reverse("tests-start", kwargs={"pk": live_test.id}))
    assert response.status_code == 200

    wallet = Wallet.objects.get(student=student_user)
    assert wallet.balance == 0


def test_double_submit_rejected(auth_client, live_test, question):
    correct_option = question.options.get(is_correct=True)
    first = start_and_submit(auth_client, live_test, question, str(correct_option.id))
    assert first.status_code == 200

    attempt = TestAttempt.objects.get(test=live_test)
    second = auth_client.post(
        reverse("tests-submit", kwargs={"pk": live_test.id}),
        {"attempt_id": str(attempt.id), "answers": []},
        format="json",
    )
    assert second.status_code == 400


def test_question_set_locked_after_an_attempt(auth_client, admin_client, live_test, question):
    correct_option = question.options.get(is_correct=True)
    submit = start_and_submit(auth_client, live_test, question, str(correct_option.id))
    assert submit.status_code == 200

    auto_attach = admin_client.post(f"/api/v1/admin/scheduler/{live_test.id}/auto-attach/")
    assert auto_attach.status_code == 400

    manual_attach = admin_client.post(
        f"/api/v1/admin/scheduler/{live_test.id}/questions/",
        {"question_ids": [str(question.id)]},
        format="json",
    )
    assert manual_attach.status_code == 400

    detail = admin_client.get(f"/api/v1/admin/scheduler/{live_test.id}/")
    assert detail.data["total_attempts_count"] == 1


def test_my_attempts_lists_submitted_attempts(auth_client, live_test, question):
    correct_option = question.options.get(is_correct=True)
    submit = start_and_submit(auth_client, live_test, question, str(correct_option.id))
    assert submit.status_code == 200

    response = auth_client.get(reverse("my-attempts"))
    assert response.status_code == 200
    assert len(response.data["data"]) == 1
    entry = response.data["data"][0]
    assert entry["test_title"] == live_test.title
    assert entry["exam_name"] == live_test.exam.name


def test_history_type_filter_splits_self_practice_from_admin_scheduled(auth_client, live_test, question):
    # live_test is admin-created (test_type=PRACTICE but created_by=admin_user) so it
    # falls in the "mock" (admin-scheduled) bucket, not "practice" — origin is decided
    # by who created it, not just the test_type value (see SELF_PRACTICE_FILTER).
    correct_option = question.options.get(is_correct=True)
    admin_scheduled_submit = start_and_submit(auth_client, live_test, question, str(correct_option.id))
    assert admin_scheduled_submit.status_code == 200

    generate = auth_client.post(
        reverse("tests-practice-generate"),
        {
            "exam": str(question.topic.chapter.subject.exam_id),
            "topic": str(question.topic_id),
            "question_count": 1,
            "duration": 20,
        },
        format="json",
    )
    assert generate.status_code == 201
    self_practice_test_id = generate.data["data"]["id"]
    self_practice_start = auth_client.post(reverse("tests-start", kwargs={"pk": self_practice_test_id}))
    attempt_id = self_practice_start.data["data"]["attempt_id"]
    auth_client.post(
        reverse("tests-submit", kwargs={"pk": self_practice_test_id}),
        {"attempt_id": attempt_id, "answers": [{"question": str(question.id), "option": str(correct_option.id)}]},
        format="json",
    )

    mock_only = auth_client.get(reverse("my-attempts"), {"type": "mock"})
    assert mock_only.status_code == 200
    assert len(mock_only.data["data"]) == 1
    assert mock_only.data["data"][0]["test_title"] == live_test.title

    practice_only = auth_client.get(reverse("my-attempts"), {"type": "practice"})
    assert practice_only.status_code == 200
    assert len(practice_only.data["data"]) == 1
    assert practice_only.data["data"][0]["test_title"] != live_test.title

    both = auth_client.get(reverse("my-attempts"))
    assert len(both.data["data"]) == 2


def test_result_detail_includes_per_question_answers(auth_client, live_test, question):
    correct_option = question.options.get(is_correct=True)
    submit = start_and_submit(auth_client, live_test, question, str(correct_option.id))
    attempt_id = submit.data["data"]["attempt_id"]

    response = auth_client.get(reverse("result-detail", kwargs={"attempt_id": attempt_id}))
    assert response.status_code == 200
    data = response.data["data"]
    assert data["exam_name"] == live_test.exam.name
    assert float(data["total_marks"]) == 2.0
    assert len(data["answers"]) == 1
    answer = data["answers"][0]
    assert answer["is_correct"] is True
    assert answer["selected_option_text"] == correct_option.option_text
    assert answer["correct_option_text"] == correct_option.option_text
    assert answer["question_type_display"] == question.get_question_type_display()


def test_result_detail_includes_ranking_and_time_comparison_context(auth_client, live_test, question, admin_user):
    from apps.leaderboard.models import Leaderboard
    from apps.users.models import User

    correct_option = question.options.get(is_correct=True)
    submit = start_and_submit(auth_client, live_test, question, str(correct_option.id))
    attempt_id = submit.data["data"]["attempt_id"]

    # Two other students ranked on this exam's leaderboard (submit's own async
    # leaderboard-recompute task isn't run synchronously in tests).
    other1 = User.objects.create_user(email="other1@test.com", password="TestPass123!", role=User.Role.STUDENT)
    other2 = User.objects.create_user(email="other2@test.com", password="TestPass123!", role=User.Role.STUDENT)
    Leaderboard.objects.create(student=other1, exam=live_test.exam, rank=1)
    Leaderboard.objects.create(student=other2, exam=live_test.exam, rank=2)

    # Another student's completed attempt on the exact same test, to seed a real average.
    other_attempt = TestAttempt.objects.create(
        student=other1, test=live_test, submitted_at=timezone.now(), time_taken=120
    )

    response = auth_client.get(reverse("result-detail", kwargs={"attempt_id": attempt_id}))
    assert response.status_code == 200
    data = response.data["data"]
    assert data["total_candidates"] == 2
    assert data["avg_time_taken"] == other_attempt.time_taken


def test_admin_can_schedule_test_scoped_to_chapter(admin_client, topic):
    chapter = topic.chapter
    response = admin_client.post(
        "/api/v1/admin/scheduler/",
        {
            "exam": str(chapter.subject.exam_id),
            "chapter": str(chapter.id),
            "title": "Chapter Test",
            "test_type": Test.TestType.MOCK,
            "duration": 20,
            "max_attempts": 1,
        },
        format="json",
    )
    assert response.status_code == 201, response.data
    assert response.data["chapter"] == chapter.id
    assert response.data["chapter_name"] == chapter.name


def test_admin_can_schedule_test_scoped_to_topic(admin_client, topic):
    response = admin_client.post(
        "/api/v1/admin/scheduler/",
        {
            "exam": str(topic.chapter.subject.exam_id),
            "topic": str(topic.id),
            "title": "Topic Test",
            "test_type": Test.TestType.MOCK,
            "duration": 20,
            "max_attempts": 1,
        },
        format="json",
    )
    assert response.status_code == 201, response.data
    assert response.data["topic"] == topic.id
    assert response.data["topic_name"] == topic.name


def test_topic_from_a_different_chapter_is_rejected(admin_client, topic):
    from apps.exams.models import Chapter

    other_chapter = Chapter.objects.create(subject=topic.chapter.subject, name="Other Chapter")

    response = admin_client.post(
        "/api/v1/admin/scheduler/",
        {
            "exam": str(topic.chapter.subject.exam_id),
            "chapter": str(other_chapter.id),
            "topic": str(topic.id),
            "title": "Mismatched Topic Test",
            "test_type": Test.TestType.MOCK,
            "duration": 20,
            "max_attempts": 1,
        },
        format="json",
    )
    assert response.status_code == 400
    assert "topic" in response.data


def test_admin_can_schedule_test_scoped_to_subject(admin_client, topic):
    subject = topic.chapter.subject
    response = admin_client.post(
        "/api/v1/admin/scheduler/",
        {
            "exam": str(subject.exam_id),
            "subject": str(subject.id),
            "title": "Subject Test",
            "test_type": Test.TestType.MOCK,
            "duration": 20,
            "max_attempts": 1,
        },
        format="json",
    )
    assert response.status_code == 201, response.data
    assert response.data["subject"] == subject.id


def test_chapter_from_a_different_exam_is_rejected(admin_client, topic):
    from apps.exams.models import Exam, ExamCategory

    other_category = ExamCategory.objects.create(name="Other Category")
    other_exam = Exam.objects.create(category=other_category, name="Other Exam", exam_type="SSC")

    response = admin_client.post(
        "/api/v1/admin/scheduler/",
        {
            "exam": str(other_exam.id),
            "chapter": str(topic.chapter.id),
            "title": "Mismatched Scope Test",
            "test_type": Test.TestType.MOCK,
            "duration": 20,
            "max_attempts": 1,
        },
        format="json",
    )
    assert response.status_code == 400
    assert "chapter" in response.data


def test_admin_scheduler_rejects_practice_test_type(admin_client, topic):
    # PRACTICE is reserved for student self-practice (GeneratePracticeTestView) —
    # the admin scheduler must not be able to create one, so the credit-pricing
    # split between the two test origins (Phase 7) stays unambiguous.
    response = admin_client.post(
        "/api/v1/admin/scheduler/",
        {
            "exam": str(topic.chapter.subject.exam_id),
            "topic": str(topic.id),
            "title": "Should Be Rejected",
            "test_type": Test.TestType.PRACTICE,
            "duration": 20,
            "max_attempts": 1,
        },
        format="json",
    )
    assert response.status_code == 400
    assert "test_type" in response.data


def test_paid_test_requires_credit_cost(admin_client, topic):
    response = admin_client.post(
        "/api/v1/admin/scheduler/",
        {
            "exam": str(topic.chapter.subject.exam_id),
            "topic": str(topic.id),
            "title": "Paid Test Missing Cost",
            "test_type": Test.TestType.MOCK,
            "duration": 20,
            "max_attempts": 1,
            "is_paid": True,
        },
        format="json",
    )
    assert response.status_code == 400
    assert "credit_cost" in response.data


def test_auto_attach_pulls_questions_by_chapter_scope(admin_client, topic, question):
    chapter = topic.chapter
    test = Test.objects.create(
        exam=chapter.subject.exam,
        chapter=chapter,
        title="Chapter Test",
        test_type=Test.TestType.PRACTICE,
        duration=20,
        max_attempts=1,
    )

    response = admin_client.post(f"/api/v1/admin/scheduler/{test.id}/auto-attach/")
    assert response.status_code == 200, response.data
    test.refresh_from_db()
    assert test.total_questions == 1
    assert TestQuestion.objects.filter(test=test, question=question).exists()

    # Running it again should not create duplicates.
    response = admin_client.post(f"/api/v1/admin/scheduler/{test.id}/auto-attach/")
    assert response.status_code == 200
    test.refresh_from_db()
    assert test.total_questions == 1


def test_auto_attach_pulls_questions_by_topic_scope(admin_client, topic, question):
    test = Test.objects.create(
        exam=topic.chapter.subject.exam,
        topic=topic,
        title="Topic Test",
        test_type=Test.TestType.PRACTICE,
        duration=20,
        max_attempts=1,
    )

    response = admin_client.post(f"/api/v1/admin/scheduler/{test.id}/auto-attach/")
    assert response.status_code == 200, response.data
    test.refresh_from_db()
    assert test.total_questions == 1
    assert TestQuestion.objects.filter(test=test, question=question).exists()


def make_questions(topic, admin_user, n, difficulty="MEDIUM"):
    from apps.questions.models import Question, QuestionOption

    created = []
    for i in range(n):
        q = Question.objects.create(
            topic=topic,
            question_text=f"Generated question {difficulty} #{i}",
            difficulty=difficulty,
            created_by=admin_user,
        )
        QuestionOption.objects.create(question=q, option_text="A", is_correct=True, order=0)
        QuestionOption.objects.create(question=q, option_text="B", is_correct=False, order=1)
        created.append(q)
    return created


def test_auto_attach_with_count_picks_unique_random_subset(admin_client, topic, admin_user, question):
    make_questions(topic, admin_user, 5)  # 5 more + the `question` fixture's 1 = 6 available

    test = Test.objects.create(
        exam=topic.chapter.subject.exam,
        topic=topic,
        title="Random Count Test",
        test_type=Test.TestType.PRACTICE,
        duration=20,
        max_attempts=1,
    )

    response = admin_client.post(f"/api/v1/admin/scheduler/{test.id}/auto-attach/", {"count": 3}, format="json")
    assert response.status_code == 200, response.data
    test.refresh_from_db()
    assert test.total_questions == 3

    attached_question_ids = list(TestQuestion.objects.filter(test=test).values_list("question_id", flat=True))
    assert len(attached_question_ids) == len(set(attached_question_ids))  # no duplicates

    # Requesting more again should top up with different questions, still no duplicates.
    response = admin_client.post(f"/api/v1/admin/scheduler/{test.id}/auto-attach/", {"count": 2}, format="json")
    assert response.status_code == 200, response.data
    test.refresh_from_db()
    assert test.total_questions == 5
    all_ids = list(TestQuestion.objects.filter(test=test).values_list("question_id", flat=True))
    assert len(all_ids) == len(set(all_ids))


def test_auto_attach_filters_by_difficulty(admin_client, topic, admin_user, question):
    make_questions(topic, admin_user, 3, difficulty="HARD")

    test = Test.objects.create(
        exam=topic.chapter.subject.exam,
        topic=topic,
        title="Hard Only Test",
        test_type=Test.TestType.PRACTICE,
        duration=20,
        max_attempts=1,
    )

    response = admin_client.post(
        f"/api/v1/admin/scheduler/{test.id}/auto-attach/", {"difficulty": "hard"}, format="json"
    )
    assert response.status_code == 200, response.data
    test.refresh_from_db()
    # Only the 3 HARD questions should be attached — not the MEDIUM `question` fixture.
    assert test.total_questions == 3
    for tq in TestQuestion.objects.filter(test=test).select_related("question"):
        assert tq.question.difficulty == "HARD"


def test_auto_attach_rejects_invalid_count(admin_client, topic, question):
    test = Test.objects.create(
        exam=topic.chapter.subject.exam,
        topic=topic,
        title="Invalid Count Test",
        test_type=Test.TestType.PRACTICE,
        duration=20,
        max_attempts=1,
    )
    response = admin_client.post(f"/api/v1/admin/scheduler/{test.id}/auto-attach/", {"count": 0}, format="json")
    assert response.status_code == 400
