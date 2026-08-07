"use client";
import { useState } from "react";
import { categories } from "../../lib/content";

export function SubmissionForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus("正在提交…");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/submissions", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(Object.fromEntries(form)) });
    const data = await response.json().catch(()=>({ error:"提交失败" })); setBusy(false);
    if (!response.ok) { setStatus(data.error ?? "提交失败"); return; }
    event.currentTarget.reset(); setStatus("已进入审核队列，可在“我的投稿”查看进度。");
  }
  return <form className="form-card" onSubmit={submit}><div className="form-grid"><div className="field"><label htmlFor="category">分类</label><select id="category" name="category" required>{categories.map((item)=><option value={item.slug} key={item.slug}>{item.label}</option>)}</select></div><div className="field"><label htmlFor="audience">适用对象</label><input id="audience" name="audience" maxLength={60} placeholder="例如：全体本科生" required/></div><div className="field full"><label htmlFor="title">标题</label><input id="title" name="title" maxLength={90} placeholder="用一句话说明这是什么信息" required/></div><div className="field full"><label htmlFor="summary">摘要</label><textarea id="summary" name="summary" maxLength={280} placeholder="说明时间、对象、资格或最重要的注意事项" required/></div><div className="field full"><label htmlFor="body">详细内容</label><textarea id="body" name="body" maxLength={3000} placeholder="补充流程、经验、准备建议等，不要填写他人隐私" required/></div><div className="field"><label htmlFor="sourceName">来源说明</label><input id="sourceName" name="sourceName" maxLength={80} placeholder="亲历 / 主办方 / 通知名称" required/></div><div className="field"><label htmlFor="sourceUrl">原始链接（选填）</label><input id="sourceUrl" name="sourceUrl" type="url" placeholder="https://…"/><small>即使链接来自校方，官方标签也只能由审核员授予。</small></div><div className="field"><label htmlFor="deadlineAt">截止时间（选填）</label><input id="deadlineAt" name="deadlineAt" type="datetime-local"/></div><div className="field"><label htmlFor="campus">校区（选填）</label><select id="campus" name="campus"><option value="">不限</option><option>南望山校区</option><option>未来城校区</option></select></div></div><div className="submit-row"><button className="primary-button" disabled={busy}>{busy ? "提交中…" : "提交审核"}</button><span className="form-status" role="status">{status}</span></div></form>;
}
