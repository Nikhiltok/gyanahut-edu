import { api } from "./api";

export interface AdminStats {
  students: number;
  tests: number;
  questions: number;
  live_tests: number;
  revenue: number;
}

export interface DateCountPoint {
  date: string;
  count: number;
}

export interface AdminPerformancePoint {
  date: string;
  average_score: number;
  average_accuracy: number;
}

async function get<T>(path: string) {
  const { data } = await api.get<{ success: true; message: string; data: T }>(path);
  return data.data;
}

export const getAdminStats = () => get<AdminStats>("/admin/dashboard/stats/");
export const getAdminGrowth = () => get<DateCountPoint[]>("/admin/dashboard/growth/");
export const getAdminAttempts = () => get<DateCountPoint[]>("/admin/dashboard/attempts/");
export const getAdminPerformance = () => get<AdminPerformancePoint[]>("/admin/dashboard/performance/");
