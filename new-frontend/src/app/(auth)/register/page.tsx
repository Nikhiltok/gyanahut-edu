import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell tagline="Create your account and get your first practice set in under two minutes.">
      <RegisterForm />
    </AuthShell>
  );
}
