import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentById } from "../../../lib/db";
import { categoryLabel, seedItems, sourceLabels } from "../../../lib/content";

export const dynamic = "force-dynamic";

async function findItem(id: string) {
  const seeded = seedItems.find((item) => item.id === id);
  if (seeded) return seeded;
  try { return await getContentById(id); } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const item = await findItem((await params).id);
  return item ? { title: item.title, description: item.summary } : { title: "信息未找到" };
}

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const item = await findItem((await params).id);
  if (!item) notFound();
  const deadline = item.deadlineAt ? new Date(item.deadlineAt) : null;
  const expired = item.validity === "expired" || (deadline && deadline.getTime() < Date.now());
  return <main className="page-shell"><div className="breadcrumb"><Link href="/">首页</Link><span>›</span><span>{categoryLabel(item.category)}</span><span>›</span><span>详情</span></div><div className="detail-layout"><article className="detail-main"><span className={`source-pill ${item.sourceType}`}>{sourceLabels[item.sourceType]}</span><h1>{item.title}</h1><p className="detail-lead">{item.summary}</p><div className="detail-body"><p>{item.body}</p>{expired && <p className="notice">该事项已过截止日期，页面仅保留作参考。请不要使用旧报名链接提交个人材料。</p>}</div></article><aside className="detail-side"><div className="side-card"><h3>信息卡片</h3><div className="fact"><small>适用对象</small><span>{item.audience}</span></div><div className="fact"><small>信息来源</small><span>{item.sourceName}</span></div>{item.sourcePublishedAt && <div className="fact"><small>原文发布时间</small><span>{item.sourcePublishedAt}</span></div>}<div className="fact"><small>最近核验</small><span>{item.checkedAt ?? "待核验"}</span></div>{deadline && <div className="fact"><small>截止时间</small><span>{deadline.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</span></div>}{item.sourceUrl && <a className="source-button" href={item.sourceUrl} target="_blank" rel="noreferrer">打开原始来源 ↗</a>}</div><div className="notice">平台提供信息索引，不代替校方正式通知。涉及报名、费用、学分与资格时，请务必查看原文。</div></aside></div></main>;
}
