"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AttachQuestionsDialog } from "@/features/test/AttachQuestionsDialog";
import { AttemptsListDialog } from "@/features/test/AttemptsListDialog";
import { AutoAttachDialog, type AutoAttachOptions } from "@/features/test/AutoAttachDialog";
import { TestFormDialog } from "@/features/test/TestFormDialog";
import { TestStatusMenu } from "@/features/test/TestStatusMenu";
import { adminExamApi } from "@/services/exam.service";
import { adminTestApi, type TestWritePayload } from "@/services/test.service";
import { getApiErrorMessage } from "@/utils/api-error";

interface TestDetailClientProps {
  testId: string;
}

export function TestDetailClient({ testId }: TestDetailClientProps) {
  const queryClient = useQueryClient();
  const { data: exams } = useQuery({ queryKey: ["admin-exams"], queryFn: () => adminExamApi.list() });
  const { data: test, isLoading } = useQuery({
    queryKey: ["admin-test", testId],
    queryFn: () => adminTestApi.get(testId),
  });
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ["admin-test-questions", testId],
    queryFn: () => adminTestApi.getQuestions(testId),
  });

  const [editOpen, setEditOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [attachOpen, setAttachOpen] = useState(false);
  const [autoAttachOpen, setAutoAttachOpen] = useState(false);
  const [attemptsOpen, setAttemptsOpen] = useState(false);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-test", testId] });
    queryClient.invalidateQueries({ queryKey: ["admin-test-questions", testId] });
    queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
  }

  const updateMutation = useMutation({
    mutationFn: (payload: TestWritePayload) => adminTestApi.update(testId, payload),
    onSuccess: () => {
      toast.success("Test updated");
      setEditOpen(false);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const publishMutation = useMutation({
    mutationFn: () => adminTestApi.publish(testId),
    onSuccess: () => {
      toast.success("Test published");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const archiveMutation = useMutation({
    mutationFn: () => adminTestApi.archive(testId),
    onSuccess: () => {
      toast.success("Test archived");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const attachMutation = useMutation({
    mutationFn: (questionIds: string[]) => adminTestApi.attachQuestions(testId, questionIds),
    onSuccess: () => {
      toast.success("Questions attached");
      setAttachOpen(false);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const autoAttachMutation = useMutation({
    mutationFn: (options: AutoAttachOptions) => adminTestApi.autoAttach(testId, options),
    onSuccess: (data) => {
      toast.success(data.message ?? "Questions auto-attached from scope");
      setAutoAttachOpen(false);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const removeMutation = useMutation({
    mutationFn: (questionId: string) => adminTestApi.removeQuestion(testId, questionId),
    onSuccess: () => {
      toast.success("Question removed");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  if (isLoading || !test) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const isLocked = test.total_attempts_count > 0;
  const questionList = questions ?? [];

  return (
    <div className="space-y-6 p-8">
      <Link href="/admin-dashboard/scheduler" className="text-sm text-muted-foreground hover:underline">
        &larr; Back to Scheduler
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{test.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{test.exam_name}</Badge>
            <Badge variant="secondary">
              {test.topic_name ?? test.chapter_name ?? test.subject_name ?? "Full exam"}
            </Badge>
            <Badge variant="secondary">{test.test_type}</Badge>
            <TestStatusMenu test={test} onPublish={() => publishMutation.mutate()} onArchive={() => archiveMutation.mutate()} />
            {isLocked && <Badge variant="destructive">Locked — {test.total_attempts_count} attempt(s)</Badge>}
          </div>
          {test.start_time && (
            <p className="text-xs text-muted-foreground">
              {new Date(test.start_time).toLocaleString()}
              {test.end_time && <> – {new Date(test.end_time).toLocaleString()}</>}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setFormKey((k) => k + 1);
              setEditOpen(true);
            }}
          >
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => setAttemptsOpen(true)}>
            <Eye />
            Attempted By
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4">
          <div>
            <h2 className="font-medium">Questions ({questionList.length})</h2>
            {isLocked && (
              <p className="text-xs text-muted-foreground">
                Question set is locked — a student has already attempted this test, so it can no longer be changed.
              </p>
            )}
          </div>
          {!isLocked && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setAutoAttachOpen(true)}>
                Auto-attach
              </Button>
              <Button size="sm" onClick={() => setAttachOpen(true)}>
                Add Questions
              </Button>
            </div>
          )}
        </div>

        <div className="p-4">
          {questionsLoading ? (
            <p className="text-sm text-muted-foreground">Loading questions...</p>
          ) : questionList.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No questions added yet. Use Auto-attach to pull them in from this test&apos;s scope, or add
                questions manually.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setAutoAttachOpen(true)}>
                  Auto-attach
                </Button>
                <Button onClick={() => setAttachOpen(true)}>Add Questions</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {questionList.map((q, index) => (
                <div key={q.id} className="rounded-md border p-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-xs text-muted-foreground">{index + 1}.</span>
                    <span className="flex-1 font-medium">{q.question_text}</span>
                    {!isLocked && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="shrink-0 text-destructive hover:text-destructive"
                        disabled={removeMutation.isPending}
                        onClick={() => removeMutation.mutate(q.question)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="mt-2 ml-6 grid gap-1.5 sm:grid-cols-2">
                    {[...q.options]
                      .sort((a, b) => a.order - b.order)
                      .map((option) => (
                        <div
                          key={option.id}
                          className={cn(
                            "flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs",
                            option.is_correct
                              ? "border-green-600/40 bg-green-600/10 text-green-700 dark:text-green-400"
                              : "border-border text-muted-foreground",
                          )}
                        >
                          {option.is_correct && <Check className="size-3 shrink-0" />}
                          <span>{option.option_text}</span>
                        </div>
                      ))}
                  </div>

                  {q.explanation && (
                    <p className="mt-2 ml-6 text-xs text-muted-foreground">
                      <span className="font-medium">Explanation: </span>
                      {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TestFormDialog
        key={formKey}
        open={editOpen}
        onOpenChange={setEditOpen}
        exams={exams ?? []}
        editing={test}
        isSubmitting={updateMutation.isPending}
        onSubmit={async (payload) => {
          await updateMutation.mutateAsync(payload);
        }}
      />

      <AttachQuestionsDialog
        open={attachOpen}
        onOpenChange={setAttachOpen}
        test={test}
        onAttach={(ids) => attachMutation.mutateAsync(ids)}
        isSubmitting={attachMutation.isPending}
      />

      <AttemptsListDialog test={attemptsOpen ? test : null} onOpenChange={(open) => !open && setAttemptsOpen(false)} />

      <AutoAttachDialog
        test={autoAttachOpen ? test : null}
        onOpenChange={(open) => !open && setAutoAttachOpen(false)}
        onConfirm={(options) => autoAttachMutation.mutate(options)}
        isSubmitting={autoAttachMutation.isPending}
      />
    </div>
  );
}
