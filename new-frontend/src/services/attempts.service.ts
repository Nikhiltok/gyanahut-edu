import type { RevisionQuestion, TestResult } from "@/types/test";

import { api } from "./api";

export interface AttemptSummary {
  id: string;
  test: string;
  test_title: string;
  exam_name: string;
  score: number;
  correct_answers: number;
  wrong_answers: number;
  skipped_answers: number;
  accuracy: number;
  time_taken: number;
  started_at: string;
  submitted_at: string;
}

export async function getMyAttempts(type?: "practice" | "mock", examIds?: string[]) {
  const { data } = await api.get<{ success: true; message: string; data: AttemptSummary[] }>(
    "/results/my-attempts/",
    { params: { ...(type ? { type } : undefined), ...(examIds?.length ? { exam: examIds } : undefined) } },
  );
  return data.data;
}

export async function getResult(attemptId: string) {
  const { data } = await api.get<{ success: true; message: string; data: TestResult }>(
    `/results/${attemptId}/`,
  );
  return data.data;
}

export async function getWrongQuestions(examIds?: string[]) {
  const { data } = await api.get<{ success: true; message: string; data: RevisionQuestion[] }>(
    "/revision/wrong/",
    { params: examIds?.length ? { exam: examIds } : undefined },
  );
  return data.data;
}

export async function getDifficultQuestions(examIds?: string[]) {
  const { data } = await api.get<{ success: true; message: string; data: RevisionQuestion[] }>(
    "/revision/difficult/",
    { params: examIds?.length ? { exam: examIds } : undefined },
  );
  return data.data;
}
