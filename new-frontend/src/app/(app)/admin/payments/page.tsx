"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getErrorMessage } from "@/lib/api-error";
import { adminCrud } from "@/services/admin-crud";
import { getAdminOrders, getPlatformSettings, updatePlatformSettings } from "@/services/payments-admin.service";
import type { RechargePlan } from "@/types/payment";

const rechargePlanApi = adminCrud<RechargePlan>("payments/plans");

const ORDER_STATUS_CLASS: Record<string, string> = {
  PAID: "text-success-fg",
  CREATED: "text-warning-fg",
  FAILED: "text-danger-fg",
  REFUNDED: "text-muted-fg",
};

export default function AdminPaymentsPage() {
  const queryClient = useQueryClient();
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["admin-recharge-plans"],
    queryFn: () => rechargePlanApi.list(),
  });

  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<RechargePlan | null>(null);
  const [amount, setAmount] = useState(199);
  const [credits, setCredits] = useState(200);

  useEffect(() => {
    if (!planDialogOpen) return;
    setAmount(editingPlan ? Number(editingPlan.amount) : 199);
    setCredits(editingPlan?.credits ?? 200);
  }, [planDialogOpen, editingPlan]);

  const savePlanMutation = useMutation({
    mutationFn: () => {
      const payload = { amount: String(amount), credits, status: true };
      return editingPlan ? rechargePlanApi.update(editingPlan.id, payload) : rechargePlanApi.create(payload);
    },
    onSuccess: () => {
      toast.success(editingPlan ? "Plan updated" : "Plan created");
      queryClient.invalidateQueries({ queryKey: ["admin-recharge-plans"] });
      setPlanDialogOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not save plan.")),
  });

  const { data: settings } = useQuery({ queryKey: ["platform-settings"], queryFn: getPlatformSettings });
  const [dailyFree, setDailyFree] = useState(0);
  const [monthlyFree, setMonthlyFree] = useState(0);

  useEffect(() => {
    if (!settings) return;
    setMonthlyFree(settings.free_practice_attempts_per_month);
    setDailyFree(settings.free_practice_max_questions);
  }, [settings]);

  const settingsMutation = useMutation({
    mutationFn: () =>
      updatePlatformSettings({
        free_practice_attempts_per_month: monthlyFree,
        free_practice_max_questions: dailyFree,
      }),
    onSuccess: () => {
      toast.success("Settings updated");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not update settings.")),
  });

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders", orderSearch, orderStatus],
    queryFn: () => getAdminOrders({ search: orderSearch || undefined, status: orderStatus || undefined }),
  });

  const totalRevenue = (orders ?? [])
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + Number(o.amount), 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[13.5px] font-semibold text-fg">Recharge plans</h2>
            <button
              type="button"
              onClick={() => {
                setEditingPlan(null);
                setPlanDialogOpen(true);
              }}
              className={buttonVariants({ size: "sm" })}
            >
              Add plan
            </button>
          </div>
          <div className="mt-4 space-y-2.5">
            {(plans ?? []).map((plan) => (
              <div key={plan.id} className="flex items-center justify-between text-xs">
                <span className="text-fg">
                  ₹{plan.amount} — {plan.credits} credits
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPlan(plan);
                    setPlanDialogOpen(true);
                  }}
                  className="font-medium text-accent-fg"
                >
                  Edit
                </button>
              </div>
            ))}
            {plansLoading && <p className="text-sm text-muted-fg">Loading plans…</p>}
            {!plansLoading && plans?.length === 0 && <p className="text-sm text-muted-fg">No plans yet.</p>}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[13.5px] font-semibold text-fg">Free practice quota</h2>
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              settingsMutation.mutate();
            }}
          >
            <Input
              type="number"
              min={0}
              value={dailyFree}
              onChange={(e) => setDailyFree(Number(e.target.value))}
              placeholder="Free practice max questions"
            />
            <Input
              type="number"
              min={0}
              value={monthlyFree}
              onChange={(e) => setMonthlyFree(Number(e.target.value))}
              placeholder="Free attempts per month"
            />
            <Button type="submit" size="sm" disabled={settingsMutation.isPending}>
              {settingsMutation.isPending ? "Saving..." : "Save settings"}
            </Button>
          </form>
        </Card>
      </div>

      <Card className="border-none bg-surface-alt p-4">
        <p className="text-[13px] font-medium text-fg">
          Total revenue (filtered): ₹{totalRevenue.toLocaleString()}
        </p>
      </Card>

      <Card className="p-5">
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search by student"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="w-[220px]"
          />
          <Select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="w-[160px]">
            <option value="">All statuses</option>
            <option value="PAID">Paid</option>
            <option value="CREATED">Created</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </Select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-border text-[11.5px] font-semibold text-muted-fg">
                <th className="py-3 pr-4">Student</th>
                <th className="py-3 pr-4">Amount</th>
                <th className="py-3 pr-4">Credits</th>
                <th className="py-3 pr-4">Gateway</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Purchased at</th>
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((order) => (
                <tr key={order.id} className="border-b border-border/60 last:border-none">
                  <td className="py-3 pr-4 text-fg">{order.student_name}</td>
                  <td className="py-3 pr-4 text-fg">₹{order.amount}</td>
                  <td className="py-3 pr-4 text-fg">{order.credits_purchased}</td>
                  <td className="py-3 pr-4 text-fg">{order.payment_gateway}</td>
                  <td className={`py-3 pr-4 ${ORDER_STATUS_CLASS[order.status]}`}>{order.status}</td>
                  <td className="py-3 text-fg">
                    {order.purchased_at
                      ? new Date(order.purchased_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ordersLoading && <p className="py-4 text-sm text-muted-fg">Loading orders…</p>}
          {!ordersLoading && orders?.length === 0 && <p className="py-4 text-sm text-muted-fg">No orders found.</p>}
        </div>
      </Card>

      <Dialog open={planDialogOpen} onClose={() => setPlanDialogOpen(false)} title={editingPlan ? "Edit plan" : "Add plan"}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            savePlanMutation.mutate();
          }}
        >
          <Input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Amount (₹)"
          />
          <Input
            type="number"
            min={1}
            value={credits}
            onChange={(e) => setCredits(Number(e.target.value))}
            placeholder="Credits"
          />
          <Button type="submit" className="w-full" disabled={savePlanMutation.isPending}>
            {savePlanMutation.isPending ? "Saving..." : "Save plan"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
