"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRechargePlans, getWallet, recharge, verifyPayment } from "@/services/payments.service";
import { getApiErrorMessage } from "@/utils/api-error";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function RechargeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/profile/wallet";
  const shortfall = Number(searchParams.get("shortfall") ?? 0);

  const { data: wallet } = useQuery({ queryKey: ["wallet"], queryFn: getWallet });
  const { data: plans, isLoading: isPlansLoading } = useQuery({
    queryKey: ["recharge-plans"],
    queryFn: getRechargePlans,
  });

  const [planId, setPlanId] = useState<string | null>(null);

  // Default selection (before the student picks one explicitly): the cheapest
  // plan that covers the shortfall, if any, otherwise the cheapest plan overall.
  // Derived during render rather than an effect + setState, since it's just a
  // fallback value — no need to sync it back into state.
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
    onError: (error) => toast.error(getApiErrorMessage(error, "Payment verification failed")),
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
          handler: (response: { razorpay_payment_id: string; razorpay_signature: string }) => {
            verifyMutation.mutate({
              gatewayOrderId: order.gateway_order_id,
              paymentId: response.razorpay_payment_id,
            });
          },
        });
        razorpay.open();
      } else {
        // Dev/test mode fallback: no live Razorpay key configured on the backend.
        verifyMutation.mutate({ gatewayOrderId: order.gateway_order_id, paymentId: `pay_test_${Date.now()}` });
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not start recharge"));
    }
  }

  const isPending = rechargeMutation.isPending || verifyMutation.isPending;

  return (
    <div className="mx-auto max-w-md space-y-4 p-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <Card>
        <CardHeader>
          <CardTitle>Recharge Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg bg-muted/40 p-3 text-sm">
            <p className="text-muted-foreground">Current balance</p>
            <p className="text-lg font-semibold">{wallet?.balance ?? "—"} credits</p>
          </div>

          {shortfall > 0 && (
            <p className="rounded-lg bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
              You need {shortfall} more credit{shortfall === 1 ? "" : "s"} to continue.
            </p>
          )}

          <div className="space-y-2">
            {isPlansLoading ? (
              <p className="text-sm text-muted-foreground">Loading plans...</p>
            ) : (plans ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No recharge plans are available right now.</p>
            ) : (
              <div className="space-y-2">
                {(plans ?? []).map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setPlanId(plan.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border-2 p-3.5 text-left transition-colors",
                      effectivePlanId === plan.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-primary/30 hover:bg-muted/40",
                    )}
                  >
                    <span className="font-semibold">₹{plan.amount}</span>
                    <span className="text-sm text-muted-foreground">{plan.credits} credits</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button className="w-full" onClick={handlePay} disabled={isPending || !selectedPlan}>
            {isPending ? "Processing..." : selectedPlan ? `Pay ₹${selectedPlan.amount}` : "Select a plan"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
