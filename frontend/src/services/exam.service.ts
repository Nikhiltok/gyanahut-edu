import type { Chapter, Exam, ExamCategory, PaginatedResponse, Subject, Topic } from "@/types/exam";

import { api } from "./api";

// --- Public, read-only browsing (student side) ---

export async function getCategories() {
  const { data } = await api.get<PaginatedResponse<ExamCategory>>("/categories/");
  return data.results;
}

export async function getCategory(slug: string) {
  const { data } = await api.get<ExamCategory>(`/categories/${slug}/`);
  return data;
}

export async function getExams(params?: { category?: string }) {
  const { data } = await api.get<PaginatedResponse<Exam>>("/exams/", { params });
  return data.results;
}

export async function getExam(slug: string) {
  const { data } = await api.get<Exam>(`/exams/${slug}/`);
  return data;
}

export async function getSubjects(examId: string) {
  const { data } = await api.get<PaginatedResponse<Subject>>("/subjects/", { params: { exam: examId } });
  return data.results;
}

export async function getChapters(subjectId: string) {
  const { data } = await api.get<PaginatedResponse<Chapter>>("/chapters/", { params: { subject: subjectId } });
  return data.results;
}

export async function getTopics(chapterId: string) {
  const { data } = await api.get<PaginatedResponse<Topic>>("/topics/", { params: { chapter: chapterId } });
  return data.results;
}

export async function getTopic(id: string) {
  const { data } = await api.get<Topic>(`/topics/${id}/`);
  return data;
}

export async function getChapter(id: string) {
  const { data } = await api.get<Chapter>(`/chapters/${id}/`);
  return data;
}

export async function getSubject(id: string) {
  const { data } = await api.get<Subject>(`/subjects/${id}/`);
  return data;
}

// --- Admin CRUD (identical shape across the 5 hierarchy resources) ---

function adminCrud<T extends { id: string }>(resource: string) {
  const base = `/admin/${resource}/`;
  return {
    // Admin list views (tables and dropdown option lists) render everything they
    // get with no pagination UI of their own, so request a high page size by
    // default — otherwise anything past the API's default page size (20)
    // silently disappears from tables and dropdowns alike.
    list: async (params?: Record<string, string>) => {
      const { data } = await api.get<PaginatedResponse<T>>(base, { params: { page_size: "500", ...params } });
      return data.results;
    },
    get: async (id: string) => {
      const { data } = await api.get<T>(`${base}${id}/`);
      return data;
    },
    create: async (payload: Partial<T>) => {
      const { data } = await api.post<T>(base, payload);
      return data;
    },
    update: async (id: string, payload: Partial<T>) => {
      const { data } = await api.patch<T>(`${base}${id}/`, payload);
      return data;
    },
    remove: async (id: string) => {
      await api.delete(`${base}${id}/`);
    },
  };
}

export const adminCategoryApi = adminCrud<ExamCategory>("categories");
export const adminExamApi = adminCrud<Exam>("exams");
export const adminSubjectApi = adminCrud<Subject>("subjects");
export const adminChapterApi = adminCrud<Chapter>("chapters");
export const adminTopicApi = adminCrud<Topic>("topics");

export type AdminCrudApi<T extends { id: string }> = ReturnType<typeof adminCrud<T>>;
