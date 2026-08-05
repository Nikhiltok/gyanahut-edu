import type { PublicQuestion } from "@/types/test";

import { api } from "./api";

export interface Bookmark {
  id: string;
  question: string;
  question_detail: PublicQuestion;
  created_at: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function getBookmarks() {
  const { data } = await api.get<PaginatedResponse<Bookmark>>("/bookmarks/", { params: { page_size: "200" } });
  return data.results;
}

export async function removeBookmark(id: string) {
  await api.delete(`/bookmarks/${id}/`);
}
