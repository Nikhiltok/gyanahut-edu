import { api } from "./api";
import type { AdminOrder, PlatformSettings } from "@/types/payment";

interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function getAdminOrders(params?: { status?: string; search?: string }) {
  const { data } = await api.get<PaginatedResponse<AdminOrder>>("/admin/orders/", {
    params: { page_size: "500", ...params },
  });
  return data.results;
}

export async function getPlatformSettings() {
  const { data } = await api.get<ApiSuccess<PlatformSettings>>("/admin/payments/settings/");
  return data.data;
}

export async function updatePlatformSettings(payload: Partial<PlatformSettings>) {
  const { data } = await api.patch<ApiSuccess<PlatformSettings>>("/admin/payments/settings/", payload);
  return data.data;
}
