"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/api-error";
import { resetPassword } from "@/services/auth.service";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await resetPassword(uid, token, password);
      toast.success("Password reset successful. Please log in.");
      router.push("/login");
    } catch (error) {
      toast.error(getErrorMessage(error, "This reset link is invalid or expired."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-full flex-col justify-center">
      <h1 className="font-heading text-[22px] font-semibold text-fg">Reset password</h1>
      <p className="mt-1.5 text-[12.5px] text-muted-fg">Enter a new password for your account.</p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <p className="mt-2 text-[11.5px] text-muted-fg">
            Use at least 8 characters with a number and a symbol.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset password"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[12.5px]">
        <Link href="/login" className="font-medium text-accent-fg hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
