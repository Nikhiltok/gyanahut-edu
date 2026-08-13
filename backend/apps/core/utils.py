import uuid

from django.utils.text import slugify


def unique_slugify(instance, value, slug_field_name="slug"):
    """Generate a unique slug for `instance` by appending -2, -3, ... on collision."""
    model = instance.__class__
    base_slug = slugify(value)
    slug = base_slug
    counter = 2
    while model.objects.filter(**{slug_field_name: slug}).exclude(pk=instance.pk).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug


def get_exam_ids_filter(request):
    """Read repeated `?exam=<uuid>` query params (the dashboard header's
    multi-exam filter) and return only the syntactically valid UUIDs as
    strings. Invalid values are silently ignored rather than raising, so a
    stray bad value never 500s the request — an empty result (whether because
    none were passed or all were invalid) means "no filter, show everything",
    matching the frontend's empty-selection = all-exams default."""
    raw_values = request.query_params.getlist("exam")
    exam_ids = []
    for value in raw_values:
        try:
            exam_ids.append(str(uuid.UUID(value)))
        except (ValueError, TypeError, AttributeError):
            continue
    return exam_ids
