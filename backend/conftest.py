import pytest
from rest_framework.test import APIClient

from apps.exams.models import Chapter, Exam, ExamCategory, Subject, Topic
from apps.questions.models import Question, QuestionOption
from apps.users.models import User


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def student_user(db):
    return User.objects.create_user(email="student@test.com", password="TestPass123!", role=User.Role.STUDENT)


@pytest.fixture
def admin_user(db):
    return User.objects.create_user(
        email="admin@test.com", password="TestPass123!", role=User.Role.ADMIN, is_staff=True
    )


@pytest.fixture
def auth_client(api_client, student_user):
    api_client.force_authenticate(user=student_user)
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    return api_client


@pytest.fixture
def topic(db):
    category = ExamCategory.objects.create(name="SSC")
    exam = Exam.objects.create(category=category, name="SSC CGL", exam_type="SSC")
    subject = Subject.objects.create(exam=exam, name="Mathematics")
    chapter = Chapter.objects.create(subject=subject, name="Percentage")
    return Topic.objects.create(chapter=chapter, name="Profit Loss")


@pytest.fixture
def question(topic, admin_user):
    q = Question.objects.create(
        topic=topic, question_text="10 is what percent of 50?", marks=2, negative_marks=0.5, created_by=admin_user
    )
    QuestionOption.objects.create(question=q, option_text="10%", is_correct=False, order=0)
    correct = QuestionOption.objects.create(question=q, option_text="20%", is_correct=True, order=1)
    QuestionOption.objects.create(question=q, option_text="30%", is_correct=False, order=2)
    QuestionOption.objects.create(question=q, option_text="40%", is_correct=False, order=3)
    q.correct_option_id = correct.id
    return q
