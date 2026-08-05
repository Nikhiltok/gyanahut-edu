import type { CreditTransaction, Order, RechargePlan, RechargeResponse, Wallet } from "@/types/payment";
import type { PracticeQuota } from "@/types/test";

import { api } from "./api";

interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export async function getRechargePlans() {
  const { data } = await api.get<ApiSuccess<RechargePlan[]>>("/payments/plans/");
  return data.data;
}

export async function recharge(planId: string) {
  const { data } = await api.post<ApiSuccess<RechargeResponse>>("/payments/recharge/", { plan_id: planId });
  return data.data;
}

export async function verifyPayment(gatewayOrderId: string, gatewayPaymentId: string, signature = "") {
  const { data } = await api.post<ApiSuccess<Order>>("/payments/verify/", {
    gateway_order_id: gatewayOrderId,
    gateway_payment_id: gatewayPaymentId,
    signature,
  });
  return data.data;
}

export async function getWallet() {
  const { data } = await api.get<ApiSuccess<Wallet>>("/payments/wallet/");
  return data.data;
}

export async function getTransactions() {
  const { data } = await api.get<ApiSuccess<CreditTransaction[]>>("/payments/transactions/");
  return data.data;
}

export async function getPracticeQuota() {
  const { data } = await api.get<ApiSuccess<PracticeQuota>>("/payments/practice-quota/");
  return data.data;
}
