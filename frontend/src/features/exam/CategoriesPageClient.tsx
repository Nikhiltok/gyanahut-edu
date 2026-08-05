"use client";

import { useQuery } from "@tanstack/react-query";

import { CategoryGrid } from "@/components/exam/CategoryGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories } from "@/services/exam.service";

export function CategoriesPageClient() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <h1 className="text-2xl font-semibold">Exam Categories</h1>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <CategoryGrid categories={categories ?? []} />
      )}
    </div>
  );
}
