"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/common/DataTable";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionFormDialog, type QuestionDraft } from "@/features/questions/QuestionFormDialog";
import { adminTopicApi } from "@/services/exam.service";
import { adminQuestionApi } from "@/services/question.service";
import { getApiErrorMessage } from "@/utils/api-error";
import type { Question } from "@/types/question";

export default function AdminQuestionsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editing, setEditing] = useState<Question | null>(null);
  const [deleting, setDeleting] = useState<Question | null>(null);

  const { data: topics } = useQuery({ queryKey: ["admin-topics"], queryFn: () => adminTopicApi.list() });
  const { data: questions, isLoading } = useQuery({
    queryKey: ["admin-questions", search],
    queryFn: () => adminQuestionApi.list(search ? { search } : undefined),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
  }

  const createMutation = useMutation({
    mutationFn: (draft: QuestionDraft) => adminQuestionApi.create(draft),
    onSuccess: () => {
      toast.success("Question created");
      setFormOpen(false);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: (draft: QuestionDraft) => adminQuestionApi.update(editing!.id, draft),
    onSuccess: () => {
      toast.success("Question updated");
      setFormOpen(false);
      setEditing(null);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (question: Question) => adminQuestionApi.remove(question.id),
    onSuccess: () => {
      toast.success("Question deleted");
      setDeleting(null);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Questions</h1>
        <div className="flex gap-2">
          <Button variant="outline" render={<Link href="/admin-dashboard/questions/import" />}>
            Bulk Upload
          </Button>
          <Button
            onClick={() => {
              setEditing(null);
              setFormKey((k) => k + 1);
              setFormOpen(true);
            }}
          >
            Add Question
          </Button>
        </div>
      </div>

      <Input placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <DataTable<Question>
          columns={[
            { header: "Question", render: (row) => <span className="line-clamp-1 max-w-md">{row.question_text}</span> },
            { header: "Topic", render: (row) => row.topic_name },
            { header: "Difficulty", render: (row) => <Badge variant="secondary">{row.difficulty}</Badge> },
            { header: "Marks", render: (row) => row.marks },
          ]}
          rows={questions ?? []}
          onEdit={(row) => {
            setEditing(row);
            setFormKey((k) => k + 1);
            setFormOpen(true);
          }}
          onDelete={(row) => setDeleting(row)}
        />
      )}

      <QuestionFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        topics={topics ?? []}
        initial={editing}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={async (draft) => {
          if (editing) {
            await updateMutation.mutateAsync(draft);
          } else {
            await createMutation.mutateAsync(draft);
          }
        }}
      />

      <DeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting)}
        isDeleting={deleteMutation.isPending}
        title="Delete this question?"
      />
    </div>
  );
}
