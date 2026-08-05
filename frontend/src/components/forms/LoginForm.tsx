"use client";

import { Lock, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { login, logout } from "@/services/auth.service";
import { setCredentials } from "@/store/slices/authSlice";
import { getApiErrorMessage } from "@/utils/api-error";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await login({ identifier, password });
      const nextParam = searchParams.get("next");
      const isAdmin = result.user.role === "ADMIN" || result.user.role === "SUPER_ADMIN";

      // The student login only accepts admin/super-admin credentials when they
      // arrived here via AdminGuard's own "please log in" redirect (next=/admin-dashboard...).
      // Anyone else with an admin account must use the Admin Panel to sign in —
      // this site's student area is for students only.
      if (isAdmin && !nextParam?.startsWith("/admin-dashboard")) {
        await logout();
        toast.error("Admins must log in from the Admin Panel, not here.");
        return;
      }

      dispatch(setCredentials(result.user));
      toast.success("Logged in successfully");
      router.push(nextParam || (isAdmin ? "/admin-dashboard" : "/dashboard"));
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Invalid email/mobile number or password"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="identifier">Email or Phone Number</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="identifier"
            required
            className="pl-8"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com or 9876543210"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-2.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
          <PasswordInput
            id="password"
            required
            className="pl-8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>
      </div>
      <Button
        type="submit"
        className="h-14 w-full bg-gradient-to-r from-primary to-[#721315] text-base font-semibold hover:opacity-90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </a>
      </p>
    </form>
  );
}
