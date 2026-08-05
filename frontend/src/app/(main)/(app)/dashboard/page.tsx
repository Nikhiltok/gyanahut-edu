"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Bell,
  ClipboardCheck,
  HelpCircle,
  Plus,
  Radio,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { GradientBanner } from "@/components/common/GradientBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  getDashboardStats,
  getPerformanceGraph,
} from "@/services/analytics.service";
import { getProfile } from "@/services/auth.service";
import { getGlobalLeaderboard, getMyAttempts } from "@/services/result.service";

const CHART_PRIMARY = "#9d4300";
const STREAK_DOTS = 7;

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function computeTrendPercent(points: { score: number }[]) {
  if (points.length < 2) return null;
  const mid = Math.floor(points.length / 2) || 1;
  const earlier = points.slice(0, mid);
  const recent = points.slice(mid).length ? points.slice(mid) : earlier;
  const avg = (arr: { score: number }[]) =>
    arr.reduce((sum, p) => sum + p.score, 0) / arr.length;
  const earlierAvg = avg(earlier);
  if (earlierAvg === 0) return null;
  return Math.round(((avg(recent) - earlierAvg) / earlierAvg) * 100);
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Real week-over-week attempt-count change (not a fabricated number) — null when
// there's no prior week to compare against, in which case the caller omits the chip.
function computeWeeklyAttemptsDelta(points: { date: string }[] | undefined) {
  if (!points?.length) return null;
  const now = Date.now();
  const thisWeek = points.filter(
    (p) => now - new Date(p.date).getTime() <= WEEK_MS,
  ).length;
  const lastWeek = points.filter((p) => {
    const age = now - new Date(p.date).getTime();
    return age > WEEK_MS && age <= WEEK_MS * 2;
  }).length;
  if (lastWeek === 0) return null;
  return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
}

export default function DashboardPage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });
  const { data: performance } = useQuery({
    queryKey: ["dashboard-performance"],
    queryFn: getPerformanceGraph,
  });
  const { data: leaderboard } = useQuery({
    queryKey: ["leaderboard-global"],
    queryFn: () => getGlobalLeaderboard(),
  });
  const { data: recentAttempts } = useQuery({
    queryKey: ["recent-attempts"],
    queryFn: () => getMyAttempts(),
  });

  const chartData = (performance ?? []).map((p) => ({
    date: new Date(p.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    score: p.score,
  }));
  const trendPercent = computeTrendPercent(chartData);
  const attemptsDelta = computeWeeklyAttemptsDelta(performance);

  const hasActivity = (stats?.tests_attempted ?? 0) > 0;
  const targetExamNames = (profile?.target_exams ?? [])
    .map((e) => e.name)
    .join(", ");
  const myRankEntry = leaderboard?.find(
    (entry) => entry.student === profile?.id,
  );
  const rankPercent =
    myRankEntry && leaderboard?.length
      ? Math.ceil((myRankEntry.rank / leaderboard.length) * 100)
      : null;

  return (
    <div className="w-full">
      <div>
        <GradientBanner className="rounded-none px-6 pt-10 pb-24 sm:px-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              {isLoading ? (
                <Skeleton className="h-8 w-64 bg-white/20" />
              ) : (
                <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome back, {profile?.name?.split(" ")[0] ?? "there"}
                </h1>
              )}
              <p className="mt-2 text-sm text-white/85">
                {targetExamNames
                  ? `Target: ${targetExamNames}`
                  : "Set a target exam in your profile to personalize your prep"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.info("You're all caught up!")}
                className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  toast.info("Need help? Reach out at support@gyanahut.edu")
                }
                className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                aria-label="Help"
              >
                <HelpCircle className="size-5" />
              </button>
              <Button
                className="bg-[#f97316] text-white hover:bg-[#f97316]/90"
                render={<Link href="/practice/generate" />}
              >
                Start Practice
              </Button>
            </div>
          </div>
        </GradientBanner>

        <div className="relative z-10 -mt-10 grid grid-cols-2 gap-4 px-6 sm:grid-cols-4 sm:px-10">
          <Card className="border-transparent bg-card shadow-md">
            <CardContent className="space-y-1 py-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Tests Attempted
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-[#f97316]">
                  {stats?.tests_attempted ?? "—"}
                </p>
                {attemptsDelta !== null && (
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
                      attemptsDelta >= 0
                        ? "text-emerald-600"
                        : "text-destructive",
                    )}
                  >
                    {attemptsDelta >= 0 ? (
                      <TrendingUp className="size-3.5" />
                    ) : (
                      <TrendingDown className="size-3.5" />
                    )}
                    {Math.abs(attemptsDelta)}%
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-transparent bg-card shadow-md">
            <CardContent className="space-y-1.5 py-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Avg Accuracy
              </p>
              <p className="text-2xl font-bold text-secondary">
                {stats ? `${stats.accuracy}%` : "—"}
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f6e2d8]">
                <div
                  className="h-full rounded-full bg-secondary transition-all duration-500"
                  style={{ width: `${Math.min(stats?.accuracy ?? 0, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-transparent bg-card shadow-md">
            <CardContent className="space-y-1 py-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Rank
              </p>
              <p className="text-2xl font-bold text-tertiary">
                {myRankEntry ? `#${myRankEntry.rank}` : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {rankPercent ? `Top ${rankPercent}%` : "Not ranked yet"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-transparent bg-[#fdf1ea] shadow-md">
            <CardContent className="space-y-1.5 py-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Day Streak
              </p>
              <p className="text-2xl font-bold text-[#f97316]">
                {stats?.day_streak ?? "—"}
              </p>
              <div className="flex gap-1">
                {Array.from({ length: STREAK_DOTS }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "size-2 rounded-full",
                      i < Math.min(stats?.day_streak ?? 0, STREAK_DOTS)
                        ? "bg-[#f97316]"
                        : "bg-[#f97316]/20",
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-6 p-8 pt-6">
        {!hasActivity && (
          <Card className="border-dashed bg-primary/5">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Sparkles className="size-6" />
              </span>
              <div>
                <p className="font-semibold">
                  You haven&apos;t attempted a test yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Take your first practice test to unlock analytics, ranking,
                  and progress tracking.
                </p>
              </div>
              <Button render={<Link href="/tests/live" />}>
                Attempt a Live Test
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {stats?.in_progress_attempt && (
              <Card className="overflow-hidden py-0">
                <CardContent className="flex flex-col gap-0 p-0 sm:flex-row">
                  <div className="relative flex h-40 w-full shrink-0 flex-col justify-end overflow-hidden bg-gradient-to-br from-primary to-[#721315] p-4 text-white sm:h-auto sm:w-56">
                    <span className="mb-2 inline-flex w-fit items-center rounded-full bg-[#f97316] px-2.5 py-1 text-xs font-bold tracking-wide uppercase">
                      {stats.in_progress_attempt.exam_name}
                    </span>
                    <p className="font-heading text-xl leading-tight font-bold">
                      {stats.in_progress_attempt.test_title}
                    </p>
                  </div>
                  <div className="flex-1 space-y-2 p-5">
                    <p className="flex items-center gap-1.5 font-heading text-lg font-bold">
                      <Sparkles className="size-4 text-primary" /> Jump Back In
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You&apos;re on Question{" "}
                      {stats.in_progress_attempt.current_question_index + 1} of{" "}
                      {stats.in_progress_attempt.total_questions}. Keep going to
                      stay on track.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        render={
                          <Link
                            href={`/test/${stats.in_progress_attempt.test_id}`}
                          />
                        }
                      >
                        Resume Test <ArrowRight className="size-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        Last seen{" "}
                        {relativeTime(stats.in_progress_attempt.last_seen)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <Button
                  variant="link"
                  className="px-0"
                  render={<Link href="/exam-history" />}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-1">
                {(recentAttempts ?? []).length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No attempts yet — take your first test to see activity here.
                  </p>
                ) : (
                  (recentAttempts ?? []).slice(0, 3).map((attempt) => (
                    <Link
                      key={attempt.id}
                      href={`/result/${attempt.id}`}
                      className="-mx-2.5 flex items-center justify-between gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
                          <ClipboardCheck className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {attempt.test_title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Score: {attempt.score} • Accuracy:{" "}
                            {attempt.accuracy}%
                          </p>
                        </div>
                      </div>
                      <p className="shrink-0 text-xs text-muted-foreground">
                        {relativeTime(attempt.submitted_at)}
                      </p>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Link href="/practice/generate" className="block">
              <Card className="border-none bg-gradient-to-br from-primary to-[#721315] text-white transition-transform duration-200 hover:-translate-y-0.5">
                <CardContent className="space-y-2 py-5">
                  <Sparkles className="size-7" />
                  <p className="font-heading text-lg font-bold">
                    Infinite Test
                  </p>
                  <p className="text-sm text-white/85">
                    AI-generated dynamic practice tailored to your weak areas.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tests/live" className="block">
              <Card className="border-none bg-gradient-to-br from-secondary to-[#5c1210] text-white transition-transform duration-200 hover:-translate-y-0.5">
                <CardContent className="space-y-2 py-5">
                  <Radio className="size-7" />
                  <p className="font-heading text-lg font-bold">Live Tests</p>
                  <p className="text-sm text-white/85">
                    Compete in real-time with aspirants nationwide.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {chartData.length > 1 && (
              <Card className="relative overflow-visible">
                <CardHeader>
                  <CardTitle className="text-base">Performance Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Tooltip />
                      <Bar
                        dataKey="score"
                        fill={CHART_PRIMARY}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
                {trendPercent !== null && (
                  <p
                    className={cn(
                      "px-6 pb-4 text-xs font-medium",
                      trendPercent >= 0
                        ? "text-emerald-600"
                        : "text-destructive",
                    )}
                  >
                    {trendPercent >= 0 ? "+" : ""}
                    {trendPercent}% this month
                  </p>
                )}
                <Link
                  href="/practice/generate"
                  className="absolute -right-3 -bottom-3 flex size-11 items-center justify-center rounded-full bg-[#721315] text-white shadow-lg transition-transform duration-200 hover:scale-110"
                  aria-label="Start a new practice test"
                >
                  <Plus className="size-5" />
                </Link>
              </Card>
            )}

            {(stats?.weak_topics.length ?? 0) > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Next Suggested</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Target className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {stats!.weak_topics[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Focus on your weakest topic to boost accuracy.
                    </p>
                    <Link
                      href="/practice/generate"
                      className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Begin <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
