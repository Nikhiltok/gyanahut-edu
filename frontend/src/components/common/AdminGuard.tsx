"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { getProfile } from "@/services/auth.service";
import { clearTokens } from "@/utils/token-storage";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      router.replace("/login?next=/admin-dashboard");
      return;
    }
    if (profile && profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN") {
      // A non-admin account is currently logged in (e.g. a student session from
      // earlier testing). Don't silently bounce them to their own dashboard —
      // clear that session and send them to login so they can sign in as admin.
      clearTokens();
      router.replace("/login?next=/admin-dashboard");
    }
  }, [profile, isError, router]);

  if (isLoading || !profile || (profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN")) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
