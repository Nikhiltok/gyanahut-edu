export type OrderStatus = "CREATED" | "PAID" | "FAILED" | "REFUNDED";

export interface RechargePlan {
  id: string;
  amount: string;
  credits: number;
  status: boolean;
}

export interface Order {
  id: string;
  plan: string | null;
  amount: string;
  credits_purchased: number;
  currency: string;
  payment_gateway: string;
  gateway_order_id: string;
  status: OrderStatus;
  purchased_at: string | null;
  created_at: string;
}

export interface AdminOrder extends Order {
  student: string;
  student_name: string;
  student_email: string;
}

export interface RechargeResponse {
  order_id: string;
  gateway_order_id: string;
  amount: number;
  credits: number;
  currency: string;
  key: string;
}

export interface Wallet {
  balance: number;
}

export type CreditTransactionType = "CREDIT" | "DEBIT";
export type CreditTransactionSource =
  | "RECHARGE"
  | "TEST_ATTEMPT"
  | "SELF_PRACTICE"
  | "FREE_PRACTICE"
  | "REFUND"
  | "ADMIN_ADJUSTMENT";

export interface CreditTransaction {
  id: string;
  type: CreditTransactionType;
  source: CreditTransactionSource;
  amount: number;
  order: string | null;
  test: string | null;
  test_title: string | null;
  balance_after: number;
  note: string;
  created_at: string;
}

export interface PlatformSettings {
  free_practice_attempts_per_month: number;
  free_practice_max_questions: number;
}

export interface PracticeQuota {
  free_attempts_per_month: number;
  free_used_this_month: number;
  free_remaining_this_month: number;
  free_max_questions: number;
}
