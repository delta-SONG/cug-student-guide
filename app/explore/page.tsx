import type { ContentItem, SourceType, StudentLevel } from "../../lib/content";
import { categories, seedItems } from "../../lib/content";
import { getPublishedContent } from "../../lib/db";
import { HomeExplorer } from "../components/HomeExplorer";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; category?: string; source?: string; level?: string }>;
const validSources: Array<SourceType | "all"> = ["all", "official", "campus_org", "external", "student"];
const validLevels: Array<StudentLevel | "all"> = ["all", "undergraduate", "graduate"];

export default async function ExplorePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = categories.some((item) => item.slug === params.category) ? params.category! : "all";
  const source = validSources.includes(params.source as SourceType | "all") ? params.source! : "all";
  const level = validLevels.includes(params.level as StudentLevel | "all") ? params.level as StudentLevel | "all" : "all";
  const query = typeof params.q === "string" ? params.q.slice(0, 100) : "";
  let communityItems: ContentItem[] = [];
  try { communityItems = await getPublishedContent(); } catch { communityItems = []; }
  return <HomeExplorer items={[...communityItems, ...seedItems]} mode="explore" initialLevel={level} initialQuery={query} initialCategory={category} initialSource={source} />;
}
