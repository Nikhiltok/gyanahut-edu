"use client";

import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { StudentGuard } from "@/components/common/StudentGuard";
import { cn } from "@/lib/utils";
import { getTest, saveProgress, startTest, submitTest } from "@/services/tests.service";
import type { PublicQuestion } from "@/types/test";

function formatClock(totalSeconds: number) {
  const m = Math.floor(Math.max(0, totalSeconds) / 60);
  const s = Math.max(0, totalSeconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type PaletteStatus = "current" | "review" | "answered" | "skipped" | "unvisited";

function ExamTakingContent() {
  const { testId } = useParams<{ testId: string }>();
  const router = useRouter();

  const { data: test } = useQuery({ queryKey: ["test", testId], queryFn: () => getTest(testId) });

  const [loaded, setLoaded] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());
  const [, forceTick] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    startTest(testId)
      .then((response) => {
        if (response.expired) {
          toast.error("This attempt already expired and was auto-submitted.");
          router.replace(`/dashboard/result/${response.attempt_id}`);
          return;
        }
        setAttemptId(response.attempt_id);
        setQuestions(response.questions);
        setCurrentIndex(response.current_question_index);
        setAnswers(Object.fromEntries(response.questions.map((q) => [q.id, response.answers[q.id] ?? null])));
        setVisited(new Set(Object.keys(response.answers)));
        setRemainingSeconds(response.remaining_seconds);
        setQuestionStartedAt(Date.now());
        setLoaded(true);
      })
      .catch((error: unknown) => {
        if (isAxiosError(error) && error.response?.status === 402) {
          const shortfall = (error.response.data?.errors as { shortfall?: number } | undefined)?.shortfall ?? 0;
          toast.error("Not enough credits for this test.");
          router.replace(
            `/dashboard/recharge?shortfall=${shortfall}&redirect=${encodeURIComponent(`/exam-taking/${testId}`)}`,
          );
          return;
        }
        toast.error("Could not start this test.");
        router.replace("/dashboard");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (!loaded) return;
    setVisited((prev) => {
      if (!currentQuestion || prev.has(currentQuestion.id)) return prev;
      const next = new Set(prev);
      next.add(currentQuestion.id);
      return next;
    });
    setQuestionStartedAt(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, loaded]);

  const handleSubmitRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitRef.current();
          return 0;
        }
        return prev - 1;
      });
      forceTick((n) => n + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loaded]);

  async function persistAnswer(questionId: string, optionId: string | null, index: number) {
    if (!attemptId) return;
    try {
      await saveProgress(testId, attemptId, { question: questionId, option: optionId, current_question_index: index });
    } catch {
      // Autosave failures shouldn't interrupt the student — the final submit
      // payload carries every answer anyway, so a dropped autosave is only
      // relevant if they abandon and resume, which is a rare edge case.
    }
  }

  function selectOption(optionId: string) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
    persistAnswer(currentQuestion.id, optionId, currentIndex);
  }

  function clearSelection() {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: null }));
    persistAnswer(currentQuestion.id, null, currentIndex);
  }

  function toggleMarkForReview() {
    if (!currentQuestion) return;
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
      else next.add(currentQuestion.id);
      return next;
    });
  }

  async function handleSubmit() {
    if (!attemptId || isSubmitting) return;
    if (!window.confirm("Submit the test now? You won't be able to change your answers after this.")) return;
    setIsSubmitting(true);
    try {
      const result = await submitTest(testId, {
        attempt_id: attemptId,
        answers: questions.map((q) => ({ question: q.id, option: answers[q.id] ?? null })),
      });
      router.replace(`/dashboard/result/${result.attempt_id}`);
    } catch {
      toast.error("Could not submit the test. Please try again.");
      setIsSubmitting(false);
    }
  }

  handleSubmitRef.current = handleSubmit;

  const answeredCount = useMemo(() => Object.values(answers).filter(Boolean).length, [answers]);

  if (!loaded || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-sm text-muted-fg">Loading test…</p>
      </div>
    );
  }

  function paletteStatus(questionId: string): PaletteStatus {
    if (questionId === currentQuestion.id) return "current";
    if (markedForReview.has(questionId)) return "review";
    if (answers[questionId]) return "answered";
    if (visited.has(questionId)) return "skipped";
    return "unvisited";
  }

  const paletteClasses: Record<PaletteStatus, string> = {
    current: "border-gold bg-gold text-gold-ink",
    review: "border-warning-fg/40 bg-warning-bg text-warning-fg",
    answered: "border-success-fg/40 bg-success-bg text-success-fg",
    skipped: "border-danger-fg/40 bg-danger-bg text-danger-fg",
    unvisited: "border-border bg-surface text-fg",
  };

  const paletteLegend: { status: PaletteStatus; label: string; swatch: string }[] = [
    { status: "answered", label: "Answered", swatch: "bg-success-fg" },
    { status: "skipped", label: "Not answered", swatch: "bg-danger-fg" },
    { status: "review", label: "Marked for review", swatch: "bg-warning-fg" },
    { status: "current", label: "Current question", swatch: "bg-gold" },
    { status: "unvisited", label: "Not visited", swatch: "bg-surface border border-border" },
  ];

  const spentSeconds = Math.floor((Date.now() - questionStartedAt) / 1000);
  const progressPct = (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-screen bg-bg pb-10">
      <header className="flex flex-wrap items-center gap-4 border-b border-border bg-surface px-8 py-4">
        <div>
          <h1 className="font-heading text-[15px] font-semibold text-fg">{test?.title}</h1>
          {test?.negative_marking && (
            <span className="mt-1 inline-block rounded-[5px] bg-danger-bg px-3 py-1 font-mono text-[11px] font-medium text-danger-fg">
              Negative marking
            </span>
          )}
        </div>

        <span className="ml-auto rounded-full bg-danger-fg px-4 py-1.5 font-mono text-sm font-semibold text-white">
          {formatClock(remainingSeconds)}
        </span>

        <span className="text-[12.5px] text-muted-fg">
          Progress — {answeredCount} of {questions.length} answered
        </span>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="rounded-md bg-gold px-6 py-2 text-[12.5px] font-semibold text-gold-ink disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit test"}
        </button>
      </header>

      <div className="h-1 w-full bg-border">
        <div className="h-1 bg-gold transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="mx-auto mt-6 grid max-w-[1216px] grid-cols-1 gap-6 px-8 lg:grid-cols-[1fr_284px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-[5px] bg-chip-bg px-3 py-1 font-mono text-[11px] font-medium text-chip-fg">
              Q. {currentIndex + 1}
            </span>
            <span className="text-[11.5px] text-success-fg">+{currentQuestion.marks} marks</span>
            {test?.negative_marking && (
              <span className="text-[11.5px] text-danger-fg">
                −{currentQuestion.negative_marks || test.negative_marks} mark(s)
              </span>
            )}
            <span className="rounded-[5px] bg-warning-bg px-3 py-1 font-mono text-[11px] font-medium text-warning-fg">
              {currentQuestion.difficulty.charAt(0) + currentQuestion.difficulty.slice(1).toLowerCase()}
            </span>
          </div>

          <p className="mt-3 font-mono text-[11px] text-muted-fg">Spent: {formatClock(spentSeconds)}</p>

          <p className="mt-5 whitespace-pre-wrap text-[14.5px] leading-relaxed text-fg">
            {currentQuestion.question_text}
          </p>

          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option, index) => {
              const selected = answers[currentQuestion.id] === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectOption(option.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-[13px] text-fg transition-colors",
                    selected
                      ? "border-success-fg bg-success-bg text-success-fg"
                      : "border-border bg-surface hover:border-gold/50",
                  )}
                >
                  <span>
                    {String.fromCharCode(65 + index)}. {option.option_text}
                  </span>
                  {selected && <span className="text-success-fg">✓</span>}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="h-9 rounded-md border border-border px-4 text-[11.5px] font-semibold text-fg disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="h-9 rounded-md border border-border px-4 text-[11.5px] font-semibold text-fg"
            >
              Clear selection
            </button>
            <button
              type="button"
              onClick={toggleMarkForReview}
              className="h-9 rounded-md border border-border px-4 text-[11.5px] font-semibold text-fg"
            >
              {markedForReview.has(currentQuestion.id) ? "Unmark review" : "Mark for review"}
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
              disabled={currentIndex === questions.length - 1}
              className="h-9 rounded-md border border-border px-4 text-[11.5px] font-semibold text-fg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-[10px] border border-border bg-surface p-4">
          <h3 className="text-[13px] font-semibold text-fg">Question palette</h3>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "flex h-[26px] items-center justify-center rounded-[5px] border text-[10px] font-medium",
                  paletteClasses[paletteStatus(q.id)],
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-3">
            {paletteLegend.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <span className={cn("h-3 w-3 shrink-0 rounded-[3px]", item.swatch)} />
                <span className="text-[11px] text-muted-fg">{item.label}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function ExamTakingPage() {
  return (
    <StudentGuard>
      <ExamTakingContent />
    </StudentGuard>
  );
}
