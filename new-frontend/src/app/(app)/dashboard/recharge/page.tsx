"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useState } from "react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { getRechargePlans, getWallet, recharge, verifyPayment } from "@/services/payments.service";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function RechargeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard/wallet";
  const shortfall = Number(searchParams.get("shortfall") ?? 0);

  const { data: wallet } = useQuery({ queryKey: ["wallet"], queryFn: getWallet });
  const { data: plans, isLoading } = useQuery({ queryKey: ["recharge-plans"], queryFn: getRechargePlans });

  const [planId, setPlanId] = useState<string | null>(null);

  let defaultPlanId: string | null = null;
  if (plans && plans.length > 0) {
    const sorted = [...plans].sort((a, b) => a.credits - b.credits);
    const coversShortfall = shortfall > 0 ? sorted.find((p) => p.credits >= shortfall) : undefined;
    defaultPlanId = (coversShortfall ?? sorted[0]).id;
  }
  const effectivePlanId = planId ?? defaultPlanId;
  const selectedPlan = plans?.find((p) => p.id === effectivePlanId) ?? null;

  const rechargeMutation = useMutation({
    mutationFn: () => {
      if (!effectivePlanId) throw new Error("Select a plan first");
      return recharge(effectivePlanId);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ gatewayOrderId, paymentId }: { gatewayOrderId: string; paymentId: string }) =>
      verifyPayment(gatewayOrderId, paymentId),
    onSuccess: (order) => {
      toast.success(`${order.credits_purchased} credits added to your wallet`);
      router.push(redirectTo);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Payment verification failed")),
  });

  async function handlePay() {
    try {
      const order = await rechargeMutation.mutateAsync();

      if (order.key && window.Razorpay) {
        const razorpay = new window.Razorpay({
          key: order.key,
          amount: order.amount * 100,
          currency: order.currency,
          order_id: order.gateway_order_id,
          name: "Gyanahut Edu",
          description: `${order.credits} credits`,
          handler: (response: { razorpay_payment_id: string }) => {
            verifyMutation.mutate({ gatewayOrderId: order.gateway_order_id, paymentId: response.razorpay_payment_id });
          },
        });
        razorpay.open();
      } else {
        verifyMutation.mutate({ gatewayOrderId: order.gateway_order_id, paymentId: `pay_test_${Date.now()}` });
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not start recharge"));
    }
  }

  const isPending = rechargeMutation.isPending || verifyMutation.isPending;

  return (
    <div className="mx-auto max-w-5xl">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <Card className="p-6">
        <p className="text-[13.5px] text-muted-fg">Current balance: {wallet?.balance ?? "—"} credits</p>

        {shortfall > 0 && (
          <div className="mt-4 rounded-md bg-warning-bg px-4 py-2.5 text-xs text-warning-fg">
            You need {shortfall} more credit{shortfall === 1 ? "" : "s"} to attempt this test
          </div>
        )}

        <div className="mt-5 space-y-2.5">
          {isLoading && <p className="text-sm text-muted-fg">Loading plans…</p>}
          {!isLoading && (plans ?? []).length === 0 && (
            <p className="text-sm text-muted-fg">No recharge plans are available right now.</p>
          )}
          {(plans ?? []).map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setPlanId(plan.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border-[1.6px] px-5 py-3 text-left text-[13px] font-medium text-fg transition-colors",
                effectivePlanId === plan.id ? "border-gold bg-chip-bg" : "border-border bg-surface hover:border-gold/40",
              )}
            >
              ₹{plan.amount} — {plan.credits} credits
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePay}
          disabled={isPending || !selectedPlan}
          className="mt-6 h-11 rounded-md bg-gold px-6 text-sm font-semibold text-gold-ink disabled:opacity-60"
        >
          {isPending ? "Processing..." : selectedPlan ? `Pay ₹${selectedPlan.amount}` : "Select a plan"}
        </button>
      </Card>
    </div>
  );
}

export default function RechargePage() {
  return (
    <Suspense fallback={null}>
      <RechargeContent />
    </Suspense>
  );
}
