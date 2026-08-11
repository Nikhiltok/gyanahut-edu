import type { Chapter, Exam, ExamCategory, Subject, Topic } from "@/types/exam";

import { api } from "./api";

// The category/exam/subject/chapter/topic public endpoints feed dropdown
// selectors and are unpaginated on the backend — they return a plain array.

export async function getCategories() {
  const { data } = await api.get<ExamCategory[]>("/categories/");
  return data;
}

export async function getCategory(slug: string) {
  const { data } = await api.get<ExamCategory>(`/categories/${slug}/`);
  return data;
}

export async function getExams(params?: { category?: string }) {
  const { data } = await api.get<Exam[]>("/exams/", { params });
  return data;
}

export async function getExam(slug: string) {
  const { data } = await api.get<Exam>(`/exams/${slug}/`);
  return data;
}

export async function getSubjects(examId: string) {
  const { data } = await api.get<Subject[]>("/subjects/", { params: { exam: examId } });
  return data;
}

export async function getSubject(id: string) {
  const { data } = await api.get<Subject>(`/subjects/${id}/`);
  return data;
}

export async function getChapters(subjectId: string) {
  const { data } = await api.get<Chapter[]>("/chapters/", { params: { subject: subjectId } });
  return data;
}

export async function getChapter(id: string) {
  const { data } = await api.get<Chapter>(`/chapters/${id}/`);
  return data;
}

export async function getTopics(chapterId: string) {
  const { data } = await api.get<Topic[]>("/topics/", { params: { chapter: chapterId } });
  return data;
}
