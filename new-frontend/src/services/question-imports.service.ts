import { api } from "./api";
import type { AIGenerationJob, ImportHistory } from "@/types/import";

interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export async function bulkImportQuestions(file: File, format: string, topicId?: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("format", format);
  if (topicId) formData.append("topic_id", topicId);
  const { data } = await api.post<ApiSuccess<ImportHistory>>("/admin/questions/import/", formData, {
    headers: { "Content-Type": undefined },
  });
  return data.data;
}

export async function getImportHistory() {
  const { data } = await api.get<{ count: number; results: ImportHistory[] } | ImportHistory[]>(
    "/admin/question-imports/",
    { params: { page_size: "50" } },
  );
  return Array.isArray(data) ? data : data.results;
}

export async function startAIGeneration(topicId: string, difficulty: string, count: number) {
  const { data } = await api.post<ApiSuccess<AIGenerationJob>>("/admin/questions/ai-generate/", {
    topic_id: topicId,
    difficulty,
    count,
  });
  return data.data;
}

export async function getAIGenerationJobs(topicId?: string) {
  const { data } = await api.get<{ count: number; results: AIGenerationJob[] } | AIGenerationJob[]>(
    "/admin/ai-jobs/",
    { params: { page_size: "50", ...(topicId ? { topic: topicId } : {}) } },
  );
  return Array.isArray(data) ? data : data.results;
}

export async function stopAIGeneration(jobId: string) {
  const { data } = await api.post<ApiSuccess<AIGenerationJob>>(`/admin/ai-jobs/${jobId}/stop/`);
  return data.data;
}
