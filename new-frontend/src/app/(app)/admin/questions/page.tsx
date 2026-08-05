"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { QuestionFormDialog } from "@/components/admin/QuestionFormDialog";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { adminCrud } from "@/services/admin-crud";
import type { AdminQuestion } from "@/types/question";

const questionApi = adminCrud<AdminQuestion>("questions");

const DIFFICULTY_CLASS: Record<string, string> = {
  EASY: "text-success-fg",
  MEDIUM: "text-warning-fg",
  HARD: "text-danger-fg",
};

export default function AdminQuestionsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminQuestion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["admin-questions", search],
    queryFn: () => questionApi.list(search ? { search } : undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: questionApi.remove,
    onSuccess: () => {
      toast.success("Question deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not delete question.")),
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          placeholder="Search question text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[280px]"
        />
        <div className="flex gap-3">
          <Link href="/admin/questions/import" className={buttonVariants({ variant: "outline" })}>
            Bulk upload
          </Link>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
            className={buttonVariants()}
          >
            Add question
          </button>
        </div>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-border text-[11.5px] font-semibold text-muted-fg">
              <th className="px-6 py-3">Question</th>
              <th className="px-4 py-3">Topic</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Marks</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(questions ?? []).map((question) => (
              <tr key={question.id} className="border-b border-border/60 last:border-none">
                <td className="max-w-xs truncate px-6 py-3 text-fg">{question.question_text}</td>
                <td className="px-4 py-3 text-fg">{question.topic_name}</td>
                <td className={cn("px-4 py-3", DIFFICULTY_CLASS[question.difficulty])}>
                  {question.difficulty.charAt(0) + question.difficulty.slice(1).toLowerCase()}
                </td>
                <td className="px-4 py-3 text-fg">{question.marks}</td>
                <td className="px-6 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(question);
                      setDialogOpen(true);
                    }}
                    className="mr-3 font-medium text-accent-fg"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete this question?")) deleteMutation.mutate(question.id);
                    }}
                    className="font-medium text-danger-fg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p className="p-4 text-sm text-muted-fg">Loading questions…</p>}
        {!isLoading && questions?.length === 0 && <p className="p-4 text-sm text-muted-fg">No questions found.</p>}
      </Card>

      <QuestionFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} question={editing} />
    </div>
  );
}
