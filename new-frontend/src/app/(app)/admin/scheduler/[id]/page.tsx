"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { adminCrud } from "@/services/admin-crud";
import {
  archiveTest,
  attachQuestions,
  autoAttachQuestions,
  getTestQuestions,
  publishTest,
  removeTestQuestion,
} from "@/services/tests-admin.service";
import type { AdminQuestion } from "@/types/question";
import type { Test } from "@/types/test";

const testApi = adminCrud<Test>("scheduler");
const questionApi = adminCrud<AdminQuestion>("questions");

const STATUS_BADGE: Record<string, string> = {
  LIVE: "bg-danger-bg text-danger-fg",
  SCHEDULED: "bg-warning-bg text-warning-fg",
  COMPLETED: "bg-success-bg text-success-fg",
  DRAFT: "bg-surface-alt text-muted-fg",
  ARCHIVED: "bg-surface-alt text-muted-fg",
};

function AddQuestionsDialog({
  open,
  onClose,
  testId,
}: {
  open: boolean;
  onClose: () => void;
  testId: string;
}) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data: questions } = useQuery({
    queryKey: ["admin-questions-picker", search],
    queryFn: () => questionApi.list(search ? { search } : undefined),
    enabled: open,
  });

  const attachMutation = useMutation({
    mutationFn: () => attachQuestions(testId, Array.from(selected)),
    onSuccess: () => {
      toast.success("Questions attached");
      queryClient.invalidateQueries({ queryKey: ["test-questions", testId] });
      setSelected(new Set());
      onClose();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not attach questions.")),
  });

  return (
    <Dialog open={open} onClose={onClose} title="Add questions">
      <div className="space-y-4">
        <Input placeholder="Search question text" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="max-h-72 space-y-1.5 overflow-y-auto">
          {(questions ?? []).map((q) => (
            <label key={q.id} className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 hover:bg-surface-alt">
              <input
                type="checkbox"
                checked={selected.has(q.id)}
                onChange={() =>
                  setSelected((prev) => {
                    const next = new Set(prev);
                    if (next.has(q.id)) next.delete(q.id);
                    else next.add(q.id);
                    return next;
                  })
                }
                className="mt-0.5 accent-gold"
              />
              <span className="text-xs text-fg">{q.question_text}</span>
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={() => attachMutation.mutate()}
          disabled={selected.size === 0 || attachMutation.isPending}
          className="h-10 w-full rounded-md bg-gold text-sm font-semibold text-gold-ink disabled:opacity-60"
        >
          {attachMutation.isPending ? "Attaching..." : `Attach ${selected.size || ""} question(s)`}
        </button>
      </div>
    </Dialog>
  );
}

export default function AdminTestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);

  const { data: test } = useQuery({ queryKey: ["admin-test", id], queryFn: () => testApi.get(id) });
  const { data: testQuestions, isLoading } = useQuery({
    queryKey: ["test-questions", id],
    queryFn: () => getTestQuestions(id),
  });

  const locked = (test?.total_attempts_count ?? 0) > 0;

  const publishMutation = useMutation({
    mutationFn: () => publishTest(id),
    onSuccess: () => {
      toast.success("Test published");
      queryClient.invalidateQueries({ queryKey: ["admin-test", id] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not publish test.")),
  });

  const archiveMutation = useMutation({
    mutationFn: () => archiveTest(id),
    onSuccess: () => {
      toast.success("Test archived");
      queryClient.invalidateQueries({ queryKey: ["admin-test", id] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not archive test.")),
  });

  const autoAttachMutation = useMutation({
    mutationFn: () => autoAttachQuestions(id),
    onSuccess: (rows) => {
      toast.success(`${rows.length} question(s) attached from scope`);
      queryClient.invalidateQueries({ queryKey: ["test-questions", id] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not auto-attach questions.")),
  });

  const removeMutation = useMutation({
    mutationFn: (questionId: string) => removeTestQuestion(id, questionId),
    onSuccess: () => {
      toast.success("Question removed");
      queryClient.invalidateQueries({ queryKey: ["test-questions", id] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not remove question.")),
  });

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Exam management", href: "/admin/scheduler" }, { label: test?.title ?? "" }]} />

      <Card className="flex items-center justify-between p-5">
        <div>
          <h1 className="font-heading text-base font-semibold text-fg">{test?.title}</h1>
          {test && (
            <span
              className={cn(
                "mt-2 inline-block rounded-[5px] px-2.5 py-1 font-mono text-[11px] font-medium",
                STATUS_BADGE[test.status],
              )}
            >
              {test.status}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending || test?.status === "LIVE"}
            className="h-9 rounded-md border border-border px-4 text-[11.5px] font-semibold text-fg disabled:opacity-50"
          >
            Publish
          </button>
          <button
            type="button"
            onClick={() => archiveMutation.mutate()}
            disabled={archiveMutation.isPending || test?.status === "ARCHIVED"}
            className="h-9 rounded-md border border-border px-4 text-[11.5px] font-semibold text-fg disabled:opacity-50"
          >
            Archive
          </button>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-fg">Questions</h2>
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            disabled={locked}
            className="h-8 rounded-md border border-border px-4 text-[11.5px] font-semibold text-fg disabled:opacity-50"
          >
            Add questions
          </button>
          <button
            type="button"
            onClick={() => autoAttachMutation.mutate()}
            disabled={locked || autoAttachMutation.isPending}
            className="h-8 rounded-md border border-border px-4 text-[11.5px] font-semibold text-fg disabled:opacity-50"
          >
            Auto-attach
          </button>
        </div>

        <p className="mt-4 text-xs text-muted-fg">{testQuestions?.length ?? 0} questions attached</p>

        {locked && (
          <span className="mt-3 inline-block rounded-[5px] bg-danger-bg px-3 py-1 font-mono text-[11px] font-medium text-danger-fg">
            Locked — {test?.total_attempts_count} attempt(s)
          </span>
        )}

        {!locked && (
          <div className="mt-4 space-y-2">
            {isLoading && <p className="text-sm text-muted-fg">Loading questions…</p>}
            {(testQuestions ?? []).map((row) => (
              <div key={row.id} className="flex items-center justify-between rounded-md border border-border px-4 py-2.5">
                <span className="text-xs text-fg">{row.question_text}</span>
                <button
                  type="button"
                  onClick={() => removeMutation.mutate(row.question)}
                  className="pl-4 text-[11px] font-medium text-danger-fg"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AddQuestionsDialog open={addOpen} onClose={() => setAddOpen(false)} testId={id} />
    </div>
  );
}
