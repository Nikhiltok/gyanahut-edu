"use client";

import { ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import { getExams } from "@/services/exam.service";
import { setSelectedExamIds } from "@/store/slices/examFilterSlice";
import type { RootState } from "@/store";
import { cn } from "@/lib/utils";

export function ExamMultiSelect({ className }: { className?: string }) {
  const dispatch = useDispatch();
  const selectedExamIds = useSelector((state: RootState) => state.examFilter.selectedExamIds);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: exams } = useQuery({ queryKey: ["exams"], queryFn: () => getExams() });

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function toggle(id: string) {
    const next = selectedExamIds.includes(id)
      ? selectedExamIds.filter((existing) => existing !== id)
      : [...selectedExamIds, id];
    dispatch(setSelectedExamIds(next));
  }

  function clearAll() {
    dispatch(setSelectedExamIds([]));
  }

  const label =
    selectedExamIds.length === 0
      ? "All exams"
      : selectedExamIds.length === 1
        ? (exams ?? []).find((exam) => exam.id === selectedExamIds[0])?.name || "1 exam"
        : `${selectedExamIds.length} exams`;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 items-center gap-2 rounded-md border border-input-border bg-input-bg px-4 text-[13px] font-medium text-fg"
      >
        <span className="max-w-[160px] truncate">{label}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-fg transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 max-h-[360px] w-[280px] overflow-y-auto rounded-md border border-border bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-[11px] font-medium text-muted-fg">Filter by exam</span>
            {selectedExamIds.length > 0 && (
              <button type="button" onClick={clearAll} className="text-[11px] font-medium text-gold">
                Clear
              </button>
            )}
          </div>
          <ul className="py-1">
            {(exams ?? []).map((exam) => {
              const checked = selectedExamIds.includes(exam.id);
              return (
                <li key={exam.id}>
                  <button
                    type="button"
                    onClick={() => toggle(exam.id)}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-fg hover:bg-fg/5"
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        checked ? "border-gold bg-gold text-gold-ink" : "border-input-border",
                      )}
                    >
                      {checked && <Check className="h-3 w-3" />}
                    </span>
                    {exam.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
