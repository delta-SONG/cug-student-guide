import { env } from "cloudflare:workers";
import type { ChatGPTUser } from "../app/chatgpt-auth";
import type { ContentItem } from "./content";
import { isAdmin } from "./security";

export function rawDb() {
  if (!env.DB) throw new Error("数据库尚未连接");
  return env.DB;
}

export async function ensureUser(user: ChatGPTUser) {
  const role = isAdmin(user) ? "admin" : "student";
  await rawDb().prepare(`
    INSERT INTO users (id, email, display_name, role)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      email = excluded.email,
      display_name = excluded.display_name,
      role = excluded.role,
      updated_at = CURRENT_TIMESTAMP
  `).bind(user.userId, user.email, user.displayName, role).run();
}

export async function getPublishedContent(): Promise<ContentItem[]> {
  const result = await rawDb().prepare(`
    SELECT id, category, title, summary, body, audience, student_level AS studentLevel, campus, college,
      source_type AS sourceType, COALESCE(source_name, '学生投稿') AS sourceName,
      source_url AS sourceUrl, source_published_at AS sourcePublishedAt,
      checked_at AS checkedAt, deadline_at AS deadlineAt, validity
    FROM content_items
    WHERE status = 'published'
    ORDER BY COALESCE(deadline_at, created_at) DESC
    LIMIT 100
  `).all<ContentItem>();
  return result.results;
}

export async function getContentById(id: string): Promise<ContentItem | null> {
  return rawDb().prepare(`
    SELECT id, category, title, summary, body, audience, student_level AS studentLevel, campus, college,
      source_type AS sourceType, COALESCE(source_name, '学生投稿') AS sourceName,
      source_url AS sourceUrl, source_published_at AS sourcePublishedAt,
      checked_at AS checkedAt, deadline_at AS deadlineAt, validity
    FROM content_items WHERE id = ? AND status = 'published' LIMIT 1
  `).bind(id).first<ContentItem>();
}
