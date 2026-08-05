"use client";

import { Lock, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { TargetExamMultiSelect } from "@/components/exam/TargetExamMultiSelect";
import { login, register, sendPhoneOtp } from "@/services/auth.service";
import { getApiErrorMessage } from "@/utils/api-error";

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [targetExams, setTargetExams] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSendOtp(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await sendPhoneOtp(phone);
      setDevOtp(result.debug_otp ?? null);
      toast.success("OTP sent to your mobile number");
      setStep("otp");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not send OTP"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        phone,
        otp_code: otpCode,
        target_exams: targetExams.length > 0 ? targetExams : undefined,
        password,
      });
      toast.success("Registration successful. Logging you in...");
      await login({ identifier: email, password });
      router.push("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not create your account"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleRegister} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter the OTP sent to <span className="font-medium text-foreground">{phone}</span>.
        </p>
        {devOtp && (
          <p className="rounded-md bg-muted p-2 text-xs text-muted-foreground">
            Dev mode (no SMS gateway configured) — your OTP is <span className="font-mono">{devOtp}</span>
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="otp">OTP</Label>
          <Input
            id="otp"
            required
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="123456"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Verify & Create Account"}
        </Button>
        <button
          type="button"
          className="w-full text-center text-sm text-muted-foreground hover:underline"
          onClick={() => setStep("details")}
        >
          Change mobile number
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="name"
            required
            className="pl-8"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rahul Kumar"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            required
            className="pl-8"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <div className="relative">
          <Phone className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="phone"
            required
            className="pl-8"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Target Exam(s)</Label>
        <TargetExamMultiSelect value={targetExams} onChange={setTargetExams} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
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
      <Button type="submit" className="w-full" disabled={isSubmitting || !phone}>
        {isSubmitting ? "Sending OTP..." : "Send OTP"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-primary hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}
