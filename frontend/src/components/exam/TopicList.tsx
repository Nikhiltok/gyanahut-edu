import { Card, CardContent } from "@/components/ui/card";
import type { Topic } from "@/types/exam";

export function TopicList({ topics }: { topics: Topic[] }) {
  if (topics.length === 0) {
    return <p className="text-muted-foreground">No topics added for this chapter yet.</p>;
  }

  return (
    <div className="space-y-2">
      {topics.map((topic) => (
        <Card key={topic.id}>
          <CardContent className="py-4">
            <p className="font-medium">{topic.name}</p>
            {topic.description ? (
              <p className="text-sm text-muted-foreground">{topic.description}</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
