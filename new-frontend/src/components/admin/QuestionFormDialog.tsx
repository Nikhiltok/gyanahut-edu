"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { TopicPicker } from "@/components/forms/TopicPicker";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getErrorMessage } from "@/lib/api-error";
import { adminCrud } from "@/services/admin-crud";
import type { AdminQuestion, AdminQuestionPayload } from "@/types/question";

const questionApi = adminCrud<AdminQuestion>("questions");

interface OptionForm {
  option_text: string;
  is_correct: boolean;
}

const EMPTY_OPTIONS: OptionForm[] = [
  { option_text: "", is_correct: true },
  { option_text: "", is_correct: false },
  { option_text: "", is_correct: false },
  { option_text: "", is_correct: false },
];

export function QuestionFormDialog({
  open,
  onClose,
  question,
}: {
  open: boolean;
  onClose: () => void;
  question: AdminQuestion | null;
}) {
  const queryClient = useQueryClient();
  const [topicId, setTopicId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<OptionForm[]>(EMPTY_OPTIONS);
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    if (!open) return;
    if (question) {
      setTopicId(question.topic);
      setQuestionText(question.question_text);
      setOptions(
        question.options.length > 0
          ? question.options.map((o) => ({ option_text: o.option_text, is_correct: o.is_correct }))
          : EMPTY_OPTIONS,
      );
      setDifficulty(question.difficulty);
      setMarks(question.marks);
      setNegativeMarks(question.negative_marks);
      setExplanation(question.explanation);
    } else {
      setTopicId("");
      setQuestionText("");
      setOptions(EMPTY_OPTIONS);
      setDifficulty("MEDIUM");
      setMarks(1);
      setNegativeMarks(0);
      setExplanation("");
    }
  }, [open, question]);

  const saveMutation = useMutation({
    mutationFn: (payload: AdminQuestionPayload) =>
      question ? questionApi.update(question.id, payload) : questionApi.create(payload),
    onSuccess: () => {
      toast.success(question ? "Question updated" : "Question created");
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
      onClose();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not save question.")),
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!topicId) {
      toast.error("Pick a topic for this question.");
      return;
    }
    if (options.some((o) => !o.option_text.trim())) {
      toast.error("Fill in all four options.");
      return;
    }
    saveMutation.mutate({
      topic: topicId,
      question_text: questionText,
      question_type: "MCQ",
      difficulty,
      marks,
      negative_marks: negativeMarks,
      explanation,
      language: "en",
      options: options.map((o, index) => ({ ...o, order: index })),
    });
  }

  return (
    <Dialog open={open} onClose={onClose} title={question ? "Edit question" : "Add question"}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {question ? (
          <p className="text-xs text-muted-fg">Topic: {question.topic_name}</p>
        ) : (
          <TopicPicker value={topicId} onChange={setTopicId} />
        )}

        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Question text"
          rows={2}
          required
          className="w-full rounded-md border border-input-border bg-input-bg px-3.5 py-2.5 text-[13px] text-fg outline-none focus:border-gold"
        />

        <div className="space-y-2.5">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <input
                type="radio"
                name="correct-option"
                checked={option.is_correct}
                onChange={() =>
                  setOptions((prev) => prev.map((o, i) => ({ ...o, is_correct: i === index })))
                }
                className="accent-gold"
              />
              <Input
                value={option.option_text}
                onChange={(e) =>
                  setOptions((prev) =>
                    prev.map((o, i) => (i === index ? { ...o, option_text: e.target.value } : o)),
                  )
                }
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                required
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD")}
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </Select>
          <Input
            type="number"
            step="0.5"
            min={0}
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
            placeholder="Marks"
          />
          <Input
            type="number"
            step="0.5"
            min={0}
            value={negativeMarks}
            onChange={(e) => setNegativeMarks(Number(e.target.value))}
            placeholder="Negative marks"
          />
        </div>

        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explanation (optional)"
          rows={2}
          className="w-full rounded-md border border-input-border bg-input-bg px-3.5 py-2.5 text-[13px] text-fg outline-none focus:border-gold"
        />

        <Button type="submit" size="lg" className="w-full" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving..." : "Save question"}
        </Button>
      </form>
    </Dialog>
  );
}
