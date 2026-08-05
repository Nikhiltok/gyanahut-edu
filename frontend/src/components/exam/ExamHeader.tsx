import { Badge } from "@/components/ui/badge";
import type { Exam } from "@/types/exam";

export function ExamHeader({ exam }: { exam: Exam }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">{exam.name}</h1>
        <Badge variant="secondary">{exam.exam_type}</Badge>
      </div>
      <p className="text-muted-foreground">{exam.description}</p>
    </div>
  );
}
