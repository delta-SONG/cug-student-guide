import { getChatGPTUser, chatGPTSignInPath } from "../chatgpt-auth";
import { ReviewForm } from "../components/ReviewForm";

export const dynamic = "force-dynamic";
export default async function CoursesPage() {
  const user = await getChatGPTUser();
  return <main className="page-shell"><div className="page-title"><span className="eyebrow">COURSE EXPERIENCE</span><h1>课程与教学体验</h1><p>评价必须关联具体课程和学期，仅展示经审核的结构化体验。这里不提供脱离教学场景的人身评价，也不会公开投稿者身份。</p></div>{user ? <ReviewForm /> : <div className="form-card"><h2>登录后提交匿名评价</h2><p>浏览始终公开；登录仅用于防止重复评价和处理滥用，前台不会展示你的身份。</p><a className="account-button" href={chatGPTSignInPath("/courses")}>使用 ChatGPT 登录</a></div>}</main>;
}
