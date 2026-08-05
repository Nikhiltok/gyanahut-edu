"use client";

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
import { Textarea } from "@/components/ui/textarea";
import type { Difficulty, Question } from "@/types/question";

const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

interface OptionDraft {
  option_text: string;
  is_correct: boolean;
}

export interface QuestionDraft {
  topic: string;
  question_text: string;
  difficulty: Difficulty;
  explanation: string;
  marks: number;
  negative_marks: number;
  options: OptionDraft[];
}

interface QuestionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topics: { id: string; name: string }[];
  initial?: Question | null;
  onSubmit: (draft: QuestionDraft) => Promise<void> | void;
  isSubmitting?: boolean;
}

function draftFrom(question?: Question | null): QuestionDraft {
  if (!question) {
    return {
      topic: "",
      question_text: "",
      difficulty: "MEDIUM",
      explanation: "",
      marks: 1,
      negative_marks: 0,
      options: [
        { option_text: "", is_correct: true },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
      ],
    };
  }
  return {
    topic: question.topic,
    question_text: question.question_text,
    difficulty: question.difficulty,
    explanation: question.explanation,
    marks: Number(question.marks),
    negative_marks: Number(question.negative_marks),
    options: question.options.map((o) => ({ option_text: o.option_text, is_correct: !!o.is_correct })),
  };
}

export function QuestionFormDialog({
  open,
  onOpenChange,
  topics,
  initial,
  onSubmit,
  isSubmitting,
}: QuestionFormDialogProps) {
  const [draft, setDraft] = useState<QuestionDraft>(() => draftFrom(initial));

  function updateOption(index: number, patch: Partial<OptionDraft>) {
    setDraft((d) => ({
      ...d,
      options: d.options.map((o, i) => (i === index ? { ...o, ...patch } : o)),
    }));
  }

  function setCorrect(index: number) {
    setDraft((d) => ({
      ...d,
      options: d.options.map((o, i) => ({ ...o, is_correct: i === index })),
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await onSubmit(draft);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Question" : "Add Question"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <div className="space-y-2">
            <Label>Topic</Label>
            <Select
              items={topics.map((t) => ({ value: t.id, label: t.name }))}
              value={draft.topic}
              onValueChange={(v) => setDraft((d) => ({ ...d, topic: v ?? "" }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Question</Label>
            <Textarea
              required
              value={draft.question_text}
              onChange={(e) => setDraft((d) => ({ ...d, question_text: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Options (select the correct one)</Label>
            {draft.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct-option"
                  checked={option.is_correct}
                  onChange={() => setCorrect(index)}
                />
                <Input
                  required
                  value={option.option_text}
                  onChange={(e) => updateOption(index, { option_text: e.target.value })}
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={draft.difficulty}
                onValueChange={(v) => setDraft((d) => ({ ...d, difficulty: (v as Difficulty) ?? "MEDIUM" }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Marks</Label>
              <Input
                type="number"
                value={draft.marks}
                onChange={(e) => setDraft((d) => ({ ...d, marks: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Negative marks</Label>
            <Input
              type="number"
              value={draft.negative_marks}
              onChange={(e) => setDraft((d) => ({ ...d, negative_marks: Number(e.target.value) }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Explanation</Label>
            <Textarea
              value={draft.explanation}
              onChange={(e) => setDraft((d) => ({ ...d, explanation: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
