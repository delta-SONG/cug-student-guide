"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ContentItem, StudentLevel } from "../../lib/content";
import { categories, categoryLabel, daysUntil, sourceLabels } from "../../lib/content";

type LevelFilter = StudentLevel | "all";
const levelLabels: Record<StudentLevel, string> = { undergraduate: "本科生", graduate: "研究生", both: "本研通用" };

type HomeExplorerProps = {
  items: ContentItem[];
  mode?: "home" | "explore";
  initialLevel?: LevelFilter;
  initialQuery?: string;
  initialCategory?: string;
  initialSource?: string;
};

export function HomeExplorer({ items, mode = "home", initialLevel = "all", initialQuery = "", initialCategory = "all", initialSource = "all" }: HomeExplorerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [source, setSource] = useState(initialSource);
  const [level, setLevel] = useState<LevelFilter>(initialLevel);

  useEffect(() => { fetch("/api/official/refresh", { method: "POST" }).catch(() => undefined); }, []);

  const matchesLevel = useCallback((item: ContentItem) => level === "all" || item.studentLevel === level || item.studentLevel === "both", [level]);
  const filtered = useMemo(() => items.filter((item) => {
    const haystack = `${item.title} ${item.summary} ${item.sourceName} ${item.audience}`.toLowerCase();
    return matchesLevel(item) && (!query || haystack.includes(query.toLowerCase())) && (category === "all" || item.category === category) && (source === "all" || item.sourceType === source);
  }), [items, query, category, source, matchesLevel]);

  const deadlineItems = items.filter((item) => {
    const days = daysUntil(item.deadlineAt);
    return matchesLevel(item) && days !== null && days >= 0;
  }).sort((a, b) => new Date(a.deadlineAt!).getTime() - new Date(b.deadlineAt!).getTime()).slice(0, 3);

  const heroTitle = level === "undergraduate" ? "本科生活" : level === "graduate" ? "研究生生活" : "校园信息";
  const heroCopy = level === "undergraduate" ? "选课、社团、竞赛、保研与留学信息，集中为本科生整理。" : level === "graduate" ? "培养、竞赛、学术活动与升学事务，集中为研究生整理。" : "把散落在官网、学院和学生组织里的通知整理成可信、清楚、好找的校园指南。";

  return <main>
    {mode === "home" && <><section className="hero">
      <div className="hero-contours" aria-hidden="true" />
      <div className="hero-copy"><span className="eyebrow">中国地质大学（武汉）学生信息平台</span><h1>{heroTitle}，<br/><em>一处查清。</em></h1><p>{heroCopy}</p>
        <div className="audience-switch" aria-label="选择学生阶段"><a className="active" href="/explore">全部信息</a><a href="/undergraduate"><span>本</span>本科生专区</a><a href="/graduate"><span>研</span>研究生专区</a></div>
        <form className="hero-search" action="/explore" method="get"><label className="sr-only" htmlFor="hero-query">搜索校园信息</label><span aria-hidden="true">⌕</span><input id="hero-query" name="q" defaultValue="" placeholder="搜索课程、社团、竞赛或升学信息…"/><button type="submit">开始查找</button></form>
        <div className="trust-row"><span><i className="dot official"/>官方来源可追溯</span><span><i className="dot reviewed"/>学生投稿先审核</span><span><i className="dot fresh"/>本研对象分开标注</span></div>
      </div>
      <aside className="deadline-panel"><div className="panel-heading"><span>近期截止</span><small>按时间排序</small></div>{deadlineItems.length ? deadlineItems.map((item) => { const days = daysUntil(item.deadlineAt); return <Link key={item.id} href={`/item/${item.id}`} className="deadline-row"><div className="deadline-date"><strong>{new Date(item.deadlineAt!).getDate()}</strong><small>{new Date(item.deadlineAt!).getMonth()+1}月</small></div><div><b>{item.title}</b><span>{days === 0 ? "今天截止" : `${days}天后截止`} · {item.audience}</span></div></Link>; }) : <div className="empty-mini">暂无临近截止事项</div>}<a className="panel-more" href="/explore">查看全部信息 →</a></aside>
    </section>

    <section className="path-section" aria-label="学生专区入口"><a href="/undergraduate" className="path-card undergraduate" aria-label="进入本科生专区"><span className="path-mark">本</span><div><small>UNDERGRADUATE</small><h2>本科生专区</h2><p>选课、课程体验、社团、竞赛、保研与留学</p></div><b>进入专区 →</b></a><a href="/graduate" className="path-card graduate" aria-label="进入研究生专区"><span className="path-mark">研</span><div><small>GRADUATE</small><h2>研究生专区</h2><p>培养事务、学术活动、实践竞赛与研究生服务</p></div><b>进入专区 →</b></a></section>

    <section className="category-section"><div className="section-title"><div><span className="eyebrow">QUICK ACCESS</span><h2>你现在想了解什么？</h2></div><p>九个常用方向，官方通知、非官方参考与学生经验分开呈现。</p></div><div className="category-grid">{categories.map((item) => <a key={item.slug} className="category-card" href={`/explore?category=${item.slug}`}><span>{item.mark}</span><b>{item.label}</b><small>{item.description}</small><i>→</i></a>)}</div></section>

    <section className="source-explainer"><div><span className="eyebrow light">SOURCE LABELS</span><h2>每条信息，都说明从哪里来</h2><p>平台不替学校发布政策，也不把第三方整理或个人体验包装成官方结论。</p></div><div className="source-legend"><div><span className="source-pill official">官方渠道</span><p>链接来自已核验的校方域名，展示原文与核验时间。</p></div><div><span className="source-pill campus_org">校内组织</span><p>来自经确认的学院、学生会或社团公开渠道。</p></div><div><span className="source-pill external">非官方参考</span><p>第三方平台或独立站点整理，可能过时或带有商业属性。</p></div><div><span className="source-pill student">学生经验</span><p>个人亲历与方法分享，经审核后发布，供参考而非定论。</p></div></div></section></>}

    {mode === "explore" && <section className="explore-section standalone-explore" id="explore"><div className="breadcrumb"><Link href="/">首页</Link><span>›</span><span>{level === "all" ? "信息广场" : `${levelLabels[level as StudentLevel]}专区`}</span></div><div className="explore-head"><div><span className="eyebrow">INFORMATION DESK</span><h1>{level === "all" ? "信息广场" : `${levelLabels[level as StudentLevel]}信息`}</h1><p>按学生阶段、分类和来源筛选；每条信息均保留来源与核验状态。</p></div><div className="filters"><select aria-label="按学生阶段筛选" value={level} onChange={(e)=>setLevel(e.target.value as LevelFilter)}><option value="all">全部学生</option><option value="undergraduate">本科生</option><option value="graduate">研究生</option></select><select aria-label="按分类筛选" value={category} onChange={(e)=>setCategory(e.target.value)}><option value="all">全部分类</option>{categories.map((item)=><option value={item.slug} key={item.slug}>{item.label}</option>)}</select><select aria-label="按来源筛选" value={source} onChange={(e)=>setSource(e.target.value)}><option value="all">全部来源</option><option value="official">官方渠道</option><option value="campus_org">校内组织</option><option value="external">非官方参考</option><option value="student">学生经验</option></select></div></div>
      <div className="explore-query"><label htmlFor="explore-query">关键词</label><input id="explore-query" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="搜索标题、摘要、来源或适用对象" /></div>
      <div className="result-meta"><span>找到 <strong>{filtered.length}</strong> 条信息</span>{(query || category !== "all" || source !== "all") && <button onClick={()=>{setQuery("");setCategory("all");setSource("all")}}>清除筛选</button>}</div>
      <div className="info-grid">{filtered.map((item) => { const days = daysUntil(item.deadlineAt); const expired = item.validity === "expired" || (days !== null && days < 0); return <article className="info-card" key={item.id}><div className="card-top"><div><span className={`source-pill ${item.sourceType}`}>{sourceLabels[item.sourceType]}</span><span className={`level-pill ${item.studentLevel}`}>{levelLabels[item.studentLevel]}</span></div><span className="category-text">{categoryLabel(item.category)}</span></div><h3><Link href={`/item/${item.id}`}>{item.title}</Link></h3><p>{item.summary}</p><div className="card-meta"><span>{item.sourceName}</span><span>{item.checkedAt ? `核验 ${item.checkedAt}` : "待核验"}</span></div>{item.validity === "possibly_invalid" && !item.deadlineAt && <div className="deadline-tag expired">信息可能已变化</div>}{item.deadlineAt && <div className={expired ? "deadline-tag expired" : "deadline-tag"}>{expired ? "报名已截止" : `距截止 ${days} 天`}</div>}<Link className="card-link" href={`/item/${item.id}`}>查看详情 <span>↗</span></Link></article>; })}</div>{filtered.length === 0 && <div className="empty-state"><strong>没有找到匹配内容</strong><p>换个关键词，或清除筛选条件再试试。</p></div>}
    </section>}
  </main>;
}
