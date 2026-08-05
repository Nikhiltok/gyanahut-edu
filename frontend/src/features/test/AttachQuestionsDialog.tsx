"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminQuestionApi } from "@/services/question.service";
import type { Test } from "@/types/test";

const DIFFICULTY_ITEMS = [
  { value: "ALL", label: "All Difficulties" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

interface AttachQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test: Test | null;
  onAttach: (questionIds: string[]) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function AttachQuestionsDialog({ open, onOpenChange, test, onAttach, isSubmitting }: AttachQuestionsDialogProps) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selected, setSelected] = useState<string[]>([]);

  // Scope the pool to whatever level this test is scheduled at, narrowest first —
  // same precedence as the auto-attach action, so pickers and auto-attach agree.
  const scopeParams: Record<string, string> = {};
  if (test?.topic) scopeParams.topic = test.topic;
  else if (test?.chapter) scopeParams.chapter = test.chapter;
  else if (test?.subject) scopeParams.subject = test.subject;
  else if (test?.exam) scopeParams.exam = test.exam;

  const { data: questions } = useQuery({
    queryKey: ["admin-questions-for-attach", test?.id, search, difficulty],
    queryFn: () =>
      adminQuestionApi.list({
        ...scopeParams,
        ...(search ? { search } : {}),
        ...(difficulty !== "ALL" ? { difficulty } : {}),
      }),
    enabled: !!test,
  });

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setSearch("");
      setDifficulty("ALL");
      setSelected([]);
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Attach Questions{test ? ` — ${test.title}` : ""}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="Search question text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select items={DIFFICULTY_ITEMS} value={difficulty} onValueChange={(v) => setDifficulty(v ?? "ALL")}>
            <SelectTrigger className="w-40">
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

        <div className="max-h-80 space-y-2 overflow-y-auto">
          {(questions ?? []).length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No questions found in this test&apos;s scope.
            </p>
          ) : (
            (questions ?? []).map((q) => (
              <label key={q.id} className="flex items-start gap-2 rounded-md border p-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={selected.includes(q.id)}
                  onChange={(e) =>
                    setSelected((s) => (e.target.checked ? [...s, q.id] : s.filter((id) => id !== q.id)))
                  }
                />
                <span className="line-clamp-2 flex-1">{q.question_text}</span>
                <Badge variant="secondary" className="shrink-0">
                  {q.difficulty}
                </Badge>
              </label>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button disabled={selected.length === 0 || isSubmitting} onClick={() => onAttach(selected)}>
            {isSubmitting ? "Attaching..." : `Attach ${selected.length || ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
