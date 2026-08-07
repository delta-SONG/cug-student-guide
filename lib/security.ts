import type { ChatGPTUser } from "../app/chatgpt-auth";

export function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function safeHttpUrl(value: unknown) {
  if (!value) return null;
  if (typeof value !== "string") throw new Error("链接格式不正确");
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error("只支持 http/https 链接");
  url.hash = "";
  return url.toString();
}

export function isOfficialUrl(value: string | null | undefined) {
  if (!value) return false;
  try {
    const host = new URL(value).hostname.toLowerCase();
    return host === "cug.edu.cn" || host.endsWith(".cug.edu.cn");
  } catch {
    return false;
  }
}

export function isAdmin(user: ChatGPTUser) {
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.includes(user.email.toLowerCase());
}

export function makeId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}
