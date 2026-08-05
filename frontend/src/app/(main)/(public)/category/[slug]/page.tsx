import { CategoryDetailClient } from "@/features/exam/CategoryDetailClient";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryDetailClient slug={slug} />;
}
