"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getLiveTests } from "@/services/tests.service";

export default function LiveTestsPage() {
  const { data: tests, isLoading } = useQuery({ queryKey: ["live-tests"], queryFn: getLiveTests });
  const [subjectFilter, setSubjectFilter] = useState<string>("All subjects");
  const [search, setSearch] = useState("");

  const subjects = useMemo(() => {
    const names = new Set((tests ?? []).map((t) => t.subject_name).filter(Boolean) as string[]);
    return ["All subjects", ...Array.from(names)];
  }, [tests]);

  const filtered = (tests ?? []).filter((test) => {
    const matchesSubject = subjectFilter === "All subjects" || test.subject_name === subjectFilter;
    const matchesSearch = test.title.toLowerCase().includes(search.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => setSubjectFilter(subject)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                subjectFilter === subject ? "bg-chip-bg text-chip-fg" : "text-muted-fg hover:text-fg",
              )}
            >
              {subject}
            </button>
          ))}
        </div>
        <Input
          placeholder="Search tests"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[200px]"
        />
      </div>

      {isLoading && <p className="text-sm text-muted-fg">Loading live tests…</p>}
      {!isLoading && filtered.length === 0 && <p className="text-sm text-muted-fg">No live tests right now.</p>}

      <div className="grid gap-5 md:grid-cols-3">
        {filtered.map((test) => {
          const attempted = test.attempts_used >= test.max_attempts;
          return (
            <div key={test.id} className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="h-1.5 bg-danger-fg" />
              <Card className="rounded-t-none border-none p-5">
                <span className="rounded-full bg-danger-bg px-2.5 py-1 font-mono text-[10px] font-semibold text-danger-fg">
                  Live
                </span>
                <h3 className="mt-3 text-[13px] font-semibold text-fg">{test.title}</h3>
                <p className="mt-1.5 text-[11px] text-muted-fg">
                  {test.question_count} Qs · {test.duration} min ·{" "}
                  {test.is_paid ? `${test.credit_cost} credits` : "Free"}
                </p>
                {attempted ? (
                  <button
                    type="button"
                    disabled
                    className="mt-4 h-8 w-full rounded-md border border-border text-[11.5px] font-semibold text-fg opacity-60"
                  >
                    Attempted
                  </button>
                ) : (
                  <Link
                    href={`/exam-taking/${test.id}`}
                    className="mt-4 flex h-8 w-full items-center justify-center rounded-md bg-gold text-[11.5px] font-semibold text-gold-ink"
                  >
                    Attempt
                  </Link>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
