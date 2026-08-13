"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";

import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { getDashboardStats, getPerformanceGraph } from "@/services/analytics.service";
import { getMyAttempts } from "@/services/attempts.service";
import { getProfile } from "@/services/auth.service";
import { getGlobalLeaderboard } from "@/services/leaderboard.service";
import type { RootState } from "@/store";

function StatTile({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <Card className="border-none bg-surface-alt p-4">
      <p className="text-[11.5px] text-muted-fg">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <span className="font-heading text-[22px] font-semibold text-fg">{value}</span>
        {delta && <span className="text-[11.5px] font-medium text-success-fg">{delta}</span>}
      </div>
    </Card>
  );
}

export default function DashboardOverviewPage() {
  const t = useTranslations("dashboard.overview");
  const selectedExamIds = useSelector((state: RootState) => state.examFilter.selectedExamIds);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile, retry: false });
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats", selectedExamIds],
    queryFn: () => getDashboardStats(selectedExamIds),
  });
  const { data: performance } = useQuery({
    queryKey: ["performance-graph", selectedExamIds],
    queryFn: () => getPerformanceGraph(selectedExamIds),
  });
  const { data: attempts } = useQuery({
    queryKey: ["my-attempts", undefined, selectedExamIds],
    queryFn: () => getMyAttempts(undefined, selectedExamIds),
  });
  const { data: leaderboard } = useQuery({
    queryKey: ["global-leaderboard", undefined, selectedExamIds],
    queryFn: () => getGlobalLeaderboard(undefined, selectedExamIds),
  });

  const myRank = leaderboard?.find((entry) => entry.student === profile?.id)?.rank;
  const targetExams = profile?.target_exams?.map((exam) => exam.name).join(", ");
  const weakTopic = stats?.weak_topics?.[0];
  const momDelta =
    performance && performance.length >= 2
      ? Math.round(performance[performance.length - 1].score - performance[0].score)
      : null;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex items-center justify-between rounded-xl bg-gold px-7 py-6">
        <div>
          <h2 className="font-heading text-lg font-semibold text-gold-ink">
            {profile ? t("welcomeBack", { name: profile.first_name }) : t("welcomeBack", { name: "" })}
          </h2>
          <p className="mt-1 text-xs text-gold-ink/75">
            {targetExams ? `Target: ${targetExams}` : "Set your target exams from your profile."}
          </p>
        </div>
        <Link href="/dashboard/infinite-test" className={buttonVariants({ variant: "outline" })}>
          {t("startPractice")}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label={t("testsAttempted")} value={String(stats?.tests_attempted ?? "—")} delta="+12%" />
        <StatTile label={t("avgAccuracy")} value={stats ? `${stats.accuracy}%` : "—"} />
        <StatTile label={t("rank")} value={myRank ? `#${myRank}` : "Unranked"} />
        <StatTile label={t("dayStreak")} value={String(stats?.day_streak ?? "—")} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          {stats?.in_progress_attempt && (
            <Card className="p-5">
              <h3 className="font-heading text-sm font-semibold text-fg">Jump back in</h3>
              <p className="mt-2 text-xs text-muted-fg">
                You&apos;re on question {stats.in_progress_attempt.current_question_index} of{" "}
                {stats.in_progress_attempt.total_questions} — {stats.in_progress_attempt.test_title}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-muted-fg opacity-80">
                  Last seen {new Date(stats.in_progress_attempt.last_seen).toLocaleString()}
                </span>
                <Link
                  href={`/exam-taking/${stats.in_progress_attempt.test_id}`}
                  className={buttonVariants({ size: "sm" })}
                >
                  Resume
                </Link>
              </div>
            </Card>
          )}

          <Card className="p-5">
            <h3 className="font-heading text-sm font-semibold text-fg">{t("recentActivity")}</h3>
            <div className="mt-4 space-y-3">
              {(attempts ?? []).slice(0, 3).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between text-xs">
                  <span className="text-label-fg">{attempt.test_title}</span>
                  <span className="font-medium text-accent-fg">{Math.round(attempt.accuracy)}%</span>
                </div>
              ))}
              {attempts?.length === 0 && <p className="text-xs text-muted-fg">{t("noAttempts")}</p>}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-heading text-[13px] font-semibold text-fg">Infinite test</h3>
            <Link href="/dashboard/infinite-test" className="mt-2 block text-xs text-accent-fg">
              Generate a fresh practice set →
            </Link>
          </Card>

          <Card className="p-5">
            <h3 className="font-heading text-[13px] font-semibold text-fg">Live tests</h3>
            <Link href="/dashboard/live-tests" className="mt-2 block text-xs text-accent-fg">
              See what&apos;s live right now →
            </Link>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-[13px] font-semibold text-fg">Performance trend</h3>
              {momDelta !== null && (
                <span className="text-[11px] font-medium text-success-fg">
                  {momDelta >= 0 ? "+" : ""}
                  {momDelta}% MoM
                </span>
              )}
            </div>
            <div className="mt-3 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance ?? []}>
                  <Bar dataKey="score" radius={3} fill="var(--chip-bg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-heading text-[13px] font-semibold text-fg">Next suggested</h3>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-fg">{weakTopic ?? "Keep practicing to unlock suggestions"}</span>
              {weakTopic && (
                <Link href="/dashboard/infinite-test" className="font-medium text-accent-fg">
                  Begin →
                </Link>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
