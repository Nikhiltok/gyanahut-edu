from django.core.management.base import BaseCommand
from django.db import transaction

from apps.exams.models import Chapter, Exam, ExamCategory, Subject, Topic
from apps.exams.seed_data import SEED_DATA


class Command(BaseCommand):
    help = (
        "Seeds the exam category/exam/subject/chapter/topic hierarchy from "
        "apps.exams.seed_data. Idempotent — safe to run on every startup, "
        "only creates records that don't already exist."
    )

    def handle(self, *args, **options):
        counts = {"categories": 0, "exams": 0, "subjects": 0, "chapters": 0, "topics": 0}

        with transaction.atomic():
            for category_data in SEED_DATA:
                category, created = ExamCategory.objects.get_or_create(name=category_data["category"])
                counts["categories"] += created

                for exam_data in category_data.get("exams", []):
                    exam, created = Exam.objects.get_or_create(
                        name=exam_data["name"],
                        category=category,
                        defaults={"exam_type": exam_data.get("exam_type", Exam.ExamType.STATE_GOVT)},
                    )
                    counts["exams"] += created

                    for order, subject_data in enumerate(exam_data.get("subjects", [])):
                        subject, created = Subject.objects.get_or_create(
                            exam=exam, name=subject_data["name"], defaults={"order": order}
                        )
                        counts["subjects"] += created

                        for c_order, chapter_data in enumerate(subject_data.get("chapters", [])):
                            if isinstance(chapter_data, str):
                                chapter_name, topics = chapter_data, []
                            else:
                                chapter_name, topics = chapter_data["name"], chapter_data.get("topics", [])

                            chapter, created = Chapter.objects.get_or_create(
                                subject=subject, name=chapter_name, defaults={"order": c_order}
                            )
                            counts["chapters"] += created

                            for t_order, topic_name in enumerate(topics):
                                _, created = Topic.objects.get_or_create(
                                    chapter=chapter, name=topic_name, defaults={"order": t_order}
                                )
                                counts["topics"] += created

        self.stdout.write(
            self.style.SUCCESS(
                "Exam data seed complete — created {categories} categories, {exams} exams, "
                "{subjects} subjects, {chapters} chapters, {topics} topics "
                "(existing records were left untouched).".format(**counts)
            )
        )
