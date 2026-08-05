"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PublicFooter } from "@/components/common/PublicFooter";
import { PublicHeader } from "@/components/common/PublicHeader";
import { buttonVariants } from "@/components/ui/button";
import { getExam } from "@/services/exam.service";

export default function ExamDetailPage() {
  const { category: categorySlug, exam: examSlug } = useParams<{ category: string; exam: string }>();

  const { data: exam } = useQuery({
    queryKey: ["exam", examSlug],
    queryFn: () => getExam(examSlug),
  });

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <PublicHeader />

      <main className="flex-1">
        <div className="px-8 pt-6 md:px-16">
          <Breadcrumb
            items={[
              { label: "Categories", href: "/exams" },
              { label: exam?.category_name ?? categorySlug, href: `/exams/${categorySlug}` },
              { label: exam?.name ?? examSlug },
            ]}
          />
        </div>

        <div className="mt-4 bg-sidebar-bg px-8 py-9 md:px-16">
          {exam && (
            <span className="mb-3 inline-block rounded-[5px] bg-gold/25 px-3 py-1 font-mono text-[11px] font-medium text-chip-fg">
              {exam.exam_type}
            </span>
          )}
          <h1 className="font-heading text-[30px] font-semibold text-white">{exam?.name ?? "Loading…"}</h1>
          {exam?.description && <p className="mt-2 max-w-3xl text-[13.5px] text-white/65">{exam.description}</p>}
        </div>

        <div className="mx-auto max-w-6xl px-8 py-10 md:px-16">
          <h2 className="font-heading text-xl font-semibold text-fg">Subjects covered</h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {(exam?.subjects ?? []).map((subject) => (
              <span
                key={subject}
                className="rounded-[5px] bg-chip-bg px-4 py-1.5 font-mono text-[11px] font-medium text-chip-fg"
              >
                {subject}
              </span>
            ))}
            {exam && exam.subjects.length === 0 && (
              <p className="text-sm text-muted-fg">Subjects haven&apos;t been added yet.</p>
            )}
          </div>

          {exam && exam.subjects.length > 0 && (
            <Link
              href={`/exams/${categorySlug}/${examSlug}/subjects`}
              className={`${buttonVariants({ size: "lg" })} mt-6 inline-flex`}
            >
              Browse subjects
            </Link>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
