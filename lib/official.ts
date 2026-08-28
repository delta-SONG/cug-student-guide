import { rawDb } from "./db";
import { cleanText, makeId } from "./security";

const officialSources = [
  { name: "学校官网", url: "https://www.cug.edu.cn/", category: "activity", studentLevel: "both" },
  { name: "教务处", url: "https://jwc.cug.edu.cn/", category: "course", studentLevel: "undergraduate" },
  { name: "校团委", url: "https://youth.cug.edu.cn/", category: "activity", studentLevel: "both" },
  { name: "研究生院", url: "https://graduate.cug.edu.cn/", category: "exam", studentLevel: "graduate" },
  { name: "国际合作处", url: "https://gjhzc.cug.edu.cn/", category: "abroad", studentLevel: "both" },
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
  const warnings: string[] = [];
  try {
    for (const source of officialSources) {
      try {
        await db.prepare(`INSERT INTO sources (name, base_url, kind, verified, active, last_checked_at)
          VALUES (?, ?, 'official', 1, 1, CURRENT_TIMESTAMP)
          ON CONFLICT(base_url) DO UPDATE SET name = excluded.name, verified = 1, active = 1, last_checked_at = CURRENT_TIMESTAMP`
        ).bind(source.name, source.url).run();

        const html = await fetch(source.url, { headers: {
          "User-Agent": "Mozilla/5.0 (compatible; CUG-Student-Guide/1.0; +https://cug-student-guide.shawn321song321.chatgpt.site)",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "zh-CN,zh;q=0.9",
        } }).then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.text();
        });
        const links = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
        let sourceCount = 0;
        for (const match of links.slice(0, 160)) {
          const title = stripHtml(match[2]);
          const url = absoluteUrl(match[1], source.url);
          if (!url || title.length < 10 || title.length > 90) continue;
          const result = await db.prepare(`INSERT OR IGNORE INTO content_items
            (id, category, title, summary, body, audience, student_level, source_type, source_name, source_url, canonical_url, checked_at, status)
            VALUES (?, ?, ?, ?, '', '全体学生', ?, 'official', ?, ?, ?, CURRENT_TIMESTAMP, 'pending')`
          ).bind(makeId("official"), source.category, title, `来自${source.name}的官方信息索引，发布前需管理员复核。`, source.studentLevel, source.name, url, url).run();
          if (result.meta.changes) {
            count += 1;
            sourceCount += 1;
          }
          if (sourceCount >= 12) break;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "未知错误";
        warnings.push(`${source.name}: ${message}`);
      }
    }
    if (warnings.length === officialSources.length) throw new Error(warnings.join("；"));
    await db.prepare("UPDATE ingestion_runs SET status = 'success', finished_at = CURRENT_TIMESTAMP, item_count = ?, error = ? WHERE id = ?")
      .bind(count, warnings.length ? warnings.join("；").slice(0, 500) : null, run?.id ?? 0).run();
    return { skipped: false, count, warnings };
  } catch (error) {
    await db.prepare("UPDATE ingestion_runs SET status = 'failed', finished_at = CURRENT_TIMESTAMP, error = ? WHERE id = ?")
      .bind(error instanceof Error ? error.message.slice(0, 500) : "未知错误", run?.id ?? 0).run();
    throw error;
  }
}
