import { ChapterTopicsClient } from "@/features/exam/ChapterTopicsClient";

export default async function ChapterTopicsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChapterTopicsClient chapterId={id} />;
}
