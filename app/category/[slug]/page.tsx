import { notFound } from "next/navigation";
import { HomeExplorer } from "../../components/HomeExplorer";
import { categories, seedItems } from "../../../lib/content";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  if (!categories.some((item) => item.slug === slug)) notFound();
  return <HomeExplorer items={seedItems.filter((item) => item.category === slug)} />;
}
