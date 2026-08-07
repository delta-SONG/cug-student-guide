import { notFound } from "next/navigation";
import { requireChatGPTUser } from "../chatgpt-auth";
import { ensureUser, rawDb } from "../../lib/db";
import { isAdmin } from "../../lib/security";
import { AdminConsole } from "../components/AdminConsole";

export const dynamic="force-dynamic";
export type PendingRow={id:string;title:string;summary:string;source_type:string;source_name:string|null;source_url:string|null;created_at:string};
export default async function AdminPage(){const user=await requireChatGPTUser("/admin");if(!isAdmin(user))notFound();let rows:PendingRow[]=[];let dbReady=true;try{await ensureUser(user);rows=(await rawDb().prepare("SELECT id,title,summary,source_type,source_name,source_url,created_at FROM content_items WHERE status='pending' ORDER BY created_at ASC LIMIT 100").all<PendingRow>()).results;}catch{dbReady=false;}return <main className="page-shell"><div className="page-title"><span className="eyebrow">MODERATION DESK</span><h1>信息审核台</h1><p>官方聚合和学生投稿都先进入这里。批准前请核对来源、分类、时效和隐私风险。</p></div>{dbReady?<AdminConsole initialRows={rows}/>:<div className="notice">数据库尚未完成本地初始化。生成并应用迁移后，审核队列会显示在这里。</div>}</main>}
