import type { AttemptSummary, LeaderboardEntry, TestResult } from "@/types/result";

import { api } from "./api";

export async function getResult(attemptId: string) {
  const { data } = await api.get<{ success: true; message: string; data: TestResult }>(
    `/results/${attemptId}/`,
  );
  return data.data;
}

export async function getMyAttempts(type?: "practice" | "mock") {
  const { data } = await api.get<{ success: true; message: string; data: AttemptSummary[] }>(
    "/results/my-attempts/",
    { params: type ? { type } : undefined },
  );
  return data.data;
}

export async function getGlobalLeaderboard(period?: string) {
  const { data } = await api.get<{ success: true; message: string; data: LeaderboardEntry[] }>(
    "/leaderboard/global/",
    { params: period ? { period } : undefined },
  );
  return data.data;
}

export async function getExamLeaderboard(examId: string, period?: string) {
  const { data } = await api.get<{ success: true; message: string; data: LeaderboardEntry[] }>(
    `/leaderboard/exam/${examId}/`,
    { params: period ? { period } : undefined },
  );
  return data.data;
}
