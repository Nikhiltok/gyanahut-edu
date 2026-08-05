"use client";

import { useQuery } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProfile, logout } from "@/services/auth.service";

const NAV_LINKS = [
  { href: "/categories", label: "Exams" },
  { href: "/tests/live", label: "Live Tests" },
  { href: "/ranking", label: "Ranking" },
  { href: "/features", label: "Features" },
];

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: profile, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
    staleTime: 60 * 1000,
  });

  const isLoggedIn = !!profile && !isError;

  async function handleLogout() {
    await logout();
    toast.success("Logged out");
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.href}
              variant={pathname === link.href ? "secondary" : "ghost"}
              size="sm"
              render={<Link href={link.href} />}
            >
              {link.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {/* This is the student-facing site — admins/super-admins never get an
                  "Admin Panel" link here, only students get a Dashboard link. */}
              {profile.role === "STUDENT" && (
                <Button size="sm" variant="outline" className="hidden sm:inline-flex" render={<Link href="/dashboard" />}>
                  Dashboard
                </Button>
              )}
              <Button size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" className="hidden sm:inline-flex" render={<Link href="/login" />}>
                Login
              </Button>
              <Button size="sm" render={<Link href="/register" />}>
                Register
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              {NAV_LINKS.map((link) => (
                <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
                  {link.label}
                </DropdownMenuItem>
              ))}
              {!isLoggedIn && (
                <DropdownMenuItem render={<Link href="/login" />}>Login</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
