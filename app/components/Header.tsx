import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "../chatgpt-auth";
import { isAdmin } from "../../lib/security";

export async function Header() {
  const user = await getChatGPTUser();
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="/" aria-label="地大指南首页"><span className="brand-mark">D</span><span>地大指南<small>CUG STUDENT GUIDE</small></span></a>
        <nav className="main-nav" aria-label="主导航">
          <a href="/undergraduate">本科生</a><a href="/graduate">研究生</a><a href="/explore">信息广场</a><a href="/courses">课程评价</a><a href="/publish">发布信息</a>
          {user && <a href="/me">我的投稿</a>}{user && isAdmin(user) && <a href="/admin">审核台</a>}
        </nav>
        {user ? <a className="account-button" href={chatGPTSignOutPath("/")}>{user.displayName.split("@")[0]} · 退出</a> : <a className="account-button" href={chatGPTSignInPath("/")}>登录投稿</a>}
      </div>
    </header>
  );
}
