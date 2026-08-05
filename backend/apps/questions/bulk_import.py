import csv
import io
import json

import openpyxl
from django.db import transaction

from apps.exams.models import Topic

from .models import Question, QuestionOption

REQUIRED_FIELDS = ["question_text", "option_a", "option_b", "option_c", "option_d", "correct_option"]
OPTION_KEYS = ["option_a", "option_b", "option_c", "option_d"]
OPTION_LETTERS = ["A", "B", "C", "D"]


def parse_rows(uploaded_file, file_format):
    file_format = file_format.lower()
    if file_format == "csv":
        text = uploaded_file.read().decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(text))
        return [dict(row) for row in reader]

    if file_format == "json":
        data = json.loads(uploaded_file.read().decode("utf-8"))
        if not isinstance(data, list):
            raise ValueError("JSON file must contain a list of question objects")
        return data

    if file_format in ("xlsx", "excel"):
        workbook = openpyxl.load_workbook(uploaded_file, read_only=True, data_only=True)
        sheet = workbook.active
        rows_iter = sheet.iter_rows(values_only=True)
        header = [str(h).strip() if h else "" for h in next(rows_iter)]
        rows = []
        for values in rows_iter:
            if values is None or all(v is None for v in values):
                continue
            rows.append({header[i]: values[i] for i in range(len(header)) if i < len(values)})
        return rows

    raise ValueError(f"Unsupported format: {file_format}")


def resolve_topic_id(row, default_topic_id):
    """A row's own `topic` column wins; otherwise falls back to the topic the
    upload was launched from (e.g. the "Upload" action on a specific Topic in
    Exam Management)."""
    row_topic = str(row.get("topic") or "").strip()
    return row_topic or (str(default_topic_id) if default_topic_id else "")


def validate_row(row, default_topic_id=None):
    errors = []
    for field in REQUIRED_FIELDS:
        if not str(row.get(field, "")).strip():
            errors.append(f"Missing required field '{field}'")

    topic_id = resolve_topic_id(row, default_topic_id)
    if not topic_id:
        errors.append("Missing required field 'topic' (no default topic was provided either)")
    elif not Topic.objects.filter(id=topic_id).exists():
        errors.append(f"Topic '{topic_id}' does not exist")

    if errors:
        return errors

    correct_option = str(row["correct_option"]).strip().upper()
    if correct_option not in OPTION_LETTERS:
        errors.append(f"correct_option must be one of {OPTION_LETTERS}, got '{correct_option}'")

    for marks_field in ("marks", "negative_marks"):
        value = row.get(marks_field)
        if value not in (None, ""):
            try:
                float(value)
            except (TypeError, ValueError):
                errors.append(f"'{marks_field}' must be numeric")

    if Question.objects.filter(topic_id=topic_id, question_text=str(row["question_text"]).strip()).exists():
        errors.append("Duplicate question (same text already exists for this topic)")

    return errors


@transaction.atomic
def create_question_from_row(row, user, default_topic_id=None):
    correct_option = str(row["correct_option"]).strip().upper()
    question = Question.objects.create(
        topic_id=resolve_topic_id(row, default_topic_id),
        question_text=str(row["question_text"]).strip(),
        difficulty=str(row.get("difficulty") or Question.Difficulty.MEDIUM).strip().upper(),
        explanation=str(row.get("explanation") or "").strip(),
        marks=row.get("marks") or 1,
        negative_marks=row.get("negative_marks") or 0,
        language=str(row.get("language") or "en").strip(),
        created_by=user,
    )
    options = []
    for i, key in enumerate(OPTION_KEYS):
        options.append(
            QuestionOption(
                question=question,
                option_text=str(row[key]).strip(),
                is_correct=(OPTION_LETTERS[i] == correct_option),
                order=i,
            )
        )
    QuestionOption.objects.bulk_create(options)
    return question


def run_bulk_import(uploaded_file, file_format, user, default_topic_id=None):
    rows = parse_rows(uploaded_file, file_format)
    total = len(rows)
    success = 0
    error_report = []

    for index, row in enumerate(rows, start=1):
        row_errors = validate_row(row, default_topic_id)
        if row_errors:
            error_report.append({"row": index, "errors": row_errors})
            continue
        try:
            create_question_from_row(row, user, default_topic_id)
            success += 1
        except Exception as exc:  # noqa: BLE001 - surfaced back in the per-row error report
            error_report.append({"row": index, "errors": [str(exc)]})

    return {
        "total": total,
        "success": success,
        "failed": total - success,
        "errors": error_report,
    }
