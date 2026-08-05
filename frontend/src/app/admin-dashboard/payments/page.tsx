"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RechargePlanFormDialog } from "@/features/payments/RechargePlanFormDialog";
import {
  adminRechargePlanApi,
  getAdminOrders,
  getPlatformSettings,
  updatePlatformSettings,
  type RechargePlanWritePayload,
} from "@/services/payments.service";
import { getApiErrorMessage } from "@/utils/api-error";
import type { OrderStatus, RechargePlan } from "@/types/payment";

const STATUS_OPTIONS: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Statuses" },
  { value: "PAID", label: "Paid" },
  { value: "CREATED", label: "Created" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

const STATUS_BADGE: Record<OrderStatus, "default" | "secondary" | "destructive"> = {
  PAID: "default",
  CREATED: "secondary",
  FAILED: "destructive",
  REFUNDED: "secondary",
};

function PlatformSettingsCard() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({ queryKey: ["platform-settings"], queryFn: getPlatformSettings });

  const [freeAttempts, setFreeAttempts] = useState<number | null>(null);
  const [freeMaxQuestions, setFreeMaxQuestions] = useState<number | null>(null);

  const effective = {
    free_practice_attempts_per_month: freeAttempts ?? settings?.free_practice_attempts_per_month ?? 0,
    free_practice_max_questions: freeMaxQuestions ?? settings?.free_practice_max_questions ?? 0,
  };

  const saveMutation = useMutation({
    mutationFn: () => updatePlatformSettings(effective),
    onSuccess: () => {
      toast.success("Payment settings updated");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
      setFreeAttempts(null);
      setFreeMaxQuestions(null);
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not update settings")),
  });

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="text-base">Free Practice Quota</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="free-attempts">Free Practice / Month</Label>
            <Input
              id="free-attempts"
              type="number"
              min={0}
              value={effective.free_practice_attempts_per_month}
              onChange={(e) => setFreeAttempts(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="free-max-questions">Free Practice Max Questions</Label>
            <Input
              id="free-max-questions"
              type="number"
              min={0}
              value={effective.free_practice_max_questions}
              onChange={(e) => setFreeMaxQuestions(Number(e.target.value))}
            />
          </div>
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}

function RechargePlansCard() {
  const queryClient = useQueryClient();
  const { data: plans, isLoading } = useQuery({ queryKey: ["admin-recharge-plans"], queryFn: adminRechargePlanApi.list });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RechargePlan | null>(null);

  const saveMutation = useMutation({
    mutationFn: (payload: RechargePlanWritePayload) =>
      editing ? adminRechargePlanApi.update(editing.id, payload) : adminRechargePlanApi.create(payload),
    onSuccess: () => {
      toast.success(editing ? "Plan updated" : "Plan created");
      queryClient.invalidateQueries({ queryKey: ["admin-recharge-plans"] });
      queryClient.invalidateQueries({ queryKey: ["recharge-plans"] });
      setDialogOpen(false);
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not save plan")),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (plan: RechargePlan) => adminRechargePlanApi.update(plan.id, { status: !plan.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-recharge-plans"] });
      queryClient.invalidateQueries({ queryKey: ["recharge-plans"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not update plan status")),
  });

  return (
    <Card className="max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recharge Plans</CardTitle>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          Add Plan
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (plans ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No recharge plans yet — add one to let students recharge.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(plans ?? []).map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>₹{plan.amount}</TableCell>
                  <TableCell>{plan.credits}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={plan.status}
                        onCheckedChange={() => toggleStatusMutation.mutate(plan)}
                        disabled={toggleStatusMutation.isPending}
                      />
                      <Badge variant={plan.status ? "default" : "secondary"}>
                        {plan.status ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(plan);
                        setDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <RechargePlanFormDialog
        key={editing?.id ?? "new"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        isSubmitting={saveMutation.isPending}
        onSubmit={async (payload) => {
          await saveMutation.mutateAsync(payload);
        }}
      />
    </Card>
  );
}

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("ALL");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders", search, status],
    queryFn: () =>
      getAdminOrders({
        ...(search ? { search } : {}),
        ...(status !== "ALL" ? { status } : {}),
      }),
  });

  const totalRevenue = (orders ?? [])
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + Number(o.amount), 0);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-sm text-muted-foreground">{orders?.length ?? 0} recharges</p>
      </div>

      <div className="flex flex-wrap gap-6">
        <RechargePlansCard />
        <PlatformSettingsCard />
      </div>

      <Card className="max-w-xs">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground">Total Revenue (filtered)</p>
          <p className="text-2xl font-semibold">₹{totalRevenue.toFixed(2)}</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search by student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select items={STATUS_OPTIONS} value={status} onValueChange={(v) => setStatus(v ?? "ALL")}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Purchased At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(orders ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                (orders ?? []).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <p>{order.student_name}</p>
                      <p className="text-xs text-muted-foreground">{order.student_email}</p>
                    </TableCell>
                    <TableCell>
                      ₹{order.amount} {order.currency}
                    </TableCell>
                    <TableCell>{order.credits_purchased}</TableCell>
                    <TableCell className="capitalize">{order.payment_gateway}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_BADGE[order.status]}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {order.purchased_at ? new Date(order.purchased_at).toLocaleString() : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
