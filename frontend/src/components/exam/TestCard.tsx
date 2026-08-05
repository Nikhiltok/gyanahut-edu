import { Play } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Test } from "@/types/test";

export function TestCard({ test, actionLabel = "View" }: { test: Test; actionLabel?: string }) {
  const attemptsLeft = test.max_attempts - test.attempts_used;
  const exhausted = attemptsLeft <= 0;

  return (
    <Card className="overflow-hidden py-0">
      <div className="bg-gradient-to-br from-primary via-primary to-[#721315] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          {test.status === "LIVE" && (
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">
              <span className="size-1.5 animate-pulse rounded-full bg-white" /> Live
            </span>
          )}
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase">
            {test.exam_name}
          </span>
        </div>
        <p className="mt-1.5 font-heading font-semibold leading-tight">{test.title}</p>
      </div>
      <CardContent className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Questions</p>
              <p className="font-heading font-semibold text-primary">{test.question_count}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Time</p>
              <p className="font-heading font-semibold text-primary">{test.duration}m</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">Fee</p>
            {test.is_paid ? (
              <p className="font-heading font-bold">{test.credit_cost} credits</p>
            ) : (
              <p className="font-heading font-bold text-emerald-600">FREE</p>
            )}
          </div>
        </div>
        {test.max_attempts > 1 && !exhausted && (
          <p className="-mt-2 text-xs text-muted-foreground">{attemptsLeft} attempt(s) left</p>
        )}
        {exhausted ? (
          <Button className="w-full" variant="outline" disabled>
            Attempted
          </Button>
        ) : (
          <Button
            className="w-full bg-gradient-to-r from-primary to-[#721315] hover:opacity-90"
            render={<Link href={`/test/${test.id}`} />}
          >
            <Play className="size-4" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
