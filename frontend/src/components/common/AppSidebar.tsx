"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bookmark,
  CalendarClock,
  Flame,
  History,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Trophy,
  User,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProfile, logout } from "@/services/auth.service";

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
      { href: "/practice/generate", icon: Sparkles, label: "Infinite Test" },
      { href: "/tests/live", icon: Zap, label: "Live Tests" },
      { href: "/tests/upcoming", icon: CalendarClock, label: "Upcoming Tests" },
      { href: "/exam-history", icon: History, label: "Exam History" },
      { href: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
      { href: "/profile/wallet", icon: Wallet, label: "Wallet" },
    ],
  },
  {
    label: "Analysis",
    items: [
      { href: "/revision/wrong", icon: XCircle, label: "Wrong Questions" },
      { href: "/revision/difficult", icon: Flame, label: "Difficult Questions" },
      { href: "/ranking", icon: Trophy, label: "Ranking" },
    ],
  },
];

const PROFILE_ITEM = { href: "/profile", icon: User, label: "Profile" };
const NAV_ITEMS = [...NAV_GROUPS.flatMap((group) => group.items), PROFILE_ITEM];

function NavLink({ href, icon: Icon, label, isActive }: (typeof NAV_ITEMS)[number] & { isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg border-l-4 px-2.5 py-2 text-sm font-medium transition-colors",
        isActive
          ? "border-[#f97316] bg-[#fdf1ea] text-[#f97316]"
          : "border-transparent text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  async function handleLogout() {
    await logout();
    toast.success("Logged out");
    router.push("/login");
  }

  const subtitle = profile?.target_exams?.length
    ? profile.target_exams.map((e) => e.name).join(", ")
    : "Student";

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground sm:flex">
        <div className="p-4 pb-8">
          <Logo />
          <p className="mt-1 truncate text-xs text-sidebar-foreground/60">Target: {subtitle}</p>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label ?? "main"} className="space-y-1">
              {group.label && (
                <p className="px-3 text-xs font-semibold tracking-wide text-sidebar-foreground/50 uppercase">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => (
                <NavLink key={item.href} {...item} isActive={pathname === item.href} />
              ))}
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-sidebar-border p-4">
          <NavLink {...PROFILE_ITEM} isActive={pathname === PROFILE_ITEM.href} />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex items-center justify-between gap-2 border-b p-3 sm:hidden">
        <Logo className="text-sm" />
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="size-4" />
        </Button>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-b p-3 sm:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
