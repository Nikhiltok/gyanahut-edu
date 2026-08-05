import type { Chapter, Exam, ExamCategory, PaginatedResponse, Subject, Topic } from "@/types/exam";

import { api } from "./api";

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

export async function getSubject(id: string) {
  const { data } = await api.get<Subject>(`/subjects/${id}/`);
  return data;
}

export async function getChapters(subjectId: string) {
  const { data } = await api.get<PaginatedResponse<Chapter>>("/chapters/", { params: { subject: subjectId } });
  return data.results;
}

export async function getChapter(id: string) {
  const { data } = await api.get<Chapter>(`/chapters/${id}/`);
  return data;
}

export async function getTopics(chapterId: string) {
  const { data } = await api.get<PaginatedResponse<Topic>>("/topics/", { params: { chapter: chapterId } });
  return data.results;
}
