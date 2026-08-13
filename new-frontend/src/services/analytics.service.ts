import { api } from "./api";

export interface InProgressAttempt {
  attempt_id: string;
  test_id: string;
  test_title: string;
  exam_name: string;
  current_question_index: number;
  total_questions: number;
  last_seen: string;
}

export interface DashboardStats {
  tests_attempted: number;
  average_score: number;
  accuracy: number;
  weak_topics: string[];
  strong_topics: string[];
  day_streak: number;
  in_progress_attempt: InProgressAttempt | null;
}

export interface PerformancePoint {
  date: string;
  score: number;
  accuracy: number;
}

export async function getDashboardStats(examIds?: string[]) {
  const { data } = await api.get<{ success: true; message: string; data: DashboardStats }>(
    "/analytics/dashboard/",
    { params: examIds?.length ? { exam: examIds } : undefined },
  );
  return data.data;
}

export async function getPerformanceGraph(examIds?: string[]) {
  const { data } = await api.get<{ success: true; message: string; data: PerformancePoint[] }>(
    "/analytics/performance/",
    { params: examIds?.length ? { exam: examIds } : undefined },
  );
  return data.data;
}

export interface AdminDashboardStats {
  students: number;
  tests: number;
  questions: number;
  live_tests: number;
  revenue: number;
}

export interface DayCountPoint {
  date: string;
  count: number;
}

export interface DayPerformancePoint {
  date: string;
  average_score: number;
  average_accuracy: number;
}

export async function getAdminDashboardStats() {
  const { data } = await api.get<{ success: true; message: string; data: AdminDashboardStats }>(
    "/admin/dashboard/stats/",
  );
  return data.data;
}

export async function getAdminGrowthChart() {
  const { data } = await api.get<{ success: true; message: string; data: DayCountPoint[] }>(
    "/admin/dashboard/growth/",
  );
  return data.data;
}

export async function getAdminAttemptsChart() {
  const { data } = await api.get<{ success: true; message: string; data: DayCountPoint[] }>(
    "/admin/dashboard/attempts/",
  );
  return data.data;
}

export async function getAdminPerformanceChart() {
  const { data } = await api.get<{ success: true; message: string; data: DayPerformancePoint[] }>(
    "/admin/dashboard/performance/",
  );
  return data.data;
}
