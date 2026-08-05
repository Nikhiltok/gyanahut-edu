import type { Exam } from "@/types/exam";

import { ExamCard } from "./ExamCard";

export function ExamGrid({ exams }: { exams: Exam[] }) {
  if (exams.length === 0) {
    return <p className="text-muted-foreground">No exams available in this category yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  );
}
