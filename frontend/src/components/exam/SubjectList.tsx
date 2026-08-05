import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import type { Subject } from "@/types/exam";

export function SubjectList({ subjects }: { subjects: Subject[] }) {
  if (subjects.length === 0) {
    return <p className="text-muted-foreground">No subjects added for this exam yet.</p>;
  }

  return (
    <div className="space-y-2">
      {subjects.map((subject) => (
        <Link key={subject.id} href={`/subject/${subject.id}/chapters`}>
          <Card className="transition-colors hover:border-primary">
            <CardContent className="py-4">
              <p className="font-medium">{subject.name}</p>
              {subject.description ? (
                <p className="text-sm text-muted-foreground">{subject.description}</p>
              ) : null}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
