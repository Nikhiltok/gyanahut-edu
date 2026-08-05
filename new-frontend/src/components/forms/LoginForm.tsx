"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/api-error";
import { login, logout } from "@/services/auth.service";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

      // The student login only accepts admin credentials when they arrived here via
      // AdminGuard's own "please log in" redirect (next=/admin...). Anyone else with
      // an admin account must be sent to the admin panel instead of the student one.
      if (isAdmin && !nextParam?.startsWith("/admin")) {
        await logout();
        toast.error("Admins must log in from the Admin Panel, not here.");
        return;
      }

      router.push(nextParam || (isAdmin ? "/admin" : "/dashboard"));
    } catch (error) {
      toast.error(getErrorMessage(error, "Invalid credentials."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-full flex-col justify-center">
      <h1 className="font-heading text-[22px] font-semibold text-fg">Login</h1>
      <p className="mt-1.5 text-[12.5px] text-muted-fg">Enter your details to resume your preparation.</p>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="identifier">Email or phone number</Label>
          <Input
            id="identifier"
            placeholder="name@example.com or 98xxxxxxxx"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="mb-1.5">
              Password
            </Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <div className="mt-2 text-right">
            <Link href="/forgot-password" className="text-xs font-medium text-accent-fg hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center text-[12.5px] text-muted-fg">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-accent-fg hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
