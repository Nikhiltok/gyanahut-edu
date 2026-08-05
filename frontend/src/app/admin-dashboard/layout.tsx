"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminGuard } from "@/components/common/AdminGuard";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin-dashboard", label: "Dashboard" },
  { href: "/admin-dashboard/exam-management", label: "Question Management" },
  { href: "/admin-dashboard/questions", label: "Questions" },
  { href: "/admin-dashboard/scheduler", label: "Exam Management" },
  { href: "/admin-dashboard/students", label: "Students" },
  { href: "/admin-dashboard/payments", label: "Payments" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <aside className="w-56 shrink-0 border-r p-4">
          <p className="mb-4 text-lg font-semibold">Admin Panel</p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/admin-dashboard" ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </AdminGuard>
  );
}
