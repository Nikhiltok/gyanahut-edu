"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { getExams } from "@/services/exam.service";

export function TargetExamPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: exams } = useQuery({ queryKey: ["exams"], queryFn: () => getExams() });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabels = (exams ?? []).filter((exam) => value.includes(exam.id)).map((exam) => exam.name);

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-[38px] w-full truncate rounded-md border border-input-border bg-input-bg px-3.5 text-left text-[13px] text-fg outline-none focus:border-gold"
      >
        <span className={cn(selectedLabels.length === 0 && "text-placeholder-fg")}>
          {selectedLabels.length > 0 ? selectedLabels.join(", ") : "SSC CGL, Banking PO..."}
        </span>
      </button>

      {open && (
        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-surface p-1 shadow-md">
          {(exams ?? []).length === 0 && (
            <p className="px-3 py-2 text-xs text-muted-fg">Loading exams…</p>
          )}
          {(exams ?? []).map((exam) => (
            <label
              key={exam.id}
              className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-[13px] text-fg hover:bg-surface-alt"
            >
              <input
                type="checkbox"
                checked={value.includes(exam.id)}
                onChange={() => toggle(exam.id)}
                className="accent-gold"
              />
              {exam.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
