import type { PaginatedResponse } from "@/types/exam";
import type {
  AdminOrder,
  CreditTransaction,
  Order,
  PlatformSettings,
  PracticeQuota,
  RechargePlan,
  RechargeResponse,
  Wallet,
} from "@/types/payment";

import { api } from "./api";

export async function getRechargePlans() {
  const { data } = await api.get<{ success: true; message: string; data: RechargePlan[] }>("/payments/plans/");
  return data.data;
}

export async function recharge(planId: string) {
  const { data } = await api.post<{ success: true; message: string; data: RechargeResponse }>(
    "/payments/recharge/",
    { plan_id: planId },
  );
  return data.data;
}

export async function verifyPayment(gatewayOrderId: string, gatewayPaymentId: string, signature = "") {
  const { data } = await api.post<{ success: true; message: string; data: Order }>("/payments/verify/", {
    gateway_order_id: gatewayOrderId,
    gateway_payment_id: gatewayPaymentId,
    signature,
  });
  return data.data;
}

export async function getMyOrders() {
  const { data } = await api.get<{ success: true; message: string; data: Order[] }>("/payments/my-orders/");
  return data.data;
}

export async function getWallet() {
  const { data } = await api.get<{ success: true; message: string; data: Wallet }>("/payments/wallet/");
  return data.data;
}

export async function getTransactions() {
  const { data } = await api.get<{ success: true; message: string; data: CreditTransaction[] }>(
    "/payments/transactions/",
  );
  return data.data;
}

export async function getPracticeQuota() {
  const { data } = await api.get<{ success: true; message: string; data: PracticeQuota }>(
    "/payments/practice-quota/",
  );
  return data.data;
}

export async function getAdminOrders(params?: { status?: string; search?: string }) {
  const { data } = await api.get<PaginatedResponse<AdminOrder>>("/admin/orders/", {
    params: { page_size: "500", ...params },
  });
  return data.results;
}

export async function getPlatformSettings() {
  const { data } = await api.get<{ success: true; message: string; data: PlatformSettings }>(
    "/admin/payments/settings/",
  );
  return data.data;
}

export async function updatePlatformSettings(payload: Partial<PlatformSettings>) {
  const { data } = await api.patch<{ success: true; message: string; data: PlatformSettings }>(
    "/admin/payments/settings/",
    payload,
  );
  return data.data;
}

export async function adjustCredit(payload: { student_id: string; type: "CREDIT" | "DEBIT"; amount: number; note?: string }) {
  const { data } = await api.post<{ success: true; message: string; data: Wallet }>(
    "/admin/payments/adjust-credit/",
    payload,
  );
  return data.data;
}

export interface RechargePlanWritePayload {
  amount: number;
  credits: number;
  status: boolean;
}

export const adminRechargePlanApi = {
  list: async () => {
    const { data } = await api.get<PaginatedResponse<RechargePlan> | RechargePlan[]>("/admin/payments/plans/", {
      params: { page_size: "500" },
    });
    return Array.isArray(data) ? data : data.results;
  },
  create: async (payload: RechargePlanWritePayload) => {
    const { data } = await api.post<RechargePlan>("/admin/payments/plans/", payload);
    return data;
  },
  update: async (id: string, payload: Partial<RechargePlanWritePayload>) => {
    const { data } = await api.patch<RechargePlan>(`/admin/payments/plans/${id}/`, payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/admin/payments/plans/${id}/`);
  },
};
