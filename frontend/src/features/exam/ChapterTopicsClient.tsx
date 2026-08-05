"use client";

import { useQuery } from "@tanstack/react-query";

import { TopicList } from "@/components/exam/TopicList";
import { Skeleton } from "@/components/ui/skeleton";
import { getTopics } from "@/services/exam.service";

export function ChapterTopicsClient({ chapterId }: { chapterId: string }) {
  const { data: topics, isLoading } = useQuery({
    queryKey: ["topics", { chapter: chapterId }],
    queryFn: () => getTopics(chapterId),
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <h1 className="text-2xl font-semibold">Topics</h1>
      {isLoading ? <Skeleton className="h-10 w-full" /> : <TopicList topics={topics ?? []} />}
    </div>
  );
}
