"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { ThemeToggle } from "@/components/common/ThemeToggle";

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
    <header className="flex h-20 items-center justify-between border-b border-border bg-surface px-8">
      <h1 className="font-heading text-2xl font-semibold text-fg">{title}</h1>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-border text-muted-fg"
        >
          <Bell className="h-5 w-5" />
        </button>
        <Link
          href={avatarHref}
          className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-chip-bg text-sm font-semibold text-chip-fg"
        >
          {initial}
        </Link>
      </div>
    </header>
  );
}
