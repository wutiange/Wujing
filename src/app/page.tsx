import Link from "next/link";
import { DappledScene } from "@/components/DappledScene";
import { RecentNotes } from "@/components/RecentNotes";
import { SiteShell } from "@/components/SiteShell";
import { getAllCompanies, getAllNotes } from "@/lib/markdown";
import { siteConfig } from "@/lib/site";

export default function Home() {
  const notes = getAllNotes().filter((note) => note.slug !== "welcome");
  const companies = getAllCompanies();

  const companyItems = companies.map((company) => ({
    href: `/companies/${company.slug}`,
    title: company.title,
    description: company.description,
    date: company.date,
  }));

  const noteItems = notes.map((note) => ({
    href: `/notes/${note.slug}`,
    title: note.title,
    description: note.description,
    date: note.date,
  }));

  return (
    <SiteShell
      home
      left={
        <RecentNotes
          title="工作经历"
          items={companyItems.slice(0, 5)}
          moreHref={companies.length > 5 ? "/#companies" : undefined}
          moreLabel={
            companies.length > 5 ? `查看其余 ${companies.length - 5} 家 →` : undefined
          }
        />
      }
      right={
        <RecentNotes
          title="学习笔记"
          items={
            noteItems.length > 0
              ? noteItems.slice(0, 6)
              : [
                  {
                    href: "/notes/welcome",
                    title: "欢迎使用",
                    description: "如何添加笔记与记录内容",
                    date: "2026-06-25",
                  },
                ]
          }
        />
      }
    >
      <article className="home-article">
        <DappledScene />
        <pre className="poetry">欢迎！</pre>
        <p>
          我是{siteConfig.author}。这里是我在互联网上的一小片超文本花园 ——
          随便逛逛，当自己家就好。
        </p>
        <p>
          我主要记录学习过程中的收获，以及工作里踩过的坑、做过的难点功能和解法。希望这些笔记不只是备忘，也能成为以后回看时还能辨认路径的路标。
        </p>
        <p>
          如果你也在做类似的事，欢迎从这些入口走进来：
        </p>
        <ul>
          <li>
            <Link href="/notes/welcome">学习笔记</Link>
            ：日常学习与思考的落点；
          </li>
          <li>
            <Link href={companyItems[0]?.href ?? "/"}>工作经历</Link>
            ：走过的公司与项目现场；
          </li>
          <li>
            <a href={siteConfig.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            ：源码仓库，旁边可直达
            <a href={siteConfig.website} target="_blank" rel="noreferrer">
              在线网站
            </a>
            。
          </li>
        </ul>
        <p className="signature">— {siteConfig.author}</p>
      </article>
    </SiteShell>
  );
}
