"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/common/AppSidebar";
import { DashboardHeader } from "@/components/common/DashboardHeader";
import { StudentGuard } from "@/components/common/StudentGuard";
import { getProfile } from "@/services/auth.service";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/infinite-test": "Infinite test",
  "/dashboard/live-tests": "Live tests",
  "/dashboard/upcoming-tests": "Upcoming tests",
  "/dashboard/exam-history": "Exam history",
  "/dashboard/bookmarks": "Bookmarks",
  "/dashboard/revision/wrong": "Wrong questions",
  "/dashboard/revision/difficult": "Difficult questions",
  "/dashboard/ranking": "Ranking",
  "/dashboard/profile": "Profile",
  "/dashboard/wallet": "Wallet",
  "/dashboard/recharge": "Recharge",
};

const PAGE_TITLE_PREFIXES: [string, string][] = [["/dashboard/result/", "Test result"]];

function resolveTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const prefixMatch = PAGE_TITLE_PREFIXES.find(([prefix]) => pathname.startsWith(prefix));
  return prefixMatch?.[1] ?? "Dashboard";
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile, retry: false });

  const targetExamsLabel = profile?.target_exams?.length
    ? `Target: ${profile.target_exams.map((exam) => exam.name).join(", ")}`
    : undefined;
  const initial = profile?.name?.trim()?.[0]?.toUpperCase() ?? "?";

  return (
    <StudentGuard>
      <div className="flex min-h-screen bg-bg">
        <AppSidebar targetExamsLabel={targetExamsLabel} />
        <div className="flex flex-1 flex-col">
          <DashboardHeader title={resolveTitle(pathname)} initial={initial} />
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </StudentGuard>
  );
}
