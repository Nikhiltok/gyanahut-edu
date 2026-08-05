import type { AdminStudent } from "@/types/student";

import { api } from "./api";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function getAdminStudents(params?: { search?: string }) {
  const { data } = await api.get<PaginatedResponse<AdminStudent>>("/admin/students/", {
    params: { page_size: "500", ...params },
  });
  return data.results;
}
