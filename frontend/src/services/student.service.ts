import type { PaginatedResponse } from "@/types/exam";
import type { AdminStudent } from "@/types/student";

import { api } from "./api";

export async function getAdminStudents(params?: { search?: string }) {
  const { data } = await api.get<PaginatedResponse<AdminStudent>>("/admin/students/", {
    params: { page_size: "500", ...params },
  });
  return data.results;
}
