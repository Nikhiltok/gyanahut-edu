import { Check, Lightbulb, RefreshCw, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/question";

const DIFFICULTY_BADGE_CLASSES: Record<string, string> = {
  EASY: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  MEDIUM: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  HARD: "bg-destructive/10 text-destructive",
};

interface ReviewQuestionCardProps {
  question: Question;
  markId?: string;
  onRemove?: (markId: string) => void;
  isRemoving?: boolean;
  onReattempt?: () => void;
  isReattempting?: boolean;
}

export function ReviewQuestionCard({
  question,
  markId,
  onRemove,
  isRemoving,
  onReattempt,
  isReattempting,
}: ReviewQuestionCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 py-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{question.topic_name}</Badge>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                DIFFICULTY_BADGE_CLASSES[question.difficulty] ?? "bg-muted text-muted-foreground",
              )}
            >
              {question.difficulty?.toLowerCase()}
            </span>
          </div>
        </div>

        <p className="font-heading font-medium leading-relaxed">{question.question_text}</p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {question.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 text-sm",
                  option.is_correct ? "border-2 border-primary bg-primary/5" : "border-border",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    option.is_correct ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {letter}
                </span>
                <span className="flex-1">{option.option_text}</span>
                {option.is_correct && <Check className="size-4 shrink-0 text-primary" />}
              </div>
            );
          })}
        </div>

        {question.explanation && (
          <div className="space-y-2 rounded-lg border bg-muted/40 p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              <Lightbulb className="size-3.5" />
              Detailed Explanation
            </div>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}

        {(onReattempt || (markId && onRemove)) && (
          <div className="flex items-center gap-3 pt-1">
            {onReattempt && (
              <Button
                className="flex-1"
                disabled={isReattempting}
                onClick={onReattempt}
              >
                <RefreshCw className="size-4" />
                {isReattempting ? "Preparing..." : "Re-attempt Question"}
              </Button>
            )}
            {markId && onRemove && (
              <Button variant="outline" disabled={isRemoving} onClick={() => onRemove(markId)}>
                <X className="size-4" />
                Remove from Difficult
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
