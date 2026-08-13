"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getUpcomingTests } from "@/services/tests.service";
import type { RootState } from "@/store";

export default function UpcomingTestsPage() {
  const selectedExamIds = useSelector((state: RootState) => state.examFilter.selectedExamIds);
  const { data: tests, isLoading } = useQuery({
    queryKey: ["upcoming-tests", selectedExamIds],
    queryFn: () => getUpcomingTests(selectedExamIds),
  });
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

      {isLoading && <p className="text-sm text-muted-fg">Loading upcoming tests…</p>}
      {!isLoading && filtered.length === 0 && <p className="text-sm text-muted-fg">No upcoming tests scheduled.</p>}

      <div className="grid gap-5 md:grid-cols-3">
        {filtered.map((test) => (
          <div key={test.id} className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="h-1.5 bg-gold" />
            <Card className="rounded-t-none border-none p-5">
              <h3 className="text-[13px] font-semibold text-fg">{test.title}</h3>
              <p className="mt-1.5 text-[11px] text-muted-fg">
                {test.question_count} Qs · {test.duration} min · {test.is_paid ? `${test.credit_cost} credits` : "Free"}
              </p>
              <p className="mt-1 text-[11px] text-accent-fg">
                Starts {test.start_time ? new Date(test.start_time).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "soon"}
              </p>
              <button
                type="button"
                disabled
                className="mt-4 h-8 w-full rounded-md border border-border text-[11.5px] font-semibold text-fg opacity-60"
              >
                Not live yet
              </button>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
