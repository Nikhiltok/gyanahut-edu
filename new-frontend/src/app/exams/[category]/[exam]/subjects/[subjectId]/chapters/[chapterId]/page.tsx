"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PublicFooter } from "@/components/common/PublicFooter";
import { PublicHeader } from "@/components/common/PublicHeader";
import { getChapter, getExam, getTopics } from "@/services/exam.service";

export default function ChapterTopicsPage() {
  const {
    category: categorySlug,
    exam: examSlug,
    subjectId,
    chapterId,
  } = useParams<{ category: string; exam: string; subjectId: string; chapterId: string }>();

  const { data: exam } = useQuery({ queryKey: ["exam", examSlug], queryFn: () => getExam(examSlug) });
  const { data: chapter } = useQuery({ queryKey: ["chapter", chapterId], queryFn: () => getChapter(chapterId) });
  const { data: topics, isLoading } = useQuery({
    queryKey: ["topics", chapterId],
    queryFn: () => getTopics(chapterId),
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
            { label: "Chapters", href: `/exams/${categorySlug}/${examSlug}/subjects/${subjectId}` },
            { label: chapter?.name ?? "" },
          ]}
        />

        <h1 className="mt-3 font-heading text-[22px] font-semibold text-fg">
          {chapter?.name ?? "Loading…"} — Topics
        </h1>
        <p className="mt-1.5 text-[13px] text-muted-fg">
          End of the browsing trail — topics aren&apos;t clickable here.
        </p>
        <p className="text-[13px] text-muted-fg">
          Start an infinite test from the student panel to practise one directly.
        </p>

        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-sm text-muted-fg">Loading topics…</p>}
          {!isLoading && topics?.length === 0 && (
            <p className="text-sm text-muted-fg">No topics have been added to this chapter yet.</p>
          )}
          {(topics ?? []).map((topic) => (
            <div
              key={topic.id}
              className="rounded-[10px] border border-border bg-surface px-5 py-4 opacity-80"
            >
              <h3 className="text-[14.5px] font-semibold text-fg">{topic.name}</h3>
              {topic.description && <p className="mt-1 text-xs text-muted-fg">{topic.description}</p>}
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
