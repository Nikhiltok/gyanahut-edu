import { Suspense } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthShell tagline="Choose a new password to secure your account.">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
