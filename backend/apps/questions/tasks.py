from celery import shared_task
from django.db import transaction

from .ai_provider import AIQuestionProviderError, generate_questions
from .models import AIGenerationJob, Question, QuestionOption

BATCH_SIZE = 5
# Safety valve: an AI that keeps producing near-duplicates should eventually give
# up rather than looping forever chasing the last few unique questions.
MAX_ATTEMPTS_MULTIPLIER = 3


@shared_task
def generate_questions_task(job_id):
    try:
        job = AIGenerationJob.objects.select_related(
            "topic__chapter__subject__exam__category",
        ).get(id=job_id)
    except AIGenerationJob.DoesNotExist:
        return

    job.status = AIGenerationJob.Status.RUNNING
    job.save(update_fields=["status"])

    topic = job.topic
    topic_context = {
        "category": topic.chapter.subject.exam.category.name,
        "exam": topic.chapter.subject.exam.name,
        "exam_type": topic.chapter.subject.exam.exam_type,
        "subject": topic.chapter.subject.name,
        "chapter": topic.chapter.name,
        "topic": topic.name,
    }

    seen_texts = {
        text.strip().lower()
        for text in Question.objects.filter(topic_id=topic.id).values_list("question_text", flat=True)
    }

    attempts = 0
    max_attempts = max(job.target_count * MAX_ATTEMPTS_MULTIPLIER, 10)

    while job.generated_count < job.target_count and attempts < max_attempts:
        job.refresh_from_db(fields=["stop_requested"])
        if job.stop_requested:
            job.status = AIGenerationJob.Status.STOPPED
            job.save(update_fields=["status"])
            return

        remaining = job.target_count - job.generated_count
        attempts += 1

        try:
            candidates = generate_questions(
                topic_context, job.difficulty, min(BATCH_SIZE, remaining), list(seen_texts)
            )
        except AIQuestionProviderError as exc:
            job.status = AIGenerationJob.Status.FAILED
            job.error_message = str(exc)
            job.save(update_fields=["status", "error_message"])
            return

        for candidate in candidates:
            if job.generated_count >= job.target_count:
                break

            text = str(candidate.get("question_text", "")).strip()
            options = candidate.get("options") or []
            correct_index = candidate.get("correct_index")
            if not text or len(options) != 4 or correct_index not in (0, 1, 2, 3):
                continue

            normalized = text.lower()
            if normalized in seen_texts or Question.objects.filter(
                topic_id=topic.id, question_text=text
            ).exists():
                job.duplicate_count += 1
                seen_texts.add(normalized)
                continue

            with transaction.atomic():
                question = Question.objects.create(
                    topic_id=topic.id,
                    question_text=text,
                    difficulty=job.difficulty,
                    explanation=str(candidate.get("explanation") or "").strip(),
                    created_by=job.requested_by,
                )
                QuestionOption.objects.bulk_create(
                    [
                        QuestionOption(
                            question=question,
                            option_text=str(option).strip(),
                            is_correct=(index == correct_index),
                            order=index,
                        )
                        for index, option in enumerate(options)
                    ]
                )
            seen_texts.add(normalized)
            job.generated_count += 1

        job.save(update_fields=["generated_count", "duplicate_count"])

    if job.generated_count >= job.target_count:
        job.status = AIGenerationJob.Status.COMPLETED
    else:
        job.status = AIGenerationJob.Status.FAILED
        job.error_message = job.error_message or (
            "Reached the maximum number of attempts without generating the requested "
            "number of unique questions."
        )
    job.save(update_fields=["status", "error_message"])
