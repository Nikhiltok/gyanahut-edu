"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PublicFooter } from "@/components/common/PublicFooter";
import { PublicHeader } from "@/components/common/PublicHeader";
import { getExam, getSubjects } from "@/services/exam.service";

export default function ExamSubjectsPage() {
  const { category: categorySlug, exam: examSlug } = useParams<{ category: string; exam: string }>();

  const { data: exam } = useQuery({ queryKey: ["exam", examSlug], queryFn: () => getExam(examSlug) });
  const { data: subjects, isLoading } = useQuery({
    queryKey: ["subjects", exam?.id],
    queryFn: () => getSubjects(exam!.id),
    enabled: !!exam?.id,
  });

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <PublicHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-8 py-8 md:px-16">
        <Breadcrumb
          items={[
            { label: "Categories", href: "/exams" },
            { label: exam?.category_name ?? categorySlug, href: `/exams/${categorySlug}` },
            { label: exam?.name ?? examSlug, href: `/exams/${categorySlug}/${examSlug}` },
            { label: "Subjects" },
          ]}
        />

        <h1 className="mt-3 font-heading text-[22px] font-semibold text-fg">
          {exam?.name ?? "Loading…"} — Subjects
        </h1>
        <p className="mt-1.5 text-[13px] text-muted-fg">Choose a subject to see its chapters.</p>

        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-sm text-muted-fg">Loading subjects…</p>}
          {!isLoading && subjects?.length === 0 && (
            <p className="text-sm text-muted-fg">No subjects have been added to this exam yet.</p>
          )}
          {(subjects ?? []).map((subject) => (
            <Link
              key={subject.id}
              href={`/exams/${categorySlug}/${examSlug}/subjects/${subject.id}`}
              className="flex items-center justify-between rounded-[10px] border border-border bg-surface px-5 py-4 transition-colors hover:border-gold"
            >
              <div>
                <h3 className="text-[14.5px] font-semibold text-fg">{subject.name}</h3>
                {subject.description && <p className="mt-1 text-xs text-muted-fg">{subject.description}</p>}
              </div>
              <span className="text-base text-muted-fg">→</span>
            </Link>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
