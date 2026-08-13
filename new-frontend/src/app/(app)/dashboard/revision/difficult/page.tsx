"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { RevisionQuestionGrid } from "@/components/common/RevisionQuestionGrid";
import { getDifficultQuestions } from "@/services/attempts.service";
import type { RootState } from "@/store";

export default function DifficultQuestionsPage() {
  const selectedExamIds = useSelector((state: RootState) => state.examFilter.selectedExamIds);
  const { data: questions, isLoading } = useQuery({
    queryKey: ["difficult-questions", selectedExamIds],
    queryFn: () => getDifficultQuestions(selectedExamIds),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <p className="text-[12.5px] text-muted-fg">
        Questions tagged hard, or that you got wrong/skipped, plus anything you&apos;ve flagged yourself.
      </p>
      {isLoading ? (
        <p className="text-sm text-muted-fg">Loading…</p>
      ) : (
        <RevisionQuestionGrid questions={questions ?? []} />
      )}
    </div>
  );
}
