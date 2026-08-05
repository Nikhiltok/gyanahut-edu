"use client";

import { useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { adminChapterApi, adminSubjectApi, adminTopicApi } from "@/services/exam.service";
import type { TestWritePayload } from "@/services/test.service";
import type { Exam } from "@/types/exam";
import type { Test } from "@/types/test";

// PRACTICE is deliberately excluded — it's reserved for student self-practice
// (generated on-demand via the Infinite Test flow), never admin-scheduled, so
// the credit-pricing split between the two test origins stays unambiguous.
const TEST_TYPES = ["MOCK", "LIVE", "PREVIOUS_YEAR"];
// Sentinel for the Select's "no narrower scope" option — Select can't carry an
// empty-string value, so this is translated back to "" / null at submit time.
const FULL_SCOPE = "__FULL__";

// <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm" in local time, with no
// timezone suffix — different from the ISO strings the API sends/expects.
function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}

// End time isn't collected separately — it's always start time + duration.
function computeEndTime(startTime: string, durationMinutes: number): string | null {
  if (!startTime) return null;
  const start = new Date(startTime);
  return new Date(start.getTime() + durationMinutes * 60_000).toISOString();
}

interface TestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exams: Exam[];
  editing: Test | null;
  isSubmitting?: boolean;
  onSubmit: (payload: TestWritePayload) => Promise<void> | void;
}

export function TestFormDialog({ open, onOpenChange, exams, editing, isSubmitting, onSubmit }: TestFormDialogProps) {
  // Remounted via a changing `key` from the parent whenever `editing` changes,
  // so lazy initial state from `editing` is enough — same convention as EntityFormDialog.
  const [examId, setExamId] = useState(editing?.exam ?? "");
  const [subjectId, setSubjectId] = useState(editing?.subject ?? "");
  const [chapterId, setChapterId] = useState(editing?.chapter ?? "");
  const [topicId, setTopicId] = useState(editing?.topic ?? "");
  const [title, setTitle] = useState(editing?.title ?? "");
  const [testType, setTestType] = useState(editing?.test_type ?? "MOCK");
  const [duration, setDuration] = useState(editing?.duration ?? 30);
  const [startTime, setStartTime] = useState(toDatetimeLocal(editing?.start_time));
  const [maxAttempts, setMaxAttempts] = useState(editing?.max_attempts ?? 1);
  const [negativeMarking, setNegativeMarking] = useState(editing?.negative_marking ?? false);
  const [negativeMarks, setNegativeMarks] = useState(Number(editing?.negative_marks ?? 0));
  const [isPaid, setIsPaid] = useState(editing?.is_paid ?? false);
  const [creditCost, setCreditCost] = useState(Number(editing?.credit_cost ?? 0));

  const { data: subjects } = useQuery({
    queryKey: ["admin-subjects", examId],
    queryFn: () => adminSubjectApi.list({ exam: examId }),
    enabled: !!examId,
  });
  const { data: chapters } = useQuery({
    queryKey: ["admin-chapters", subjectId],
    queryFn: () => adminChapterApi.list({ subject: subjectId }),
    enabled: !!subjectId,
  });
  const { data: topics } = useQuery({
    queryKey: ["admin-topics", chapterId],
    queryFn: () => adminTopicApi.list({ chapter: chapterId }),
    enabled: !!chapterId,
  });

  const examItems = exams.map((e) => ({ value: e.id, label: e.name }));
  const subjectItems = [
    { value: FULL_SCOPE, label: "Full exam (all subjects)" },
    ...(subjects ?? []).map((s) => ({ value: s.id, label: s.name })),
  ];
  const chapterItems = [
    { value: FULL_SCOPE, label: "Full subject (all chapters)" },
    ...(chapters ?? []).map((c) => ({ value: c.id, label: c.name })),
  ];
  const topicItems = [
    { value: FULL_SCOPE, label: "Full chapter (all topics)" },
    ...(topics ?? []).map((t) => ({ value: t.id, label: t.name })),
  ];
  const testTypeItems = TEST_TYPES.map((t) => ({ value: t, label: t }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await onSubmit({
      exam: examId,
      subject: subjectId || null,
      chapter: chapterId || null,
      topic: topicId || null,
      title,
      test_type: testType,
      duration,
      start_time: fromDatetimeLocal(startTime),
      end_time: computeEndTime(startTime, duration),
      max_attempts: maxAttempts,
      negative_marking: negativeMarking,
      negative_marks: negativeMarks,
      is_paid: isPaid,
      credit_cost: isPaid ? creditCost : null,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Test" : "Add Test"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Exam</Label>
            <Select
              items={examItems}
              value={examId}
              onValueChange={(v) => {
                setExamId(v ?? "");
                setSubjectId("");
                setChapterId("");
                setTopicId("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select exam" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Scope: Subject (optional)</Label>
            <Select
              items={subjectItems}
              value={subjectId || FULL_SCOPE}
              onValueChange={(v) => {
                setSubjectId(v === FULL_SCOPE ? "" : (v ?? ""));
                setChapterId("");
                setTopicId("");
              }}
              disabled={!examId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Full exam" />
              </SelectTrigger>
              <SelectContent>
                {subjectItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Scope: Chapter (optional)</Label>
            <Select
              items={chapterItems}
              value={chapterId || FULL_SCOPE}
              onValueChange={(v) => {
                setChapterId(v === FULL_SCOPE ? "" : (v ?? ""));
                setTopicId("");
              }}
              disabled={!subjectId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Full subject" />
              </SelectTrigger>
              <SelectContent>
                {chapterItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Scope: Topic (optional)</Label>
            <Select
              items={topicItems}
              value={topicId || FULL_SCOPE}
              onValueChange={(v) => setTopicId(v === FULL_SCOPE ? "" : (v ?? ""))}
              disabled={!chapterId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Full chapter" />
              </SelectTrigger>
              <SelectContent>
                {topicItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-title">Title</Label>
            <Input id="test-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Test Type</Label>
            <Select items={testTypeItems} value={testType} onValueChange={(v) => setTestType(v ?? "MOCK")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEST_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-start">Start Time</Label>
            <Input
              id="test-start"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-duration">Duration (minutes)</Label>
            <Input
              id="test-duration"
              type="number"
              required
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
            {startTime && (
              <p className="text-xs text-muted-foreground">
                Ends at {new Date(computeEndTime(startTime, duration)!).toLocaleString()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-attempts">Max Attempts</Label>
            <Input
              id="test-attempts"
              type="number"
              required
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={negativeMarking} onCheckedChange={setNegativeMarking} id="negative-marking" />
            <Label htmlFor="negative-marking">Negative Marking</Label>
          </div>
          {negativeMarking && (
            <div className="space-y-2">
              <Label htmlFor="negative-marks">Negative Marks</Label>
              <Input
                id="negative-marks"
                type="number"
                value={negativeMarks}
                onChange={(e) => setNegativeMarks(Number(e.target.value))}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Switch checked={isPaid} onCheckedChange={setIsPaid} id="is-paid" />
            <Label htmlFor="is-paid">Paid (Credit Wallet)</Label>
          </div>
          {isPaid && (
            <div className="space-y-2">
              <Label htmlFor="credit-cost">Credit Cost</Label>
              <Input
                id="credit-cost"
                type="number"
                min={1}
                required={isPaid}
                value={creditCost}
                onChange={(e) => setCreditCost(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Credits a student must have to start this test — set independently of question count.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !examId || !title}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
