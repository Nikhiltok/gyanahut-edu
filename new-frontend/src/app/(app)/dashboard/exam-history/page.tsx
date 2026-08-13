"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getMyAttempts } from "@/services/attempts.service";
import type { RootState } from "@/store";

type Filter = "all" | "practice" | "mock";

const TABS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "practice", label: "Self practice" },
  { value: "mock", label: "Mock test" },
];

export default function ExamHistoryPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const selectedExamIds = useSelector((state: RootState) => state.examFilter.selectedExamIds);
  const { data: attempts, isLoading } = useQuery({
    queryKey: ["my-attempts", filter, selectedExamIds],
    queryFn: () => getMyAttempts(filter === "all" ? undefined : filter, selectedExamIds),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              filter === tab.value ? "bg-chip-bg text-chip-fg" : "text-muted-fg hover:text-fg",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-muted-fg">Loading attempts…</p>}
      {!isLoading && attempts?.length === 0 && <p className="text-sm text-muted-fg">No attempts yet.</p>}

      <div className="space-y-3">
        {(attempts ?? []).map((attempt) => (
          <Card key={attempt.id} className="flex items-center justify-between p-5">
            <div>
              <h3 className="text-[13.5px] font-semibold text-fg">{attempt.test_title}</h3>
              <p className="mt-1.5 text-[11.5px] text-muted-fg">
                Submitted{" "}
                {new Date(attempt.submitted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} ·
                Score {attempt.score} · Accuracy {Math.round(attempt.accuracy)}%
              </p>
            </div>
            <Link href={`/dashboard/result/${attempt.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              View detail
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
