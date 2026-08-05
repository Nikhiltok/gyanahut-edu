"use client";

import { useQuery } from "@tanstack/react-query";
import { Download, Lightbulb, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { GradientBanner } from "@/components/common/GradientBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getResult } from "@/services/result.service";
import type { AnswerDetail } from "@/types/result";

const SUBJECT_BAR_COLORS = ["bg-[#721315]", "bg-secondary", "bg-tertiary", "bg-primary"];
const PAGE_SIZE = 3;

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function formatCandidateCount(count: number) {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
}

export function ResultClient({ attemptId }: { attemptId: string }) {
  const { data: result, isLoading } = useQuery({
    queryKey: ["result", attemptId],
    queryFn: () => getResult(attemptId),
  });
  const [filter, setFilter] = useState<"all" | "correct" | "wrong" | "skipped">("all");
  const [showAll, setShowAll] = useState(false);

  if (isLoading || !result) {
    return (
      <div className="w-full space-y-4 p-8">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const rankPercent =
    result.rank && result.total_candidates > 0 ? Math.ceil((result.rank / result.total_candidates) * 100) : null;

  const timeDelta = result.avg_time_taken != null ? result.avg_time_taken - result.time_taken : null;

  const subjectsWithAccuracy = result.subject_breakdown.map((s) => ({
    ...s,
    accuracy: s.total ? Math.round((s.correct / s.total) * 100) : 0,
  }));
  const rankedSubjects = [...subjectsWithAccuracy].sort((a, b) => a.accuracy - b.accuracy);
  const weakestSubject = rankedSubjects[0];
  const strongestSubject = rankedSubjects[rankedSubjects.length - 1];

  const filteredAnswers = result.answers.filter((a) => {
    if (filter === "correct") return a.is_correct;
    if (filter === "wrong") return !a.is_correct && !!a.selected_option;
    if (filter === "skipped") return !a.selected_option;
    return true;
  });
  const visibleAnswers = showAll ? filteredAnswers : filteredAnswers.slice(0, PAGE_SIZE);
  const remainingCount = filteredAnswers.length - visibleAnswers.length;

  return (
    <div className="w-full">
      <GradientBanner className="rounded-none px-6 pt-10 pb-16 sm:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{result.test_title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/85">
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium">{result.exam_name}</span>
              <span className="italic">
                Completed on {new Date(result.submitted_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">Total Score</p>
            <p className="font-heading text-2xl font-bold">
              {result.score} <span className="text-base font-medium text-white/70">/ {result.total_marks}</span>
            </p>
          </div>
        </div>
      </GradientBanner>

      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="space-y-1.5 py-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Accuracy</p>
              <p className="text-2xl font-bold text-secondary">{result.accuracy}%</p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f6e2d8]">
                <div
                  className="h-full rounded-full bg-secondary"
                  style={{ width: `${Math.min(Number(result.accuracy), 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-1 py-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Overall Rank</p>
              <p className="text-2xl font-bold text-tertiary">
                {result.rank ? `#${result.rank} / ${formatCandidateCount(result.total_candidates)}` : "—"}
              </p>
              <p className="flex items-center gap-1 text-xs text-emerald-600">
                {rankPercent && (
                  <>
                    <TrendingUp className="size-3.5" /> Top {rankPercent}% of candidates
                  </>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-1 py-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Time Taken</p>
              <p className="text-2xl font-bold">{formatDuration(result.time_taken)}</p>
              {timeDelta !== null && timeDelta !== 0 && (
                <p className="text-xs text-muted-foreground">
                  {formatDuration(Math.abs(timeDelta))} {timeDelta > 0 ? "faster" : "slower"} than avg.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-1.5 py-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Response Split</p>
              <ul className="space-y-0.5 text-sm">
                <li className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-600" /> {result.correct_answers} Correct
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-destructive" /> {result.wrong_answers} Wrong
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-muted-foreground/40" /> {result.skipped_answers} Skipped
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Subject Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjectsWithAccuracy.map((s, i) => (
                <div key={s.subject} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span>{s.subject}</span>
                    <span className="font-semibold">{s.accuracy}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", SUBJECT_BAR_COLORS[i % SUBJECT_BAR_COLORS.length])}
                      style={{ width: `${s.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" render={<Link href="/revision/wrong" />}>
                View Weak Topics
              </Button>
            </CardContent>
          </Card>

          {rankedSubjects.length >= 2 && (
            <Card className="bg-muted/30">
              <CardContent className="space-y-4 py-6">
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Lightbulb className="size-5" />
                  </span>
                  <div>
                    <p className="font-heading font-bold text-primary">Strategic Insight</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your <span className="font-medium text-foreground">{weakestSubject.subject}</span> accuracy (
                      {weakestSubject.accuracy}%) is your weakest area — focus your next practice sessions there.
                      Your <span className="font-medium text-emerald-600">{strongestSubject.subject}</span>{" "}
                      performance ({strongestSubject.accuracy}%) is strong — keep up the momentum.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Weakest Subject
                    </p>
                    <p className="mt-1 text-sm font-semibold">{weakestSubject.subject}</p>
                  </div>
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                      Strongest Subject
                    </p>
                    <p className="mt-1 text-sm font-semibold">{strongestSubject.subject}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base">Question-wise Analysis</CardTitle>
            <div className="flex items-center gap-2">
              <Select
                items={[
                  { value: "all", label: "All Questions" },
                  { value: "correct", label: "Correct" },
                  { value: "wrong", label: "Wrong" },
                  { value: "skipped", label: "Skipped" },
                ]}
                value={filter}
                onValueChange={(v) => {
                  setFilter((v as typeof filter) ?? "all");
                  setShowAll(false);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Questions</SelectItem>
                  <SelectItem value="correct">Correct</SelectItem>
                  <SelectItem value="wrong">Wrong</SelectItem>
                  <SelectItem value="skipped">Skipped</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary" onClick={() => toast.info("PDF export coming soon")}>
                <Download className="size-4" />
                Export PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {visibleAnswers.map((answer, index) => (
              <AnswerRow key={answer.id} answer={answer} index={index} />
            ))}
            {remainingCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="w-full py-2 text-center text-sm font-semibold text-primary hover:underline"
              >
                View {remainingCount} More Questions
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnswerRow({ answer, index }: { answer: AnswerDetail; index: number }) {
  const skipped = !answer.selected_option;
  const state = skipped ? "skipped" : answer.is_correct ? "correct" : "wrong";

  return (
    <div
      className={cn(
        "rounded-xl border-l-4 bg-muted/30 p-4",
        state === "skipped"
          ? "border-l-muted-foreground/40"
          : state === "correct"
            ? "border-l-emerald-500"
            : "border-l-destructive",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
            state === "skipped" ? "bg-muted-foreground/50" : state === "correct" ? "bg-emerald-600" : "bg-destructive",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1 space-y-2 text-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {answer.subject_name}
                </span>
                <span className="text-xs text-muted-foreground italic">{answer.question_type_display}</span>
              </div>
              <p className="font-medium">{answer.question_text}</p>
            </div>
            <p
              className={cn(
                "shrink-0 text-sm font-semibold",
                state === "skipped" ? "text-muted-foreground" : state === "correct" ? "text-emerald-600" : "text-destructive",
              )}
            >
              {state === "correct"
                ? `+${answer.marks} Mark${Number(answer.marks) === 1 ? "" : "s"}`
                : state === "skipped"
                  ? "0 Marks"
                  : `-${answer.negative_marks} Mark${Number(answer.negative_marks) === 1 ? "" : "s"}`}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div
              className={cn(
                "rounded-lg p-3",
                state === "skipped" ? "bg-background/70" : state === "correct" ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30",
              )}
            >
              <p className="text-xs text-muted-foreground">Your Answer</p>
              {skipped ? (
                <p className="text-muted-foreground italic">Not Answered</p>
              ) : (
                <p className={cn("font-medium", state === "correct" ? "text-emerald-700 dark:text-emerald-400" : "text-destructive")}>
                  {answer.selected_option_text}
                </p>
              )}
            </div>
            <div className="rounded-lg bg-background/70 p-3">
              <p className="text-xs text-muted-foreground">Correct Answer</p>
              <p className="font-medium">{answer.correct_option_text}</p>
            </div>
          </div>

          {answer.explanation && (
            <p className="rounded-lg bg-primary/5 p-2.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Explanation: </span>
              {answer.explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
