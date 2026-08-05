import { TestDetailClient } from "@/features/test/TestDetailClient";

export default async function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TestDetailClient testId={id} />;
}
