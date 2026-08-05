import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RevisionQuestion } from "@/types/test";

const DIFFICULTY_LABEL: Record<string, string> = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" };

export function RevisionQuestionGrid({ questions }: { questions: RevisionQuestion[] }) {
  if (questions.length === 0) {
    return <p className="text-sm text-muted-fg">Nothing here yet.</p>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {questions.map((question) => (
        <Card key={question.id} className="p-5">
          <span
            className={cn(
              "inline-block rounded-[5px] px-2.5 py-1 font-mono text-[11px] font-medium",
              question.difficulty === "HARD"
                ? "bg-danger-bg text-danger-fg"
                : question.difficulty === "MEDIUM"
                  ? "bg-warning-bg text-warning-fg"
                  : "bg-success-bg text-success-fg",
            )}
          >
            {DIFFICULTY_LABEL[question.difficulty] ?? question.difficulty}
          </span>

          <p className="mt-3 text-[12.5px] text-fg">{question.question_text}</p>

          <div className="mt-3 space-y-2">
            {question.options.map((option, index) => (
              <div
                key={option.id}
                className={cn(
                  "rounded-md border px-3.5 py-2 text-[11.5px]",
                  option.is_correct
                    ? "border-success-fg bg-success-bg text-success-fg"
                    : "border-border text-fg",
                )}
              >
                {String.fromCharCode(65 + index)}. {option.option_text}
                {option.is_correct && " (correct)"}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
