"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { RechargePlanWritePayload } from "@/services/payments.service";
import type { RechargePlan } from "@/types/payment";

interface RechargePlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: RechargePlan | null;
  isSubmitting?: boolean;
  onSubmit: (payload: RechargePlanWritePayload) => Promise<void> | void;
}

export function RechargePlanFormDialog({
  open,
  onOpenChange,
  editing,
  isSubmitting,
  onSubmit,
}: RechargePlanFormDialogProps) {
  // Remounted via a changing `key` from the parent whenever `editing` changes,
  // so lazy initial state from `editing` is enough — same convention as TestFormDialog.
  const [amount, setAmount] = useState(Number(editing?.amount ?? 10));
  const [credits, setCredits] = useState(editing?.credits ?? 10);
  const [status, setStatus] = useState(editing?.status ?? true);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await onSubmit({ amount, credits, status });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Recharge Plan" : "Add Recharge Plan"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plan-amount">Amount (₹)</Label>
            <Input
              id="plan-amount"
              type="number"
              min={1}
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan-credits">Credits</Label>
            <Input
              id="plan-credits"
              type="number"
              min={1}
              required
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={status} onCheckedChange={setStatus} id="plan-status" />
            <Label htmlFor="plan-status">Active (visible to students)</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || amount < 1 || credits < 1}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
