"use client";

import { useQuery } from "@tanstack/react-query";

import { ChapterList } from "@/components/exam/ChapterList";
import { Skeleton } from "@/components/ui/skeleton";
import { getChapters } from "@/services/exam.service";

export function SubjectChaptersClient({ subjectId }: { subjectId: string }) {
  const { data: chapters, isLoading } = useQuery({
    queryKey: ["chapters", { subject: subjectId }],
    queryFn: () => getChapters(subjectId),
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <h1 className="text-2xl font-semibold">Chapters</h1>
      {isLoading ? <Skeleton className="h-10 w-full" /> : <ChapterList chapters={chapters ?? []} />}
    </div>
  );
}
