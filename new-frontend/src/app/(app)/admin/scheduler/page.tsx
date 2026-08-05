"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { adminCrud } from "@/services/admin-crud";
import { getChapters, getExams, getSubjects } from "@/services/exam.service";
import type { Test } from "@/types/test";

const testApi = adminCrud<Test>("scheduler");

const TEST_TYPES = ["MOCK", "LIVE", "PREVIOUS_YEAR"];

const STATUS_CLASS: Record<string, string> = {
  DRAFT: "text-muted-fg",
  SCHEDULED: "text-warning-fg",
  LIVE: "text-danger-fg",
  COMPLETED: "text-success-fg",
  ARCHIVED: "text-muted-fg",
};

export default function AdminSchedulerPage() {
  const queryClient = useQueryClient();
  const { data: tests, isLoading } = useQuery({ queryKey: ["admin-tests"], queryFn: () => testApi.list() });
  const { data: exams } = useQuery({ queryKey: ["exams"], queryFn: () => getExams() });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [examId, setExamId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [testType, setTestType] = useState("MOCK");
  const [duration, setDuration] = useState(60);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [negativeMarks, setNegativeMarks] = useState(0.25);
  const [isPaid, setIsPaid] = useState(false);
  const [creditCost, setCreditCost] = useState(10);

  const { data: subjects } = useQuery({
    queryKey: ["subjects", examId],
    queryFn: () => getSubjects(examId),
    enabled: !!examId,
  });
  const { data: chapters } = useQuery({
    queryKey: ["chapters", subjectId],
    queryFn: () => getChapters(subjectId),
    enabled: !!subjectId,
  });

  useEffect(() => {
    if (!dialogOpen) return;
    setTitle("");
    setExamId("");
    setSubjectId("");
    setChapterId("");
    setTestType("MOCK");
    setDuration(60);
    setMaxAttempts(1);
    setNegativeMarking(false);
    setNegativeMarks(0.25);
    setIsPaid(false);
    setCreditCost(10);
  }, [dialogOpen]);

  const createMutation = useMutation({
    mutationFn: () =>
      testApi.create({
        title,
        exam: examId,
        subject: subjectId || undefined,
        chapter: chapterId || undefined,
        test_type: testType,
        duration,
        max_attempts: maxAttempts,
        negative_marking: negativeMarking,
        negative_marks: negativeMarking ? negativeMarks : 0,
        is_paid: isPaid,
        credit_cost: isPaid ? creditCost : undefined,
      }),
    onSuccess: () => {
      toast.success("Test created");
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
      setDialogOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not create test.")),
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button type="button" onClick={() => setDialogOpen(true)} className={buttonVariants()}>
          Add test
        </button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-border text-[11.5px] font-semibold text-muted-fg">
              <th className="px-6 py-3">Title</th>
              <th className="px-4 py-3">Exam</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Qs</th>
              <th className="px-6 py-3">Pricing</th>
            </tr>
          </thead>
          <tbody>
            {(tests ?? []).map((test) => (
              <tr key={test.id} className="border-b border-border/60 last:border-none">
                <td className="px-6 py-3 text-fg">
                  <Link href={`/admin/scheduler/${test.id}`} className="font-medium text-accent-fg">
                    {test.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-fg">{test.exam_name}</td>
                <td className="px-4 py-3 text-fg">{test.test_type}</td>
                <td className={cn("px-4 py-3", STATUS_CLASS[test.status])}>{test.status}</td>
                <td className="px-4 py-3 text-fg">{test.question_count}</td>
                <td className="px-6 py-3 text-fg">
                  {test.is_paid && test.credit_cost != null ? `${test.credit_cost} credits` : "Free"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p className="p-4 text-sm text-muted-fg">Loading tests…</p>}
        {!isLoading && tests?.length === 0 && <p className="p-4 text-sm text-muted-fg">No tests yet.</p>}
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Add test">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <div className="grid grid-cols-3 gap-3">
            <Select
              value={examId}
              onChange={(e) => {
                setExamId(e.target.value);
                setSubjectId("");
                setChapterId("");
              }}
              required
            >
              <option value="">Exam</option>
              {(exams ?? []).map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </Select>
            <Select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                setChapterId("");
              }}
              disabled={!examId}
            >
              <option value="">Full exam</option>
              {(subjects ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Select value={chapterId} onChange={(e) => setChapterId(e.target.value)} disabled={!subjectId}>
              <option value="">Full subject</option>
              {(chapters ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Select value={testType} onChange={(e) => setTestType(e.target.value)}>
              {TEST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
            <Input
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              placeholder="Duration (min)"
            />
            <Input
              type="number"
              min={1}
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(Number(e.target.value))}
              placeholder="Max attempts"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-fg">
            <input
              type="checkbox"
              checked={negativeMarking}
              onChange={(e) => setNegativeMarking(e.target.checked)}
              className="accent-gold"
            />
            Negative marking
            {negativeMarking && (
              <Input
                type="number"
                step="0.25"
                min={0}
                value={negativeMarks}
                onChange={(e) => setNegativeMarks(Number(e.target.value))}
                className="ml-2 w-24"
              />
            )}
          </label>

          <label className="flex items-center gap-2 text-xs text-fg">
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              className="accent-gold"
            />
            Paid test
            {isPaid && (
              <Input
                type="number"
                min={1}
                value={creditCost}
                onChange={(e) => setCreditCost(Number(e.target.value))}
                className="ml-2 w-24"
              />
            )}
          </label>

          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create test"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
