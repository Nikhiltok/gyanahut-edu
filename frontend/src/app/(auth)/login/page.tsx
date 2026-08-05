import { Suspense } from "react";

import { AuthCard } from "@/components/common/AuthCard";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <AuthCard title="Welcome back" description="Please enter your details to continue your journey.">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
