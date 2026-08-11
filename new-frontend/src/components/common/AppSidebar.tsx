"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils";
import { logout } from "@/services/auth.service";

const NAV_MAIN = [
  { label: "Overview", href: "/dashboard" },
  { label: "Infinite test", href: "/dashboard/infinite-test" },
  { label: "Live tests", href: "/dashboard/live-tests" },
  { label: "Upcoming tests", href: "/dashboard/upcoming-tests" },
  { label: "Exam history", href: "/dashboard/exam-history" },
  { label: "Bookmarks", href: "/dashboard/bookmarks" },
];

const NAV_ANALYSIS = [
  { label: "Wrong questions", href: "/dashboard/revision/wrong" },
  { label: "Difficult questions", href: "/dashboard/revision/difficult" },
  { label: "Ranking", href: "/dashboard/ranking" },
];

export function AppSidebar({ targetExamsLabel }: { targetExamsLabel?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  function NavItem({ label, href }: { label: string; href: string }) {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          "block px-6 py-2.5 text-[13px] transition-colors",
          active
            ? "bg-sidebar-active-bg font-semibold text-sidebar-active-fg"
            : "text-sidebar-fg hover:bg-white/5",
        )}
      >
        {label}
      </Link>
    );
  }

  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col bg-sidebar-bg py-5">
      <div className="px-6">
        <Logo />
        <p className="mt-2 text-[10.5px] text-sidebar-fg-muted">
          {targetExamsLabel ?? "Target exams not set"}
        </p>
      </div>

      <nav className="mt-6 flex-1 space-y-0.5">
        {NAV_MAIN.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}

        <p className="px-6 pb-1 pt-5 text-[10px] font-semibold tracking-wide text-white/40">ANALYSIS</p>
        {NAV_ANALYSIS.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <div className="mt-auto space-y-0.5 border-t border-white/15 px-0 pt-3">
        <NavItem label="Wallet" href="/dashboard/wallet" />
        <NavItem label="Profile" href="/dashboard/profile" />
        <NavItem label="Settings" href="/dashboard/settings" />
        <button
          type="button"
          onClick={handleLogout}
          className="block w-full px-6 py-2.5 text-left text-[13px] text-sidebar-fg-muted hover:bg-white/5"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
