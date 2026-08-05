import { SubjectChaptersClient } from "@/features/exam/SubjectChaptersClient";

export default async function SubjectChaptersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SubjectChaptersClient subjectId={id} />;
}
