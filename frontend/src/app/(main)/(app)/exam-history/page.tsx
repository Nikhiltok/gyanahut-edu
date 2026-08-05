"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMyAttempts } from "@/services/result.service";

type HistoryType = "all" | "practice" | "mock";

export default function ExamHistoryPage() {
  const [type, setType] = useState<HistoryType>("all");
  const { data: attempts, isLoading } = useQuery({
    queryKey: ["my-attempts", type],
    queryFn: () => getMyAttempts(type === "all" ? undefined : type),
  });

  return (
    <div className="w-full space-y-6 p-8">
      <PageHeader title="Exam History" subtitle="Every test you've attempted, with full right/wrong detail." />

      <Tabs value={type} onValueChange={(v) => setType((v as HistoryType) ?? "all")}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="practice">Self Practice</TabsTrigger>
          <TabsTrigger value="mock">Mock Test</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (attempts ?? []).length === 0 ? (
        <p className="text-muted-foreground">You haven&apos;t attempted any test yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {(attempts ?? []).map((attempt) => (
            <Card key={attempt.id}>
              <CardContent className="space-y-3 py-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{attempt.test_title}</p>
                    <p className="text-xs text-muted-foreground">{attempt.exam_name}</p>
                  </div>
                  <Badge variant="secondary">{new Date(attempt.submitted_at).toLocaleDateString()}</Badge>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="font-semibold">{attempt.score}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Correct</p>
                    <p className="font-semibold text-green-600 dark:text-green-500">{attempt.correct_answers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Wrong</p>
                    <p className="font-semibold text-destructive">{attempt.wrong_answers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                    <p className="font-semibold">{attempt.accuracy}%</p>
                  </div>
                </div>

                <Button size="sm" className="w-full" render={<Link href={`/result/${attempt.id}`} />}>
                  View Full Detail
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
