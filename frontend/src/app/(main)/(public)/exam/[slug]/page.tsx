import { ExamDetailClient } from "@/features/exam/ExamDetailClient";

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ExamDetailClient slug={slug} />;
}
