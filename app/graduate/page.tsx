import type { ContentItem } from "../../lib/content";
import { seedItems } from "../../lib/content";
import { getPublishedContent } from "../../lib/db";
import { HomeExplorer } from "../components/HomeExplorer";

export const dynamic = "force-dynamic";
export default async function GraduatePage() {
  let communityItems: ContentItem[] = [];
  try { communityItems = await getPublishedContent(); } catch { communityItems = []; }
  return <HomeExplorer items={[...communityItems, ...seedItems]} mode="explore" initialLevel="graduate" />;
}
