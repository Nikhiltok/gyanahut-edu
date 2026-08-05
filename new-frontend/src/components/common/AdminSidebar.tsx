"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils";
import { logout } from "@/services/auth.service";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { section: "QUESTION MANAGEMENT" },
  { label: "Questions", href: "/admin/questions" },
  { label: "Exam management", href: "/admin/scheduler" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Students", href: "/admin/students" },
  { label: "Payments", href: "/admin/payments" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <aside className="flex h-screen w-[210px] shrink-0 flex-col bg-sidebar-bg py-5">
      <div className="px-6">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <span className="mt-2.5 inline-block rounded-[5px] bg-gold/[0.22] px-2.5 py-1 font-mono text-[10px] font-medium text-chip-fg">
          ADMIN
        </span>
      </div>

      <nav className="mt-6 flex-1 space-y-0.5">
        {NAV_ITEMS.map((item, index) =>
          "section" in item ? (
            <p key={index} className="px-6 pb-1 pt-5 text-[10px] font-semibold tracking-wide text-white/40">
              {item.section}
            </p>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-6 py-2.5 text-[13px] transition-colors",
                isActive(item.href)
                  ? "bg-sidebar-active-bg font-semibold text-sidebar-active-fg"
                  : "text-sidebar-fg hover:bg-white/5",
              )}
            >
              {item.label}
            </Link>
          ),
        )}
      </nav>

      <div className="mt-auto border-t border-white/15 pt-3">
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
