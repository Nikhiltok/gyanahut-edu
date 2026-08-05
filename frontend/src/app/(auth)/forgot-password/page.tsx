import { AuthCard } from "@/components/common/AuthCard";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Forgot password" description="We'll email you a link to reset it.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
