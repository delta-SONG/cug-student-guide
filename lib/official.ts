import { rawDb } from "./db";
import { cleanText, makeId } from "./security";

const officialSources = [
  { name: "学校官网", url: "https://www.cug.edu.cn/", category: "activity" },
  { name: "教务处", url: "https://jwc.cug.edu.cn/", category: "course" },
  { name: "校团委", url: "https://youth.cug.edu.cn/", category: "activity" },
  { name: "研究生院", url: "https://graduate.cug.edu.cn/", category: "exam" },
  { name: "国际合作处", url: "https://gjhzc.cug.edu.cn/", category: "abroad" },
];

function absoluteUrl(href: string, base: string) {
  try {
    const url = new URL(href, base);
    if (url.protocol !== "https:" || !url.hostname.endsWith("cug.edu.cn")) return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function stripHtml(value: string) {
  return cleanText(value.replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&"), 180);
}

export async function refreshOfficialSources(force = false) {
  const db = rawDb();
  if (!force) {
    const latest = await db.prepare("SELECT started_at FROM ingestion_runs WHERE status = 'success' ORDER BY started_at DESC LIMIT 1").first<{ started_at: string }>();
    if (latest && Date.now() - new Date(`${latest.started_at}Z`).getTime() < 86_400_000) {
      return { skipped: true, count: 0 };
    }
  }

  const run = await db.prepare("INSERT INTO ingestion_runs (status) VALUES ('running') RETURNING id").first<{ id: number }>();
  let count = 0;
  try {
    for (const source of officialSources) {
      await db.prepare(`INSERT INTO sources (name, base_url, kind, verified, active, last_checked_at)
        VALUES (?, ?, 'official', 1, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(base_url) DO UPDATE SET name = excluded.name, verified = 1, active = 1, last_checked_at = CURRENT_TIMESTAMP`
      ).bind(source.name, source.url).run();

      const html = await fetch(source.url, { headers: { "User-Agent": "CUG-Guide/1.0 source-indexer" } }).then((response) => {
        if (!response.ok) throw new Error(`${source.name}: ${response.status}`);
        return response.text();
      });
      const links = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
      for (const match of links.slice(0, 120)) {
        const title = stripHtml(match[2]);
        const url = absoluteUrl(match[1], source.url);
        if (!url || title.length < 10 || title.length > 90) continue;
        const result = await db.prepare(`INSERT OR IGNORE INTO content_items
          (id, category, title, summary, body, audience, source_type, source_name, source_url, canonical_url, checked_at, status)
          VALUES (?, ?, ?, ?, '', '全体学生', 'official', ?, ?, ?, CURRENT_TIMESTAMP, 'pending')`
        ).bind(makeId("official"), source.category, title, `来自${source.name}的官方信息索引，发布前需管理员复核。`, source.name, url, url).run();
        if (result.meta.changes) count += 1;
        if (count >= 30) break;
      }
      if (count >= 30) break;
    }
    await db.prepare("UPDATE ingestion_runs SET status = 'success', finished_at = CURRENT_TIMESTAMP, item_count = ? WHERE id = ?").bind(count, run?.id ?? 0).run();
    return { skipped: false, count };
  } catch (error) {
    await db.prepare("UPDATE ingestion_runs SET status = 'failed', finished_at = CURRENT_TIMESTAMP, error = ? WHERE id = ?")
      .bind(error instanceof Error ? error.message.slice(0, 500) : "未知错误", run?.id ?? 0).run();
    throw error;
  }
}
