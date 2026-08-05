"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getProfile } from "@/services/auth.service";
import { clearTokens } from "@/utils/token-storage";

export function StudentGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      router.replace("/login?next=/dashboard");
      return;
    }
    if (profile && profile.role !== "STUDENT") {
      clearTokens();
      router.replace("/login?next=/dashboard");
    }
  }, [profile, isError, router]);

  if (isLoading || !profile || profile.role !== "STUDENT") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-sm text-muted-fg">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
