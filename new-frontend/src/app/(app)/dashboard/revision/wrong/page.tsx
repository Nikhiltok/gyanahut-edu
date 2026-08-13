"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { RevisionQuestionGrid } from "@/components/common/RevisionQuestionGrid";
import { getWrongQuestions } from "@/services/attempts.service";
import type { RootState } from "@/store";

export default function WrongQuestionsPage() {
  const selectedExamIds = useSelector((state: RootState) => state.examFilter.selectedExamIds);
  const { data: questions, isLoading } = useQuery({
    queryKey: ["wrong-questions", selectedExamIds],
    queryFn: () => getWrongQuestions(selectedExamIds),
  });

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
