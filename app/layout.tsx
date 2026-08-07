import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Header } from "./components/Header";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  return {
    metadataBase: base,
    title: { default: "地大指南｜中国地质大学（武汉）学生信息平台", template: "%s｜地大指南" },
    description: "聚合中国地质大学（武汉）官方通知与学生经验，方便查阅选课、社团、活动、竞赛、保研、留学和考研信息。",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "地大指南",
      description: "把校园信息，放回一个可信、清楚、好找的地方。",
      type: "website",
      images: [{ url: new URL("/og.png", base).toString(), width: 1733, height: 910, alt: "地大指南，中国地质大学（武汉）学生信息平台" }],
    },
    twitter: { card: "summary_large_image", images: [new URL("/og.png", base).toString()] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        {children}
        <footer className="site-footer">
          <div className="footer-inner">
            <div><strong>地大指南</strong><p>学生共建的信息索引，不代替学校正式通知。</p></div>
            <div className="footer-links"><a href="https://www.cug.edu.cn/" target="_blank" rel="noreferrer">学校官网</a><a href="https://jwc.cug.edu.cn/" target="_blank" rel="noreferrer">教务处</a><a href="https://graduate.cug.edu.cn/" target="_blank" rel="noreferrer">研究生院</a></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
