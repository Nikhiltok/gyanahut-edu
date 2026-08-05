"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { ReviewQuestionCard } from "@/components/exam/ReviewQuestionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getChapter, getSubject, getTopic } from "@/services/exam.service";
import { getDifficultMarks, removeDifficultMark } from "@/services/question.service";
import { getDifficultQuestions } from "@/services/revision.service";
import { generatePracticeTest } from "@/services/test.service";
import { getApiErrorMessage } from "@/utils/api-error";

export default function DifficultQuestionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [reattemptingId, setReattemptingId] = useState<string | null>(null);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["revision-difficult"],
    queryFn: getDifficultQuestions,
  });
  const { data: difficultMarks } = useQuery({ queryKey: ["difficult-marks"], queryFn: getDifficultMarks });
  const markByQuestion = new Map((difficultMarks ?? []).map((m) => [m.question, m.id]));

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["revision-difficult"] });
    queryClient.invalidateQueries({ queryKey: ["difficult-marks"] });
  }

  const removeMutation = useMutation({
    mutationFn: (markId: string) => removeDifficultMark(markId),
    onSuccess: () => {
      toast.success("Removed from difficult questions");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not remove this question")),
  });

  const reattemptMutation = useMutation({
    mutationFn: async (topicId: string) => {
      const topic = await getTopic(topicId);
      const chapter = await getChapter(topic.chapter);
      const subject = await getSubject(chapter.subject);
      return generatePracticeTest({
        exam: subject.exam,
        topic: topicId,
        question_count: 1,
        duration: 5,
      });
    },
    onSuccess: (test) => {
      router.push(`/test/${test.id}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not start this question"));
      setReattemptingId(null);
    },
  });

  return (
    <div className="w-full space-y-6 p-8">
      <PageHeader title="Difficult Questions" subtitle="Review and master your weak areas." />
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (questions ?? []).length === 0 ? (
        <p className="text-muted-foreground">No difficult questions to review yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {(questions ?? []).map((q) => (
            <ReviewQuestionCard
              key={q.id}
              question={q}
              markId={markByQuestion.get(q.id)}
              onRemove={(markId) => removeMutation.mutate(markId)}
              isRemoving={removeMutation.isPending}
              onReattempt={() => {
                setReattemptingId(q.id);
                reattemptMutation.mutate(q.topic);
              }}
              isReattempting={reattemptingId === q.id && reattemptMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
