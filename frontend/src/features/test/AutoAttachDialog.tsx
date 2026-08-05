"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Test } from "@/types/test";

const DIFFICULTY_ITEMS = [
  { value: "ALL", label: "Any Difficulty" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

export interface AutoAttachOptions {
  count?: number;
  difficulty?: string;
}

interface AutoAttachDialogProps {
  test: Test | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: AutoAttachOptions) => void;
  isSubmitting?: boolean;
}

export function AutoAttachDialog({ test, onOpenChange, onConfirm, isSubmitting }: AutoAttachDialogProps) {
  const [count, setCount] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");

  function handleClose(open: boolean) {
    if (!open) {
      setCount("");
      setDifficulty("ALL");
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={!!test} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Auto-attach Questions{test ? ` — ${test.title}` : ""}</DialogTitle>
          <DialogDescription>
            Pulls questions from this test&apos;s scope. Leave the count blank to attach every matching
            question, or enter a number to randomly pick that many unique questions — no repeats.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auto-attach-count">Number of questions (optional)</Label>
            <Input
              id="auto-attach-count"
              type="number"
              min={1}
              placeholder="All matching questions"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Difficulty (optional)</Label>
            <Select items={DIFFICULTY_ITEMS} value={difficulty} onValueChange={(v) => setDifficulty(v ?? "ALL")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={() =>
              onConfirm({
                count: count ? Number(count) : undefined,
                difficulty: difficulty !== "ALL" ? difficulty : undefined,
              })
            }
          >
            {isSubmitting ? "Attaching..." : "Auto-attach"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
