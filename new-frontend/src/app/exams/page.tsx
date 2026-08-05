"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { PublicFooter } from "@/components/common/PublicFooter";
import { PublicHeader } from "@/components/common/PublicHeader";
import { Card } from "@/components/ui/card";
import { getCategories } from "@/services/exam.service";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({ queryKey: ["categories"], queryFn: getCategories });

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <PublicHeader />

      <main className="flex-1">
        <div className="bg-sidebar-bg px-8 py-9 md:px-16">
          <h1 className="font-heading text-[30px] font-semibold text-white">Exam categories</h1>
          <p className="mt-2 text-[13.5px] text-white/65">
            Pick a category to see the exams under it — no login required.
          </p>
        </div>

        <div className="mx-auto max-w-6xl px-8 py-10 md:px-16">
          {isLoading && <p className="text-sm text-muted-fg">Loading categories…</p>}
          {!isLoading && categories?.length === 0 && (
            <p className="text-sm text-muted-fg">No exam categories are published yet.</p>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(categories ?? []).map((category) => (
              <Card key={category.id} className="p-6">
                <span className="block h-7 w-7 rounded-full bg-chip-bg" />
                <h3 className="mt-4 font-heading text-[14.5px] font-semibold text-fg">{category.name}</h3>
                <p className="mt-1 text-[11px] text-muted-fg">{category.description}</p>
                <Link
                  href={`/exams/${category.slug}`}
                  className="mt-4 block text-[11.5px] font-medium text-accent-fg"
                >
                  Explore tests →
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
