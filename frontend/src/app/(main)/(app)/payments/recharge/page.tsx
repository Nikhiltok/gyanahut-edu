import { Suspense } from "react";

import { RechargeClient } from "@/features/payments/RechargeClient";

export default function RechargePage() {
  return (
    <Suspense fallback={null}>
      <RechargeClient />
    </Suspense>
  );
}
