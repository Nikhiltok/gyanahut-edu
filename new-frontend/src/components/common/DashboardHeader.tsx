"use client";

import Link from "next/link";
import { Settings } from "lucide-react";

import { ExamMultiSelect } from "@/components/common/ExamMultiSelect";

export function DashboardHeader({
  title,
  initial,
  avatarHref = "/dashboard/profile",
}: {
  title: string;
  initial: string;
  avatarHref?: string;
}) {
  return (
    <header className="flex h-24 items-center justify-between border-b border-border bg-surface px-8">
      <h1 className="font-heading text-[26px] font-semibold text-fg">{title}</h1>

      <div className="flex items-center gap-3">
        <ExamMultiSelect />
        <Link
          href="/dashboard/settings"
          aria-label="Settings"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-fg hover:bg-fg/5"
        >
          <Settings className="h-5 w-5" />
        </Link>
        <Link
          href={avatarHref}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-chip-bg text-sm font-semibold text-chip-fg"
        >
          {initial}
        </Link>
      </div>
    </header>
  );
}
