import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell tagline="We'll help you get back into your account safely.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
