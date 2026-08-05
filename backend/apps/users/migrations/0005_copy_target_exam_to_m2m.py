from django.db import migrations


def copy_forward(apps, schema_editor):
    StudentProfile = apps.get_model("users", "StudentProfile")
    for profile in StudentProfile.objects.exclude(target_exam__isnull=True):
        profile.target_exams.add(profile.target_exam_id)


def copy_backward(apps, schema_editor):
    StudentProfile = apps.get_model("users", "StudentProfile")
    for profile in StudentProfile.objects.all():
        first_exam = profile.target_exams.first()
        if first_exam:
            profile.target_exam_id = first_exam.id
            profile.save(update_fields=["target_exam"])


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0004_add_target_exams_m2m"),
    ]

    operations = [
        migrations.RunPython(copy_forward, copy_backward),
    ]
