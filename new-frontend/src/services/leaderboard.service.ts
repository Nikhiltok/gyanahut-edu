import { api } from "./api";

export interface LeaderboardEntry {
  student: string;
  name: string;
  rank: number;
  total_score: number;
  total_attempt: number;
  accuracy: number;
}

export async function getGlobalLeaderboard(period?: "weekly" | "monthly", examIds?: string[]) {
  const { data } = await api.get<{ success: true; message: string; data: LeaderboardEntry[] }>(
    "/leaderboard/global/",
    { params: { ...(period ? { period } : undefined), ...(examIds?.length ? { exam: examIds } : undefined) } },
  );
  return data.data;
}
