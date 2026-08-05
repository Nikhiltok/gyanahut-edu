import io

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse

from apps.questions.bulk_import import run_bulk_import
from apps.questions.models import Question

pytestmark = pytest.mark.django_db


def _csv_file(rows_csv):
    return io.BytesIO(rows_csv.encode("utf-8"))


def test_bulk_import_uses_row_topic_when_present(topic, admin_user):
    csv_data = (
        "question_text,option_a,option_b,option_c,option_d,correct_option\n"
        f'"10 is what percent of 50?",10%,20%,30%,40%,B\n'
    )
    result = run_bulk_import(_csv_file(csv_data), "csv", admin_user, default_topic_id=None)
    assert result["success"] == 0  # no topic column and no default -> fails validation
    assert result["failed"] == 1


def test_bulk_import_falls_back_to_default_topic_id(topic, admin_user):
    csv_data = (
        "question_text,option_a,option_b,option_c,option_d,correct_option\n"
        '"10 is what percent of 50?",10%,20%,30%,40%,B\n'
    )
    result = run_bulk_import(_csv_file(csv_data), "csv", admin_user, default_topic_id=str(topic.id))
    assert result["success"] == 1
    assert result["failed"] == 0
    assert Question.objects.filter(topic=topic, question_text="10 is what percent of 50?").exists()


def test_bulk_import_row_topic_overrides_default(topic, admin_user):
    from apps.exams.models import Chapter, Subject, Topic as TopicModel

    other_subject = Subject.objects.create(exam=topic.chapter.subject.exam, name="Other Subject")
    other_chapter = Chapter.objects.create(subject=other_subject, name="Other Chapter")
    other_topic = TopicModel.objects.create(chapter=other_chapter, name="Other Topic")

    csv_data = (
        "topic,question_text,option_a,option_b,option_c,option_d,correct_option\n"
        f'{other_topic.id},"Row-specified topic question",10%,20%,30%,40%,B\n'
    )
    result = run_bulk_import(_csv_file(csv_data), "csv", admin_user, default_topic_id=str(topic.id))
    assert result["success"] == 1
    assert Question.objects.filter(topic=other_topic, question_text="Row-specified topic question").exists()


def test_import_url_is_not_shadowed_by_question_detail_route(admin_client, topic):
    """Regression test: the router's questions/<pk>/ detail route must not
    intercept questions/import/ by matching "import" as a pk value."""
    csv_bytes = (
        b"question_text,option_a,option_b,option_c,option_d,correct_option\n"
        b'"Which of these is a prime number?",4,6,7,8,C\n'
    )
    upload = SimpleUploadedFile("questions.csv", csv_bytes, content_type="text/csv")

    response = admin_client.post(
        reverse("admin-question-import"),
        {"file": upload, "format": "csv", "topic_id": str(topic.id)},
        format="multipart",
    )

    assert response.status_code == 200
    assert response.data["data"]["success"] == 1
