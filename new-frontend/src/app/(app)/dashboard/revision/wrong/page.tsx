"use client";

import { useQuery } from "@tanstack/react-query";

import { RevisionQuestionGrid } from "@/components/common/RevisionQuestionGrid";
import { getWrongQuestions } from "@/services/attempts.service";

export default function WrongQuestionsPage() {
  const { data: questions, isLoading } = useQuery({ queryKey: ["wrong-questions"], queryFn: getWrongQuestions });

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <p className="text-[12.5px] text-muted-fg">Read-only — questions from attempts you got wrong.</p>
      {isLoading ? (
        <p className="text-sm text-muted-fg">Loading…</p>
      ) : (
        <RevisionQuestionGrid questions={questions ?? []} />
      )}
    </div>
  );
}
