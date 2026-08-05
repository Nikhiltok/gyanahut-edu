import { api } from "./client";

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

export async function getDashboardStats() {
  const { data } = await api.get<{ success: true; message: string; data: DashboardStats }>("/analytics/dashboard/");
  return data.data;
}

export async function getPerformanceGraph() {
  const { data } = await api.get<{ success: true; message: string; data: PerformancePoint[] }>(
    "/analytics/performance/",
  );
  return data.data;
}
