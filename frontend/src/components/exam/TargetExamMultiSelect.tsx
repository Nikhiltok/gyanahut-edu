"use client";

import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getExams } from "@/services/exam.service";

interface TargetExamMultiSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  triggerClassName?: string;
}

export function TargetExamMultiSelect({
  value,
  onChange,
  placeholder = "Select your target exam(s)",
  triggerClassName,
}: TargetExamMultiSelectProps) {
  const { data: exams } = useQuery({ queryKey: ["exams"], queryFn: () => getExams() });
  const examItems = (exams ?? []).map((exam) => ({ value: exam.id, label: exam.name }));
  const examMap = new Map(examItems.map((item) => [item.value, item.label]));

  return (
    <Select items={examItems} multiple value={value} onValueChange={(ids) => onChange(ids ?? [])}>
      <SelectTrigger className={cn("w-full", triggerClassName)}>
        <SelectValue placeholder={placeholder}>
          {(ids: string[]) =>
            !ids || ids.length === 0 ? placeholder : ids.map((id) => examMap.get(id) ?? id).join(", ")
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {examItems.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
