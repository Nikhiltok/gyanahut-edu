"use client";

import { useQuery } from "@tanstack/react-query";

import { SubjectList } from "@/components/exam/SubjectList";
import { Skeleton } from "@/components/ui/skeleton";
import { getExam, getSubjects } from "@/services/exam.service";

export function ExamSubjectsClient({ slug }: { slug: string }) {
  const { data: exam } = useQuery({ queryKey: ["exam", slug], queryFn: () => getExam(slug) });
  const { data: subjects, isLoading } = useQuery({
    queryKey: ["subjects", { exam: exam?.id }],
    queryFn: () => getSubjects(exam!.id),
    enabled: !!exam,
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <h1 className="text-2xl font-semibold">{exam ? `${exam.name} — Subjects` : "Subjects"}</h1>
      {isLoading || !exam ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <SubjectList subjects={subjects ?? []} />
      )}
    </div>
  );
}
