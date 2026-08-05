"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AttemptsListDialog } from "@/features/test/AttemptsListDialog";
import { TestFormDialog } from "@/features/test/TestFormDialog";
import { TestStatusMenu } from "@/features/test/TestStatusMenu";
import { adminExamApi } from "@/services/exam.service";
import { adminTestApi, type TestWritePayload } from "@/services/test.service";
import { getApiErrorMessage } from "@/utils/api-error";
import type { Test } from "@/types/test";

export default function AdminSchedulerPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: exams } = useQuery({ queryKey: ["admin-exams"], queryFn: () => adminExamApi.list() });
  const { data: tests, isLoading } = useQuery({ queryKey: ["admin-tests"], queryFn: () => adminTestApi.list() });

  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editing, setEditing] = useState<Test | null>(null);
  const [attemptsTarget, setAttemptsTarget] = useState<Test | null>(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
  }

  const createMutation = useMutation({
    mutationFn: (payload: TestWritePayload) => adminTestApi.create(payload),
    onSuccess: () => {
      toast.success("Test created");
      setFormOpen(false);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: TestWritePayload) => adminTestApi.update(editing!.id, payload),
    onSuccess: () => {
      toast.success("Test updated");
      setFormOpen(false);
      setEditing(null);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => adminTestApi.publish(id),
    onSuccess: () => {
      toast.success("Test published");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => adminTestApi.archive(id),
    onSuccess: () => {
      toast.success("Test archived");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Exam Management</h1>
          <p className="text-sm text-muted-foreground">Click a test to manage its questions.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormKey((k) => k + 1);
            setFormOpen(true);
          }}
        >
          Add Test
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <DataTable<Test>
          columns={[
            { header: "Title", render: (row) => row.title },
            { header: "Exam", render: (row) => row.exam_name },
            {
              header: "Scope",
              render: (row) => row.topic_name ?? row.chapter_name ?? row.subject_name ?? "Full exam",
            },
            { header: "Type", render: (row) => <Badge variant="secondary">{row.test_type}</Badge> },
            {
              header: "Scheduled",
              render: (row) =>
                row.start_time ? (
                  <span className="text-xs">
                    {new Date(row.start_time).toLocaleString()}
                    {row.end_time && <> – {new Date(row.end_time).toLocaleString()}</>}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Not scheduled</span>
                ),
            },
            {
              header: "Status",
              render: (row) => (
                <div onClick={(e) => e.stopPropagation()}>
                  <TestStatusMenu
                    test={row}
                    onPublish={() => publishMutation.mutate(row.id)}
                    onArchive={() => archiveMutation.mutate(row.id)}
                  />
                </div>
              ),
            },
            { header: "Questions", render: (row) => row.question_count },
            { header: "Pricing", render: (row) => (row.is_paid ? `${row.credit_cost} credits` : "Free") },
            {
              header: "Attempted By",
              render: (row) => (
                <div onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    title="Attempted by"
                    aria-label="Attempted by"
                    onClick={() => setAttemptsTarget(row)}
                  >
                    <Eye />
                  </Button>
                </div>
              ),
            },
          ]}
          rows={tests ?? []}
          onRowClick={(row) => router.push(`/admin-dashboard/scheduler/${row.id}`)}
          onEdit={(row) => {
            setEditing(row);
            setFormKey((k) => k + 1);
            setFormOpen(true);
          }}
        />
      )}

      <TestFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        exams={exams ?? []}
        editing={editing}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={async (payload) => {
          if (editing) {
            await updateMutation.mutateAsync(payload);
          } else {
            await createMutation.mutateAsync(payload);
          }
        }}
      />

      <AttemptsListDialog test={attemptsTarget} onOpenChange={(open) => !open && setAttemptsTarget(null)} />
    </div>
  );
}
