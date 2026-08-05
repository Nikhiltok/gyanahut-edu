"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PublicFooter } from "@/components/common/PublicFooter";
import { PublicHeader } from "@/components/common/PublicHeader";
import { Card } from "@/components/ui/card";
import { getCategory, getExams } from "@/services/exam.service";

export default function CategoryPage() {
  const { category: categorySlug } = useParams<{ category: string }>();

  const { data: category } = useQuery({
    queryKey: ["category", categorySlug],
    queryFn: () => getCategory(categorySlug),
  });
  const { data: exams, isLoading } = useQuery({
    queryKey: ["exams", categorySlug],
    queryFn: () => getExams({ category: categorySlug }),
  });

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <PublicHeader />

      <main className="flex-1">
        <div className="px-8 pt-6 md:px-16">
          <Breadcrumb items={[{ label: "Categories", href: "/exams" }, { label: category?.name ?? categorySlug }]} />
        </div>

        <div className="mt-4 bg-sidebar-bg px-8 py-9 md:px-16">
          <h1 className="font-heading text-[30px] font-semibold text-white">
            {category?.name ?? "Loading…"}
          </h1>
          {category?.description && <p className="mt-2 text-[13.5px] text-white/65">{category.description}</p>}
        </div>

        <div className="mx-auto max-w-6xl px-8 py-10 md:px-16">
          {isLoading && <p className="text-sm text-muted-fg">Loading exams…</p>}
          {!isLoading && exams?.length === 0 && (
            <p className="text-sm text-muted-fg">No exams published in this category yet.</p>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {(exams ?? []).map((exam) => (
              <Card key={exam.id} className="relative p-6">
                <span className="absolute right-6 top-6 rounded-[5px] bg-chip-bg px-3 py-1 font-mono text-[11px] font-medium text-chip-fg">
                  {exam.subjects.length} subject{exam.subjects.length === 1 ? "" : "s"}
                </span>
                <h3 className="font-heading text-base font-semibold text-fg">{exam.name}</h3>
                <p className="mt-2 max-w-md text-xs text-muted-fg">{exam.description}</p>
                <Link
                  href={`/exams/${categorySlug}/${exam.slug}`}
                  className="mt-4 inline-block text-xs font-medium text-accent-fg"
                >
                  Explore →
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
