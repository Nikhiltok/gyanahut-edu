import { TestAttemptClient } from "@/features/test/TestAttemptClient";

export default async function TestAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TestAttemptClient testId={id} />;
}
