"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

import { AdminGuard } from "@/components/common/AdminGuard";
import { AdminSidebar } from "@/components/common/AdminSidebar";
import { DashboardHeader } from "@/components/common/DashboardHeader";
import { getProfile } from "@/services/auth.service";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/questions": "Questions",
  "/admin/questions/import": "Bulk import",
  "/admin/scheduler": "Exam management",
  "/admin/categories": "Exam management",
  "/admin/students": "Students",
  "/admin/payments": "Payments",
};

const PAGE_TITLE_PREFIXES: [string, string][] = [
  ["/admin/scheduler/", "Exam management"],
  ["/admin/categories/", "Exam management"],
];

function resolveTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const prefixMatch = PAGE_TITLE_PREFIXES.find(([prefix]) => pathname.startsWith(prefix));
  return prefixMatch?.[1] ?? "Admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile, retry: false });
  const initial = profile?.name?.trim()?.[0]?.toUpperCase() ?? "A";

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-bg">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader title={resolveTitle(pathname)} initial={initial} avatarHref="/admin" />
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
