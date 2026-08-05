"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { OtpInput } from "@/components/forms/OtpInput";
import { TargetExamPicker } from "@/components/forms/TargetExamPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api-error";
import { register, sendPhoneOtp } from "@/services/auth.service";

interface Details {
  name: string;
  email: string;
  phone: string;
  targetExams: string[];
  password: string;
}

const INITIAL_DETAILS: Details = { name: "", email: "", phone: "", targetExams: [], password: "" };

function StepBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full border px-3.5 py-1.5 font-mono text-[11px]",
        active
          ? "border-transparent bg-sidebar-bg text-white font-medium"
          : "border-border text-muted-fg",
      )}
    >
      {label}
    </span>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [details, setDetails] = useState<Details>(INITIAL_DETAILS);
  const [otp, setOtp] = useState("");
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSendOtp(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await sendPhoneOtp(details.phone);
      setDebugOtp(result.debug_otp ?? null);
      setStep(2);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not send OTP."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await register({
        name: details.name,
        email: details.email,
        phone: details.phone,
        otp_code: otp,
        target_exams: details.targetExams,
        password: details.password,
      });
      toast.success("Registration successful. Please log in.");
      router.push("/login");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not verify OTP."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="mb-5 flex gap-2">
        <StepBadge label="1. Details" active={step === 1} />
        <StepBadge label="2. OTP" active={step === 2} />
      </div>

      {step === 1 ? (
        <>
          <h1 className="font-heading text-xl font-semibold text-fg">Create an account</h1>
          <p className="mt-1.5 text-[12.5px] text-muted-fg">
            Tell us who you are and which exams you&apos;re targeting.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSendOtp}>
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                placeholder="Aditi Sharma"
                value={details.name}
                onChange={(e) => setDetails({ ...details, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="aditi@example.com"
                value={details.email}
                onChange={(e) => setDetails({ ...details, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="98xxxxxxxx"
                value={details.phone}
                onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Target exam(s)</Label>
              <TargetExamPicker
                value={details.targetExams}
                onChange={(targetExams) => setDetails({ ...details, targetExams })}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={details.password}
                onChange={(e) => setDetails({ ...details, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending OTP..." : "Send OTP"}
            </Button>

            <p className="text-center text-[12.5px] text-muted-fg">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-accent-fg hover:underline">
                Login
              </Link>
            </p>
          </form>
        </>
      ) : (
        <>
          <h1 className="font-heading text-xl font-semibold text-fg">Verify your number</h1>
          <p className="mt-1.5 text-[12.5px] text-muted-fg">
            We&apos;ve sent a 6-digit code to {details.phone}.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleVerify}>
            {debugOtp && (
              <div className="rounded-md bg-success-bg px-3 py-2 font-mono text-[11px] text-success-fg">
                Dev mode — no SMS gateway configured. Your code is {debugOtp}.
              </div>
            )}

            <OtpInput value={otp} onChange={setOtp} />

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || otp.length < 6}>
              {isSubmitting ? "Verifying..." : "Verify & create account"}
            </Button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="block w-full text-center text-[12.5px] font-medium text-accent-fg hover:underline"
            >
              Change mobile number
            </button>
          </form>
        </>
      )}
    </div>
  );
}
