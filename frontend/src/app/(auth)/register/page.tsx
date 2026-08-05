import { AuthCard } from "@/components/common/AuthCard";
import { RegisterForm } from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthCard title="Create your account" description="Start practicing for your exam today.">
      <RegisterForm />
    </AuthCard>
  );
}
