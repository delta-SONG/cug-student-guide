import { requireChatGPTUser } from "../chatgpt-auth";
import { SubmissionForm } from "../components/SubmissionForm";

export const dynamic = "force-dynamic";
export default async function PublishPage() {
  await requireChatGPTUser("/publish");
  return <main className="page-shell"><div className="page-title"><span className="eyebrow">STUDENT CONTRIBUTION</span><h1>发布一条校园信息</h1><p>学生投稿默认标记为“学生经验”，并在管理员审核后公开。政策、竞赛报名和收费事项请尽量附上原始链接。</p></div><SubmissionForm /></main>;
}
