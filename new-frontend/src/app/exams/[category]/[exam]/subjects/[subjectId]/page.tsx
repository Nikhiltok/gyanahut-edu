"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PublicFooter } from "@/components/common/PublicFooter";
import { PublicHeader } from "@/components/common/PublicHeader";
import { getChapters, getExam, getSubject } from "@/services/exam.service";

export default function SubjectChaptersPage() {
  const {
    category: categorySlug,
    exam: examSlug,
    subjectId,
  } = useParams<{ category: string; exam: string; subjectId: string }>();

  const { data: exam } = useQuery({ queryKey: ["exam", examSlug], queryFn: () => getExam(examSlug) });
  const { data: subject } = useQuery({ queryKey: ["subject", subjectId], queryFn: () => getSubject(subjectId) });
  const { data: chapters, isLoading } = useQuery({
    queryKey: ["chapters", subjectId],
    queryFn: () => getChapters(subjectId),
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
            { label: "Subjects", href: `/exams/${categorySlug}/${examSlug}/subjects` },
            { label: subject?.name ?? "" },
          ]}
        />

        <h1 className="mt-3 font-heading text-[22px] font-semibold text-fg">
          {subject?.name ?? "Loading…"} — Chapters
        </h1>
        <p className="mt-1.5 text-[13px] text-muted-fg">Chapters have no description — pick one to see its topics.</p>

        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-sm text-muted-fg">Loading chapters…</p>}
          {!isLoading && chapters?.length === 0 && (
            <p className="text-sm text-muted-fg">No chapters have been added to this subject yet.</p>
          )}
          {(chapters ?? []).map((chapter) => (
            <Link
              key={chapter.id}
              href={`/exams/${categorySlug}/${examSlug}/subjects/${subjectId}/chapters/${chapter.id}`}
              className="flex items-center justify-between rounded-[10px] border border-border bg-surface px-5 py-3.5 transition-colors hover:border-gold"
            >
              <h3 className="text-[14.5px] font-semibold text-fg">{chapter.name}</h3>
              <span className="text-base text-muted-fg">→</span>
            </Link>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
