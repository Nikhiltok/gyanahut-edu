"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Exams", href: "/exams" },
  { label: "Features", href: "/features" },
];

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="flex h-[72px] items-center justify-between bg-sidebar-bg px-8 md:px-16">
      <div className="flex items-center gap-10">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "text-sm font-medium",
                pathname === link.href ? "text-gold" : "text-white/85 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle className="border-white/50 text-white hover:bg-white/10" />
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-white/50 text-white hover:bg-white/10")}
        >
          Login
        </Link>
        <Link href="/register" className={buttonVariants({ size: "sm" })}>
          Get started
        </Link>
      </div>
    </header>
  );
}
