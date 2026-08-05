import { Suspense } from "react";

import { QuestionImportClient } from "@/features/questions/QuestionImportClient";

export default function QuestionImportPage() {
  return (
    <Suspense fallback={null}>
      <QuestionImportClient />
    </Suspense>
  );
}
