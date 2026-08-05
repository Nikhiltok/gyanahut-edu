"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { getExam } from "@/services/exam.service";

export function ExamDetailClient({ slug }: { slug: string }) {
  const { data: exam, isLoading } = useQuery({
    queryKey: ["exam", slug],
    queryFn: () => getExam(slug),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (!exam) {
    return <p className="p-8 text-muted-foreground">Exam not found.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <ExamHeader exam={exam} />
      <div>
        <h2 className="mb-2 font-medium">Subjects</h2>
        <ul className="list-inside list-disc text-muted-foreground">
          {exam.subjects.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
      <Button render={<Link href={`/exam/${exam.slug}/subjects`} />}>Browse subjects</Button>
    </div>
  );
}
