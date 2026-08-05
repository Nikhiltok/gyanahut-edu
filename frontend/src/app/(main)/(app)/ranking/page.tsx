"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getExams } from "@/services/exam.service";
import { getExamLeaderboard, getGlobalLeaderboard } from "@/services/result.service";

const PERIODS = [
  { value: "all", label: "All Time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function RankingPage() {
  const [scope, setScope] = useState("global");
  const [period, setPeriod] = useState("all");

  const { data: exams } = useQuery({ queryKey: ["exams"], queryFn: () => getExams() });

  const { data: entries, isLoading } = useQuery({
    queryKey: ["leaderboard", scope, period],
    queryFn: () =>
      scope === "global"
        ? getGlobalLeaderboard(period === "all" ? undefined : period)
        : getExamLeaderboard(scope, period === "all" ? undefined : period),
  });

  return (
    <div className="w-full space-y-6 p-8">
      <PageHeader
        title="Ranking"
        subtitle="See how you stack up against other aspirants."
        action={
          <>
            <Select
              items={[
                { value: "global", label: "National (All Exams)" },
                ...(exams ?? []).map((exam) => ({ value: exam.id, label: exam.name })),
              ]}
              value={scope}
              onValueChange={(v) => setScope(v ?? "global")}
            >
              <SelectTrigger className="w-56 border-white/40 bg-white/15 text-white [&_svg]:text-white data-placeholder:text-white/70">
                <SelectValue placeholder="Scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">National (All Exams)</SelectItem>
                {(exams ?? []).map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select items={PERIODS} value={period} onValueChange={(v) => setPeriod(v ?? "all")}>
              <SelectTrigger className="w-40 border-white/40 bg-white/15 text-white [&_svg]:text-white data-placeholder:text-white/70">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (entries ?? []).length === 0 ? (
        <p className="text-muted-foreground">No ranking data yet for this scope/period.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Accuracy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(entries ?? []).map((entry) => (
              <TableRow key={entry.student}>
                <TableCell>
                  <Badge variant={entry.rank <= 3 ? "default" : "secondary"}>#{entry.rank}</Badge>
                </TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.total_score}</TableCell>
                <TableCell>{entry.total_attempt}</TableCell>
                <TableCell>{entry.accuracy}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
