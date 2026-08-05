import { api } from "./api";
import type { Test } from "@/types/test";

interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface TestQuestionRow {
  id: string;
  question: string;
  question_text: string;
  explanation: string;
  options: { id: string; option_text: string; is_correct: boolean; order: number }[];
  order: number;
}

export interface TestAttemptAdmin {
  id: string;
  student: string;
  student_name: string;
  student_email: string;
  score: number;
  correct_answers: number;
  wrong_answers: number;
  skipped_answers: number;
  accuracy: number;
  time_taken: number;
  started_at: string;
  submitted_at: string | null;
}

export async function publishTest(testId: string) {
  const { data } = await api.post<ApiSuccess<Test>>(`/admin/scheduler/${testId}/publish/`);
  return data.data;
}

export async function archiveTest(testId: string) {
  const { data } = await api.patch<ApiSuccess<Test>>(`/admin/scheduler/${testId}/archive/`);
  return data.data;
}

export async function getTestQuestions(testId: string) {
  const { data } = await api.get<ApiSuccess<TestQuestionRow[]>>(`/admin/scheduler/${testId}/questions/`);
  return data.data;
}

export async function attachQuestions(testId: string, questionIds: string[]) {
  const { data } = await api.post<ApiSuccess<TestQuestionRow[]>>(`/admin/scheduler/${testId}/questions/`, {
    question_ids: questionIds,
  });
  return data.data;
}

export async function removeTestQuestion(testId: string, questionId: string) {
  await api.delete(`/admin/scheduler/${testId}/questions/${questionId}/`);
}

export async function autoAttachQuestions(testId: string, options?: { difficulty?: string; count?: number }) {
  const { data } = await api.post<ApiSuccess<TestQuestionRow[]>>(
    `/admin/scheduler/${testId}/auto-attach/`,
    options ?? {},
  );
  return data.data;
}

export async function getTestAttempts(testId: string) {
  const { data } = await api.get<ApiSuccess<TestAttemptAdmin[]>>(`/admin/scheduler/${testId}/attempts/`);
  return data.data;
}
