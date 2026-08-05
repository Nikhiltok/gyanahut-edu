"use client";

import { useQuery } from "@tanstack/react-query";

import { ExamGrid } from "@/components/exam/ExamGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategory, getExams } from "@/services/exam.service";

export function CategoryDetailClient({ slug }: { slug: string }) {
  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => getCategory(slug),
  });

  const { data: exams, isLoading: isLoadingExams } = useQuery({
    queryKey: ["exams", { category: slug }],
    queryFn: () => getExams({ category: slug }),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      {isLoadingCategory ? (
        <Skeleton className="h-8 w-64" />
      ) : (
        <div>
          <h1 className="text-2xl font-semibold">{category?.name}</h1>
          <p className="text-muted-foreground">{category?.description}</p>
        </div>
      )}
      {isLoadingExams ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <ExamGrid exams={exams ?? []} />
      )}
    </div>
  );
}
