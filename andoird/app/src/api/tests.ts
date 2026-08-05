import type { GeneratePracticePayload, StartTestResponse, SubmitTestResponse, Test } from "../types/test";

import { api } from "./client";

interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export async function generatePracticeTest(payload: GeneratePracticePayload) {
  const { data } = await api.post<ApiSuccess<Test>>("/tests/practice/generate/", payload);
  return data.data;
}

export async function getLiveTests() {
  const { data } = await api.get<ApiSuccess<Test[]>>("/tests/live/");
  return data.data;
}

export async function getUpcomingTests() {
  const { data } = await api.get<ApiSuccess<Test[]>>("/tests/upcoming/");
  return data.data;
}

export async function getTest(testId: string) {
  const { data } = await api.get<ApiSuccess<Test>>(`/tests/${testId}/`);
  return data.data;
}

export async function startTest(testId: string) {
  const { data } = await api.post<ApiSuccess<StartTestResponse>>(`/tests/${testId}/start/`);
  return data.data;
}

export async function saveProgress(
  testId: string,
  attemptId: string,
  payload: { question: string; option: string | null; current_question_index: number },
) {
  const { data } = await api.post<ApiSuccess<{ saved: boolean }>>(
    `/tests/${testId}/attempts/${attemptId}/progress/`,
    payload,
  );
  return data.data;
}

export async function submitTest(
  testId: string,
  payload: { attempt_id: string; answers: { question: string; option: string | null }[] },
) {
  const { data } = await api.post<ApiSuccess<SubmitTestResponse>>(`/tests/${testId}/submit/`, payload);
  return data.data;
}
