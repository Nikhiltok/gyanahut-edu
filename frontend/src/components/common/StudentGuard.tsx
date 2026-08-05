"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";
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
      // An admin/super-admin session somehow ended up here (e.g. a leftover
      // cookie from before this restriction existed). The student area is for
      // students only — send them to their own panel instead.
      clearTokens();
      router.replace("/login?next=/dashboard");
    }
  }, [profile, isError, router]);

  if (isLoading || !profile || profile.role !== "STUDENT") {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
