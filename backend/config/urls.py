from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from apps.analytics import urls as analytics_urls
from apps.core.views import health_check
from apps.exams import urls as exams_urls
from apps.payments import urls as payments_urls
from apps.questions import urls as questions_urls
from apps.tests import urls as tests_urls
from apps.users import urls as users_urls

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/health/", health_check, name="health-check"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path("api/v1/auth/", include("apps.authentication.urls")),
    path("api/v1/users/", include(users_urls.urlpatterns)),
    path("api/v1/admin/", include(users_urls.admin_urlpatterns)),
    path("api/v1/", include(exams_urls.urlpatterns)),
    path("api/v1/admin/", include(exams_urls.admin_urlpatterns)),
    path("api/v1/", include(questions_urls.urlpatterns)),
    path("api/v1/admin/", include(questions_urls.admin_urlpatterns)),
    path("api/v1/", include(tests_urls.urlpatterns)),
    path("api/v1/admin/", include(tests_urls.admin_urlpatterns)),
    path("api/v1/", include(payments_urls.urlpatterns)),
    path("api/v1/admin/", include(payments_urls.admin_urlpatterns)),
    path("api/v1/", include("apps.attempts.urls")),
    path("api/v1/", include("apps.leaderboard.urls")),
    path("api/v1/", include(analytics_urls.urlpatterns)),
    path("api/v1/admin/", include(analytics_urls.admin_urlpatterns)),
]

if settings.DEBUG:
    # Serve uploaded media (e.g. profile photos) in dev — production deployments
    # serve MEDIA_ROOT via the web server/CDN instead.
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
