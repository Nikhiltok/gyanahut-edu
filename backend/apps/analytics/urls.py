from django.urls import path

from .views import (
    AdminAttemptsChartView,
    AdminDashboardStatsView,
    AdminGrowthChartView,
    AdminPerformanceChartView,
    PerformanceGraphView,
    StudentDashboardView,
)

urlpatterns = [
    path("analytics/dashboard/", StudentDashboardView.as_view(), name="analytics-dashboard"),
    path("analytics/performance/", PerformanceGraphView.as_view(), name="analytics-performance"),
]

admin_urlpatterns = [
    path("dashboard/stats/", AdminDashboardStatsView.as_view(), name="admin-dashboard-stats"),
    path("dashboard/growth/", AdminGrowthChartView.as_view(), name="admin-dashboard-growth"),
    path("dashboard/attempts/", AdminAttemptsChartView.as_view(), name="admin-dashboard-attempts"),
    path("dashboard/performance/", AdminPerformanceChartView.as_view(), name="admin-dashboard-performance"),
]
