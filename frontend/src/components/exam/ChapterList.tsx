import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import type { Chapter } from "@/types/exam";

export function ChapterList({ chapters }: { chapters: Chapter[] }) {
  if (chapters.length === 0) {
    return <p className="text-muted-foreground">No chapters added for this subject yet.</p>;
  }

  return (
    <div className="space-y-2">
      {chapters.map((chapter) => (
        <Link key={chapter.id} href={`/chapter/${chapter.id}/topics`}>
          <Card className="transition-colors hover:border-primary">
            <CardContent className="py-4">
              <p className="font-medium">{chapter.name}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
