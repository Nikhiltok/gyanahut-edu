import type { PaginatedResponse } from "@/types/exam";
import type { Bookmark, BulkImportResult, DifficultMark, ImportHistoryEntry, Question } from "@/types/question";

import { api } from "./api";

export async function getQuestions(params?: { topic?: string; difficulty?: string; search?: string }) {
  const { data } = await api.get<PaginatedResponse<Question>>("/questions/", { params });
  return data.results;
}

export interface QuestionWritePayload {
  topic: string;
  question_text: string;
  difficulty: string;
  explanation: string;
  marks: number;
  negative_marks: number;
  options: { option_text: string; is_correct: boolean }[];
}

export const adminQuestionApi = {
  list: async (params?: Record<string, string>) => {
    const { data } = await api.get<PaginatedResponse<Question>>("/admin/questions/", {
      params: { page_size: "500", ...params },
    });
    return data.results;
  },
  get: async (id: string) => {
    const { data } = await api.get<Question>(`/admin/questions/${id}/`);
    return data;
  },
  create: async (payload: QuestionWritePayload) => {
    const { data } = await api.post<Question>("/admin/questions/", payload);
    return data;
  },
  update: async (id: string, payload: QuestionWritePayload) => {
    const { data } = await api.patch<Question>(`/admin/questions/${id}/`, payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/admin/questions/${id}/`);
  },
};

export async function bulkImportQuestions(file: File, format: string, defaultTopicId?: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("format", format);
  if (defaultTopicId) {
    formData.append("topic_id", defaultTopicId);
  }
  const { data } = await api.post<{ success: true; message: string; data: BulkImportResult }>(
    "/admin/questions/import/",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}

export async function getImportHistory() {
  const { data } = await api.get<PaginatedResponse<ImportHistoryEntry>>("/admin/question-imports/", {
    params: { page_size: "500" },
  });
  return data.results;
}

export async function getBookmarks() {
  const { data } = await api.get<PaginatedResponse<Bookmark>>("/bookmarks/");
  return data.results;
}

export async function addBookmark(questionId: string) {
  const { data } = await api.post<Bookmark>("/bookmarks/", { question: questionId });
  return data;
}

export async function removeBookmark(id: string) {
  await api.delete(`/bookmarks/${id}/`);
}

export async function getDifficultMarks() {
  const { data } = await api.get<PaginatedResponse<DifficultMark>>("/difficult-marks/");
  return data.results;
}

export async function addDifficultMark(questionId: string) {
  const { data } = await api.post<DifficultMark>("/difficult-marks/", { question: questionId });
  return data;
}

export async function removeDifficultMark(id: string) {
  await api.delete(`/difficult-marks/${id}/`);
}
