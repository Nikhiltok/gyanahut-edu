import type { AIGenerationJob } from "@/types/ai-question";
import type { PaginatedResponse } from "@/types/exam";

import { api } from "./api";

export async function startAIGeneration(payload: { topic_id: string; count: number; difficulty: string }) {
  const { data } = await api.post<{ success: true; message: string; data: AIGenerationJob }>(
    "/admin/questions/ai-generate/",
    payload,
  );
  return data.data;
}

export async function stopAIGeneration(jobId: string) {
  const { data } = await api.post<{ success: true; message: string; data: AIGenerationJob }>(
    `/admin/ai-jobs/${jobId}/stop/`,
  );
  return data.data;
}

export async function getAIJob(jobId: string) {
  const { data } = await api.get<AIGenerationJob>(`/admin/ai-jobs/${jobId}/`);
  return data;
}

export async function getAIJobs(topicId: string) {
  const { data } = await api.get<PaginatedResponse<AIGenerationJob>>("/admin/ai-jobs/", {
    params: { topic: topicId, page_size: "500" },
  });
  return data.results;
}
