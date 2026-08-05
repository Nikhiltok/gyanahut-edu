import { api } from "./api";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function adminCrud<T extends { id: string }>(resource: string) {
  const base = `/admin/${resource}/`;
  return {
    list: async (params?: Record<string, string>) => {
      const { data } = await api.get<PaginatedResponse<T> | T[]>(base, {
        params: { page_size: "500", ...params },
      });
      return Array.isArray(data) ? data : data.results;
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
