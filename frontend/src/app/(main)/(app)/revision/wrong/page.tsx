"use client";

import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { ReviewQuestionCard } from "@/components/exam/ReviewQuestionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getWrongQuestions } from "@/services/revision.service";

export default function WrongQuestionsPage() {
  const { data: questions, isLoading } = useQuery({ queryKey: ["revision-wrong"], queryFn: getWrongQuestions });

  return (
    <div className="w-full space-y-6 p-8">
      <PageHeader title="Wrong Questions" subtitle="Review questions you got wrong to strengthen weak spots." />
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (questions ?? []).length === 0 ? (
        <p className="text-muted-foreground">No wrong answers to review — nice work!</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {(questions ?? []).map((q) => (
            <ReviewQuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}
    </div>
  );
}
