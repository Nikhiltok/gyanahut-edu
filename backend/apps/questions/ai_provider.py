import json

from django.conf import settings
from openai import OpenAI


class AIQuestionProviderError(Exception):
    pass


def _client():
    if not settings.OPENAI_API_KEY:
        raise AIQuestionProviderError("OPENAI_API_KEY is not configured.")
    return OpenAI(api_key=settings.OPENAI_API_KEY)


def generate_questions(topic_context, difficulty, count, avoid_texts=None):
    """Ask OpenAI for `count` unique MCQs for the given topic context.

    Returns a list of dicts: {question_text, options: [4 strings], correct_index (0-3), explanation}
    """
    client = _client()

    avoid_block = ""
    if avoid_texts:
        bullet_list = "\n".join(f"- {text}" for text in avoid_texts[-50:])
        avoid_block = (
            "Do not repeat, rephrase, or closely resemble any of these already-existing "
            f"questions for this topic:\n{bullet_list}\n\n"
        )

    prompt = (
        "You are an expert question setter for Indian competitive government exams.\n"
        f"Category: {topic_context['category']}\n"
        f"Exam: {topic_context['exam']} ({topic_context['exam_type']})\n"
        f"Subject: {topic_context['subject']}\n"
        f"Chapter: {topic_context['chapter']}\n"
        f"Topic: {topic_context['topic']}\n\n"
        f"{avoid_block}"
        f"Generate exactly {count} unique multiple-choice questions (MCQ) at {difficulty} difficulty, "
        "strictly on this topic, suitable for exam practice. Each question must have exactly 4 options "
        "with exactly one correct answer, and a short explanation for the correct answer.\n\n"
        "Respond ONLY with a JSON object of this exact shape:\n"
        '{"questions": [{"question_text": str, "options": [str, str, str, str], '
        '"correct_index": int (0-3), "explanation": str}]}'
    )

    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.8,
    )

    try:
        payload = json.loads(response.choices[0].message.content)
        questions = payload["questions"]
    except (KeyError, ValueError, IndexError, json.JSONDecodeError) as exc:
        raise AIQuestionProviderError(f"Unexpected AI response format: {exc}") from exc

    return questions
