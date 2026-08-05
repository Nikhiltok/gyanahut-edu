import { ResultClient } from "@/features/result/ResultClient";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResultClient attemptId={id} />;
}
