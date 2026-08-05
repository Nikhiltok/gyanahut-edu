from django.urls import path

from .views import DifficultQuestionsView, MyAttemptsView, ResultDetailView, WrongQuestionsView

urlpatterns = [
    path("results/my-attempts/", MyAttemptsView.as_view(), name="my-attempts"),
    path("results/<uuid:attempt_id>/", ResultDetailView.as_view(), name="result-detail"),
    path("revision/wrong/", WrongQuestionsView.as_view(), name="revision-wrong"),
    path("revision/difficult/", DifficultQuestionsView.as_view(), name="revision-difficult"),
]
