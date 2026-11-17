import Link from "next/link";
import { DappledScene } from "@/components/DappledScene";
import { SiteShell } from "@/components/SiteShell";
import { getSidebarCompanies } from "@/lib/sidebar";
import { siteConfig } from "@/lib/site";

export default function Home() {
  const companies = getSidebarCompanies();

  return (
    <SiteShell home>
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
        <p>如果你也在做类似的事，欢迎从这些入口走进来：</p>
        <ul>
          <li>
            <Link href="/notes">学习笔记</Link>
            ：日常学习与思考的落点；
          </li>
          <li>
            <Link href="/companies">工作经历</Link>
            ：走过的公司与项目现场
            {companies[0] ? (
              <>
                （例如{" "}
                <Link href={`/companies/${companies[0].slug}`}>
                  {companies[0].title}
                </Link>
                ）
              </>
            ) : null}
            。
          </li>
        </ul>
      </article>
    </SiteShell>
  );
}
