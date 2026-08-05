"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getResult } from "@/services/attempts.service";

type Filter = "all" | "correct" | "wrong" | "skipped";

function answerStatus(answer: { is_correct: boolean; selected_option: string | null }) {
  if (!answer.selected_option) return "skipped" as const;
  return answer.is_correct ? ("correct" as const) : ("wrong" as const);
}

const STATUS_LABEL: Record<"correct" | "wrong" | "skipped", string> = {
  correct: "Correct",
  wrong: "Wrong",
  skipped: "Skipped",
};

const STATUS_CLASS: Record<"correct" | "wrong" | "skipped", string> = {
  correct: "text-success-fg",
  wrong: "text-danger-fg",
  skipped: "text-muted-fg",
};

export default function ResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [filter, setFilter] = useState<Filter>("all");
  const { data: result } = useQuery({ queryKey: ["result", attemptId], queryFn: () => getResult(attemptId) });

  if (!result) {
    return <p className="text-sm text-muted-fg">Loading result…</p>;
  }

  const strongest = result.subject_breakdown.length
    ? [...result.subject_breakdown].sort((a, b) => b.correct / b.total - a.correct / a.total)[0]
    : null;
  const weakest = result.subject_breakdown.length > 1
    ? [...result.subject_breakdown].sort((a, b) => a.correct / a.total - b.correct / b.total)[0]
    : null;

  const filteredAnswers = result.answers.filter((answer) => filter === "all" || answerStatus(answer) === filter);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Card className="flex items-center justify-between border-none bg-sidebar-bg p-7">
        <div>
          <h1 className="font-heading text-base font-semibold text-white">{result.test_title}</h1>
          <p className="mt-1.5 text-[11.5px] text-white/65">
            Completed on {new Date(result.submitted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>
        <span className="font-heading text-lg font-semibold text-gold">
          Total score: {result.score}/{result.total_marks}
        </span>
      </Card>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="border-none bg-surface-alt p-4">
          <p className="text-[11.5px] text-muted-fg">Accuracy</p>
          <p className="mt-2 font-heading text-[22px] font-semibold text-fg">{result.accuracy}%</p>
        </Card>
        <Card className="border-none bg-surface-alt p-4">
          <p className="text-[11.5px] text-muted-fg">Overall rank</p>
          <p className="mt-2 font-heading text-[22px] font-semibold text-fg">
            {result.rank ? `#${result.rank} / ${result.total_candidates.toLocaleString()}` : "Unranked"}
          </p>
        </Card>
        <Card className="border-none bg-surface-alt p-4">
          <p className="text-[11.5px] text-muted-fg">Time taken</p>
          <p className="mt-2 font-heading text-[22px] font-semibold text-fg">
            {Math.round(result.time_taken / 60)} min
          </p>
        </Card>
        <Card className="border-none bg-surface-alt p-4">
          <p className="text-[11.5px] text-muted-fg">Correct / wrong / skip</p>
          <p className="mt-2 font-heading text-[22px] font-semibold text-fg">
            {result.correct_answers} / {result.wrong_answers} / {result.skipped_answers}
          </p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-5">
          <h3 className="text-[13.5px] font-semibold text-fg">Subject breakdown</h3>
          <div className="mt-4 space-y-4">
            {result.subject_breakdown.map((subject) => {
              const pct = subject.total ? Math.round((subject.correct / subject.total) * 100) : 0;
              return (
                <div key={subject.subject}>
                  <p className="text-[11.5px] text-muted-fg">
                    {subject.subject} — {pct}%
                  </p>
                  <div className="mt-1.5 h-1.5 rounded-full bg-surface-alt">
                    <div className="h-1.5 rounded-full bg-success-fg" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {result.subject_breakdown.length === 0 && (
              <p className="text-xs text-muted-fg">No subject data for this attempt.</p>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-[13.5px] font-semibold text-fg">Strategic insight</h3>
          <div className="mt-4 space-y-2 text-xs">
            {strongest && <p className="text-success-fg">Strongest: {strongest.subject}</p>}
            {weakest && <p className="text-danger-fg">Weakest: {weakest.subject}</p>}
            {!strongest && <p className="text-muted-fg">Not enough data yet.</p>}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[13.5px] font-semibold text-fg">Question-wise analysis</h3>
          <div className="flex gap-4 text-[11.5px]">
            {(["all", "correct", "wrong", "skipped"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "capitalize",
                  filter === f ? "font-semibold text-fg" : "text-muted-fg hover:text-fg",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {filteredAnswers.map((answer, index) => {
            const status = answerStatus(answer);
            return (
              <div
                key={answer.id}
                className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
              >
                <span className="text-xs text-fg">
                  {index + 1}. {answer.question_text}
                </span>
                <span className={cn("shrink-0 pl-4 text-[11.5px] font-medium", STATUS_CLASS[status])}>
                  {STATUS_LABEL[status]}
                </span>
              </div>
            );
          })}
          {filteredAnswers.length === 0 && <p className="text-xs text-muted-fg">No questions in this filter.</p>}
        </div>
      </Card>
    </div>
  );
}
