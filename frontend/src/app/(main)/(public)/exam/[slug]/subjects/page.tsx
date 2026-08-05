import { ExamSubjectsClient } from "@/features/exam/ExamSubjectsClient";

export default async function ExamSubjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ExamSubjectsClient slug={slug} />;
}
