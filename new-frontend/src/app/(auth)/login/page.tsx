import { Suspense } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell tagline="One roll number, every government exam you're preparing for.">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
