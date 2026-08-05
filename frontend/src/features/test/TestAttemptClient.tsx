"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { AlertTriangle, BarChart3, Bookmark, BookmarkPlus, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionPalette, type QuestionStatus } from "@/components/exam/QuestionPalette";
import { QuestionStopwatch } from "@/components/exam/QuestionStopwatch";
import { SubmitModal } from "@/components/exam/SubmitModal";
import { Timer } from "@/components/exam/Timer";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/utils/api-error";
import { resolveMediaUrl } from "@/utils/media";
import { addDifficultMark, getDifficultMarks, removeDifficultMark } from "@/services/question.service";
import { getTestDetail, saveProgress, startTest, submitTest } from "@/services/test.service";
import type { AnswerPayload } from "@/types/test";

const DIFFICULTY_BADGE_CLASSES: Record<string, string> = {
  EASY: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  MEDIUM: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  HARD: "bg-[#f6e2d8] text-[#721315]",
};

export function TestAttemptClient({ testId }: { testId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: test } = useQuery({ queryKey: ["test", testId], queryFn: () => getTestDetail(testId) });

  const { data: difficultMarks } = useQuery({ queryKey: ["difficult-marks"], queryFn: getDifficultMarks });
  const difficultMap = new Map((difficultMarks ?? []).map((m) => [m.question, m.id]));

  const markDifficultMutation = useMutation({
    mutationFn: (questionId: string) => addDifficultMark(questionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["difficult-marks"] }),
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not save this question")),
  });
  const unmarkDifficultMutation = useMutation({
    mutationFn: (markId: string) => removeDifficultMark(markId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["difficult-marks"] }),
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not update this question")),
  });

  // startTest is a non-idempotent POST (creates a new attempt server-side), so this
  // query is locked to fire exactly once per mount — no refetch-on-focus/retry, which
  // would otherwise silently spend another attempt against the student's max_attempts.
  const { data: session, isLoading: isStarting, error: startError } = useQuery({
    queryKey: ["test-start", testId],
    queryFn: () => startTest(testId),
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const isPaymentRequired = isAxiosError(startError) && startError.response?.status === 402;
  const shortfall =
    isAxiosError<{ errors?: { shortfall?: number } }>(startError) && startError.response?.status === 402
      ? startError.response.data?.errors?.shortfall
      : undefined;

  useEffect(() => {
    if (isPaymentRequired) {
      const params = new URLSearchParams({ redirect: `/test/${testId}` });
      if (shortfall) params.set("shortfall", String(shortfall));
      router.replace(`/payments/recharge?${params.toString()}`);
    } else if (session && "expired" in session) {
      toast.error("This attempt's time expired and was submitted automatically.");
      router.replace(`/result/${session.attempt_id}`);
    }
  }, [isPaymentRequired, router, testId, session, shortfall]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | undefined>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [timeUpModalOpen, setTimeUpModalOpen] = useState(false);
  // Tracks which questions have been viewed (besides the current one), to
  // distinguish "not visited" (gray) from "visited but skipped" (red) in the
  // palette. Only ever updated from goToIndex (an event handler), never an effect.
  const [visited, setVisited] = useState<Record<string, boolean>>({});

  const questions = session && !("expired" in session) ? session.questions : [];
  const currentQuestion = questions[currentIndex];

  // Hydrate from a resumed session exactly once — session is stable after the
  // first fetch (staleTime: Infinity), so this effect only ever fires once.
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!session || "expired" in session || hydratedRef.current || !session.resumed) return;
    hydratedRef.current = true;
    const seeded: Record<string, string> = {};
    for (const [questionId, optionId] of Object.entries(session.answers)) {
      if (optionId) seeded[questionId] = optionId;
    }
    setAnswers(seeded);
    setCurrentIndex(session.current_question_index);
    toast.info(`Resumed from Question ${session.current_question_index + 1}`);
  }, [session]);

  // Best-effort autosave — failures are swallowed silently, never surfaced to the
  // student and never block navigation. Debounced so rapid clicks don't spam the API.
  const saveProgressMutation = useMutation({
    mutationFn: (payload: { question: string; option: string | null; current_question_index: number }) =>
      saveProgress(testId, session!.attempt_id, payload),
    onSuccess: (result) => {
      if (result.expired) {
        toast.error("This attempt's time expired and was submitted automatically.");
        router.push(`/result/${session!.attempt_id}`);
      }
    },
    onError: () => {},
  });

  useEffect(() => {
    if (!session || "expired" in session || !currentQuestion) return;
    const timeout = setTimeout(() => {
      saveProgressMutation.mutate({
        question: currentQuestion.id,
        option: answers[currentQuestion.id] ?? null,
        current_question_index: currentIndex,
      });
    }, 800);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- saveProgressMutation identity changes every render; only re-run on actual answer/position changes
  }, [session, currentQuestion, answers, currentIndex]);

  function goToIndex(index: number) {
    const target = questions[index];
    if (target) setVisited((v) => (v[target.id] ? v : { ...v, [target.id]: true }));
    setCurrentIndex(index);
  }

  const submitMutation = useMutation({
    mutationFn: () => {
      const payload: AnswerPayload[] = questions.map((q) => ({
        question: q.id,
        option: answers[q.id] ?? null,
      }));
      return submitTest(testId, session!.attempt_id, payload);
    },
    onSuccess: (result) => {
      toast.success("Test submitted");
      router.push(`/result/${result.attempt_id}`);
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not submit test")),
  });

  if (isPaymentRequired) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (startError) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-8 text-center">
        <p className="text-lg font-semibold">Could not start this test</p>
        <p className="text-sm text-muted-foreground">
          {getApiErrorMessage(startError, "Something went wrong while starting this test.")}
        </p>
        <div className="flex justify-center gap-2">
          <Button variant="outline" render={<Link href="/exam-history" />}>
            View Exam History
          </Button>
          <Button render={<Link href="/tests/live" />}>Back to Live Tests</Button>
        </div>
      </div>
    );
  }

  if (isStarting || !session || "expired" in session) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const statuses: QuestionStatus[] = questions.map((q, i) => {
    const isAnswered = !!answers[q.id];
    const isMarked = !!marked[q.id];
    const isVisited = i === currentIndex || !!visited[q.id];
    if (isAnswered && isMarked) return "answered-marked";
    if (isMarked) return "marked";
    if (isAnswered) return "answered";
    if (isVisited) return "not-answered";
    return "not-visited";
  });

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <div className="sticky top-0 z-10 border-b bg-background px-6 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-lg font-bold">{test?.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {test?.test_type && <span>{test.test_type}</span>}
              {test?.negative_marking && (
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 font-medium text-destructive">
                  Negative marking
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Timer totalSeconds={session.remaining_seconds} onExpire={() => setTimeUpModalOpen(true)} />
            <div className="text-center">
              <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">Progress</p>
              <p className="text-sm font-bold">
                {answeredCount} of {questions.length} Answered
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-primary to-[#721315] hover:opacity-90"
              onClick={() => setSubmitModalOpen(true)}
            >
              Submit Test
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-3 h-1 w-full max-w-6xl overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="space-y-5 py-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f6e2d8] px-3 py-1 text-sm font-semibold text-foreground">
                    Q. {currentIndex + 1}
                  </span>
                  <span className="rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    +{currentQuestion.marks} Mark{Number(currentQuestion.marks) === 1 ? "" : "s"}
                  </span>
                  {test?.negative_marking && (
                    <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                      −{Number(currentQuestion.negative_marks) || Number(test.negative_marks)} Mark
                      {(Number(currentQuestion.negative_marks) || Number(test.negative_marks)) === 1 ? "" : "s"}
                    </span>
                  )}
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                      DIFFICULTY_BADGE_CLASSES[currentQuestion.difficulty] ?? "bg-muted text-muted-foreground",
                    )}
                  >
                    {currentQuestion.difficulty?.toLowerCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <QuestionStopwatch key={currentQuestion.id} />
                  {marked[currentQuestion.id] && (
                    <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      <Bookmark className="size-3" /> Marked for Review
                    </span>
                  )}
                  <button
                    type="button"
                    title="Save this question as difficult for later revision"
                    disabled={markDifficultMutation.isPending || unmarkDifficultMutation.isPending}
                    onClick={() => {
                      const markId = difficultMap.get(currentQuestion.id);
                      if (markId) unmarkDifficultMutation.mutate(markId);
                      else markDifficultMutation.mutate(currentQuestion.id);
                    }}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50",
                      difficultMap.has(currentQuestion.id)
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                        : "bg-muted text-muted-foreground hover:bg-amber-500/10 hover:text-amber-700",
                    )}
                  >
                    <AlertTriangle className="size-3" />
                    {difficultMap.has(currentQuestion.id) ? "Saved as difficult" : "Save as difficult"}
                  </button>
                </div>
              </div>
              <p className="text-base font-medium leading-relaxed">{currentQuestion.question_text}</p>
              {currentQuestion.image && (
                <div className="overflow-hidden rounded-xl border bg-muted/20 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveMediaUrl(currentQuestion.image) ?? undefined}
                    alt=""
                    className="mx-auto max-h-80 object-contain"
                  />
                </div>
              )}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, optionIndex) => {
                  const selected = answers[currentQuestion.id] === option.id;
                  const letter = String.fromCharCode(65 + optionIndex);
                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 transition-colors",
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background hover:border-primary/30 hover:bg-muted/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40 text-muted-foreground",
                        )}
                      >
                        {letter}
                      </span>
                      <input
                        type="radio"
                        className="sr-only"
                        name={`question-${currentQuestion.id}`}
                        checked={selected}
                        onChange={() => setAnswers((a) => ({ ...a, [currentQuestion.id]: option.id }))}
                      />
                      <span className={selected ? "font-medium" : ""}>{option.option_text}</span>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-background p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                disabled={currentIndex === 0}
                onClick={() => goToIndex(Math.max(currentIndex - 1, 0))}
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={!answers[currentQuestion.id]}
                onClick={() =>
                  setAnswers((a) => {
                    const next = { ...a };
                    delete next[currentQuestion.id];
                    return next;
                  })
                }
              >
                Clear Selection
              </Button>
              <Button
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:text-blue-400"
                onClick={() => setMarked((m) => ({ ...m, [currentQuestion.id]: !m[currentQuestion.id] }))}
              >
                <BookmarkPlus className="size-4" />
                {marked[currentQuestion.id] ? "Unmark" : "Mark for Review"}
              </Button>
              <Button
                variant="outline"
                disabled={currentIndex === questions.length - 1}
                onClick={() => goToIndex(Math.min(currentIndex + 1, questions.length - 1))}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <Button
              className="bg-gradient-to-r from-primary to-[#721315] hover:opacity-90"
              onClick={() => setSubmitModalOpen(true)}
            >
              Submit Test
            </Button>
          </div>
        </div>

        <div className="h-fit lg:sticky lg:top-24 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Question Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionPalette
                count={questions.length}
                currentIndex={currentIndex}
                statuses={statuses}
                onSelect={goToIndex}
              />
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full justify-center gap-2 border-primary/30 text-primary hover:bg-primary/5"
            onClick={() => toast.info("Formula sheet coming soon")}
          >
            <BarChart3 className="size-4" />
            View Formulas
          </Button>

          {(currentQuestion.difficulty === "HARD" || currentQuestion.difficulty === "MEDIUM") && (
            <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-blue-600" />
              <p>
                Remember: {currentQuestion.difficulty.toLowerCase()} questions like this one often reward extra
                care — read carefully, double-check your units, and don&apos;t rush.
              </p>
            </div>
          )}
        </div>
      </div>

      <SubmitModal
        open={submitModalOpen}
        onOpenChange={setSubmitModalOpen}
        answeredCount={answeredCount}
        totalCount={questions.length}
        onConfirm={() => submitMutation.mutate()}
        isSubmitting={submitMutation.isPending}
      />

      <ConfirmDialog
        open={timeUpModalOpen}
        onOpenChange={setTimeUpModalOpen}
        onConfirm={() => submitMutation.mutate()}
        title="Time's up!"
        description="Your test duration has ended. You can continue answering if you need more time, or submit right now."
        cancelLabel="Continue"
        confirmLabel="Submit Now"
      />
    </div>
  );
}
