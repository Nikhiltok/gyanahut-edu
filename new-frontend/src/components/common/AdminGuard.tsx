"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getProfile } from "@/services/auth.service";
import { clearTokens } from "@/utils/token-storage";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });

  const isAdmin = profile?.role === "ADMIN" || profile?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (isError) {
      router.replace("/login?next=/admin");
      return;
    }
    if (profile && !isAdmin) {
      clearTokens();
      router.replace("/login?next=/admin");
    }
  }, [profile, isAdmin, isError, router]);

  if (isLoading || !profile || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-sm text-muted-fg">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
