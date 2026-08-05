import pytest
from django.core.management import call_command

from apps.exams.models import Chapter, Exam, ExamCategory, Subject, Topic

pytestmark = pytest.mark.django_db


def test_seed_exam_data_creates_full_hierarchy():
    call_command("seed_exam_data")

    assert ExamCategory.objects.filter(name="SSC").exists()
    ssc_cgl = Exam.objects.get(name="SSC CGL", category__name="SSC")
    assert Subject.objects.filter(exam=ssc_cgl, name="Quantitative Aptitude").exists()
    assert Chapter.objects.filter(subject__exam=ssc_cgl, name="Number System").exists()
    assert Topic.objects.filter(chapter__name="Number System", name="HCF and LCM").exists()


def test_seed_exam_data_is_idempotent():
    call_command("seed_exam_data")
    counts_after_first_run = (
        ExamCategory.objects.count(),
        Exam.objects.count(),
        Subject.objects.count(),
        Chapter.objects.count(),
        Topic.objects.count(),
    )

    call_command("seed_exam_data")
    counts_after_second_run = (
        ExamCategory.objects.count(),
        Exam.objects.count(),
        Subject.objects.count(),
        Chapter.objects.count(),
        Topic.objects.count(),
    )

    assert counts_after_first_run == counts_after_second_run


def test_seed_exam_data_preserves_pre_existing_data():
    category = ExamCategory.objects.create(name="SSC")
    exam = Exam.objects.create(category=category, name="SSC CGL", exam_type=Exam.ExamType.SSC)
    subject = Subject.objects.create(exam=exam, name="Custom Manual Subject")

    call_command("seed_exam_data")

    assert Subject.objects.filter(id=subject.id).exists()
    assert Subject.objects.filter(exam=exam, name="Quantitative Aptitude").exists()
