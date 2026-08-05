"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getProfile } from "@/services/auth.service";
import { getGlobalLeaderboard } from "@/services/leaderboard.service";

type Period = undefined | "weekly" | "monthly";

const TABS: { value: Period; label: string }[] = [
  { value: undefined, label: "All time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const MEDAL_COLORS = ["#FBBF24", "#C0C0C0", "#CD7F32"];

export default function RankingPage() {
  const [period, setPeriod] = useState<Period>(undefined);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile, retry: false });
  const { data: entries, isLoading } = useQuery({
    queryKey: ["global-leaderboard", period],
    queryFn: () => getGlobalLeaderboard(period),
  });

  const myEntry = entries?.find((entry) => entry.student === profile?.id);
  const percentile = myEntry && entries ? Math.max(1, Math.round((myEntry.rank / entries.length) * 100)) : null;
  const topEntries = (entries ?? []).slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Card className="border-none bg-sidebar-bg p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-block rounded-[5px] bg-chip-bg px-3 py-1 font-mono text-[11px] font-medium text-chip-fg">
              NATIONAL LEAGUE
            </span>
            <p className="mt-3 text-[13px] text-white/65">You&apos;re ranked</p>
            <p className="font-heading text-3xl font-bold text-white">
              {myEntry ? `#${myEntry.rank}` : "Unranked"}
              {entries && (
                <span className="ml-2 text-[13px] font-normal text-white/65">of {entries.length} aspirants</span>
              )}
            </p>
          </div>
          {percentile && (
            <div className="text-right">
              <p className="font-heading text-xl font-bold text-gold">Top {percentile}%</p>
              <p className="text-[11.5px] text-white/60">this period</p>
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setPeriod(tab.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
              period === tab.value ? "border-gold bg-chip-bg text-chip-fg" : "border-border text-fg",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="p-3">
        {isLoading && <p className="p-3 text-sm text-muted-fg">Loading leaderboard…</p>}
        {!isLoading && topEntries.length === 0 && (
          <p className="p-3 text-sm text-muted-fg">No leaderboard entries yet.</p>
        )}
        <div className="space-y-2">
          {topEntries.map((entry, index) => (
            <div
              key={entry.student}
              className={cn(
                "flex items-center gap-4 rounded-xl px-4 py-3",
                entry.student === profile?.id ? "border border-gold bg-chip-bg" : "",
              )}
            >
              <span
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-xs font-bold text-gold-ink"
                style={{ backgroundColor: index < 3 ? MEDAL_COLORS[index] : "transparent" }}
              >
                {index >= 3 && <span className="text-muted-fg">{entry.rank}</span>}
                {index < 3 && entry.rank}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chip-bg font-heading text-xs font-bold text-chip-fg">
                {entry.name.trim()?.[0]?.toUpperCase() ?? "?"}
              </span>
              <div className="flex-1">
                <p className="text-[13.5px] font-semibold text-fg">
                  {entry.student === profile?.id ? "You" : entry.name}
                </p>
                <p className="text-[11px] text-muted-fg">Accuracy {entry.accuracy}%</p>
              </div>
              <span className="font-mono text-[15px] font-bold text-fg">{entry.total_score}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
