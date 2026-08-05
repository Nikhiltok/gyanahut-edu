"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/api-error";
import { forgotPassword } from "@/services/auth.service";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-full flex-col justify-center">
      <h1 className="font-heading text-[22px] font-semibold text-fg">Forgot password</h1>
      <p className="mt-1.5 text-[12.5px] text-muted-fg">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {sent ? (
        <p className="mt-6 rounded-md bg-success-bg px-3.5 py-3 text-[13px] text-success-fg">
          If an account with that email exists, a reset link has been sent.
        </p>
      ) : (
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-[12.5px] text-muted-fg">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-accent-fg hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
