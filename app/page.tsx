import { HomeExplorer } from "./components/HomeExplorer";
import { getPublishedContent } from "../lib/db";
import { seedItems } from "../lib/content";
import type { ContentItem } from "../lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  let communityItems: ContentItem[] = [];
  try { communityItems = await getPublishedContent(); } catch { communityItems = []; }
  return <HomeExplorer items={[...communityItems, ...seedItems]} />;
}
