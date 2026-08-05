import type { ExamCategory } from "@/types/exam";

import { CategoryCard } from "./CategoryCard";

export function CategoryGrid({ categories }: { categories: ExamCategory[] }) {
  if (categories.length === 0) {
    return <p className="text-muted-foreground">No exam categories available yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
