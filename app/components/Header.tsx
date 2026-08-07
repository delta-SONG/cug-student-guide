import Link from "next/link";
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "../chatgpt-auth";
import { isAdmin } from "../../lib/security";

export async function Header() {
  const user = await getChatGPTUser();
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" href="/" aria-label="地大指南首页"><span className="brand-mark">D</span><span>地大指南<small>CUG STUDENT GUIDE</small></span></Link>
        <nav className="main-nav" aria-label="主导航">
          <Link href="/#explore">信息广场</Link><Link href="/courses">课程评价</Link><Link href="/publish">发布信息</Link>
          {user && <Link href="/me">我的投稿</Link>}{user && isAdmin(user) && <Link href="/admin">审核台</Link>}
        </nav>
        {user ? <a className="account-button" href={chatGPTSignOutPath("/")}>{user.displayName.split("@")[0]} · 退出</a> : <a className="account-button" href={chatGPTSignInPath("/")}>登录投稿</a>}
      </div>
    </header>
  );
}
