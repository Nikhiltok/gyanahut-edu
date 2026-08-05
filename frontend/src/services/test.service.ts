import type { PaginatedResponse } from "@/types/exam";
import type {
  AnswerPayload,
  ExpiredAttemptResponse,
  StartTestResponse,
  SubmitTestResponse,
  Test,
  TestAttemptAdmin,
  TestQuestion,
} from "@/types/test";

import { api } from "./api";

export async function getUpcomingTests() {
  const { data } = await api.get<{ success: true; message: string; data: Test[] }>("/tests/upcoming/");
  return data.data;
}

export async function getLiveTests() {
  const { data } = await api.get<{ success: true; message: string; data: Test[] }>("/tests/live/");
  return data.data;
}

export async function getTestDetail(id: string) {
  const { data } = await api.get<{ success: true; message: string; data: Test }>(`/tests/${id}/`);
  return data.data;
}

export async function startTest(id: string) {
  const { data } = await api.post<{
    success: true;
    message: string;
    data: StartTestResponse | ExpiredAttemptResponse;
  }>(`/tests/${id}/start/`);
  return data.data;
}

export async function submitTest(id: string, attemptId: string, answers: AnswerPayload[]) {
  const { data } = await api.post<{ success: true; message: string; data: SubmitTestResponse }>(
    `/tests/${id}/submit/`,
    { attempt_id: attemptId, answers },
  );
  return data.data;
}

export interface SaveProgressPayload {
  question: string;
  option: string | null;
  current_question_index: number;
}

// Best-effort autosave — callers should swallow errors, never block the exam UI on it.
export async function saveProgress(testId: string, attemptId: string, payload: SaveProgressPayload) {
  const { data } = await api.post<{ success: true; message: string; data: { saved?: true; expired?: true } }>(
    `/tests/${testId}/attempts/${attemptId}/progress/`,
    payload,
  );
  return data.data;
}

export interface GeneratePracticeTestPayload {
  exam: string;
  subject?: string | null;
  chapter?: string | null;
  topic?: string | null;
  question_count: number;
  duration: number;
}

export async function generatePracticeTest(payload: GeneratePracticeTestPayload) {
  const { data } = await api.post<{ success: true; message: string; data: Test }>(
    "/tests/practice/generate/",
    payload,
  );
  return data.data;
}

export interface TestWritePayload {
  exam: string;
  subject?: string | null;
  chapter?: string | null;
  topic?: string | null;
  title: string;
  test_type: string;
  duration: number;
  max_attempts: number;
  negative_marking: boolean;
  negative_marks: number;
  start_time?: string | null;
  end_time?: string | null;
  is_paid?: boolean;
  credit_cost?: number | null;
}

export const adminTestApi = {
  list: async (params?: Record<string, string>) => {
    const { data } = await api.get<PaginatedResponse<Test>>("/admin/scheduler/", {
      params: { page_size: "500", ...params },
    });
    return data.results;
  },
  get: async (id: string) => {
    const { data } = await api.get<Test>(`/admin/scheduler/${id}/`);
    return data;
  },
  create: async (payload: TestWritePayload) => {
    const { data } = await api.post<Test>("/admin/scheduler/", payload);
    return data;
  },
  update: async (id: string, payload: Partial<TestWritePayload>) => {
    const { data } = await api.patch<Test>(`/admin/scheduler/${id}/`, payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/admin/scheduler/${id}/`);
  },
  publish: async (id: string) => {
    const { data } = await api.post(`/admin/scheduler/${id}/publish/`);
    return data;
  },
  archive: async (id: string) => {
    const { data } = await api.patch(`/admin/scheduler/${id}/archive/`);
    return data;
  },
  getQuestions: async (id: string) => {
    const { data } = await api.get<{ success: true; message: string; data: TestQuestion[] }>(
      `/admin/scheduler/${id}/questions/`,
    );
    return data.data;
  },
  attachQuestions: async (id: string, questionIds: string[]) => {
    const { data } = await api.post(`/admin/scheduler/${id}/questions/`, { question_ids: questionIds });
    return data;
  },
  removeQuestion: async (id: string, questionId: string) => {
    const { data } = await api.delete<{ success: true; message: string; data: TestQuestion[] }>(
      `/admin/scheduler/${id}/questions/${questionId}/`,
    );
    return data.data;
  },
  autoAttach: async (id: string, options?: { count?: number; difficulty?: string }) => {
    const { data } = await api.post(`/admin/scheduler/${id}/auto-attach/`, options ?? {});
    return data;
  },
  attempts: async (id: string) => {
    const { data } = await api.get<{ success: true; message: string; data: TestAttemptAdmin[] }>(
      `/admin/scheduler/${id}/attempts/`,
    );
    return data.data;
  },
};
