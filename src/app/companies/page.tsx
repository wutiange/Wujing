import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { getSidebarCompanies } from "@/lib/sidebar";

export const metadata = {
  title: "工作经历",
  description: "全部工作经历",
};

function formatDisplayDate(date?: string) {
  if (!date) {
    return null;
  }

  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CompaniesIndexPage() {
  const companies = getSidebarCompanies();

  return (
    <SiteShell>
      <div className="page-panel">
        <Link href="/" className="back-link">
          ← 返回首页
        </Link>

        <header className="article-header">
          <h1>工作经历</h1>
          <p className="article-desc">共 {companies.length} 家</p>
        </header>

        {companies.length === 0 ? (
          <p className="empty-hint">
            暂无公司经历，请在 content/companies/ 下添加。
          </p>
        ) : (
          <ul className="list-stack">
            {companies.map((company) => (
              <li key={company.slug}>
                <Link className="list-link" href={`/companies/${company.slug}`}>
                  <h3>{company.title}</h3>
                  {company.description ? <p>{company.description}</p> : null}
                  {company.date ? (
                    <time dateTime={company.date}>
                      {formatDisplayDate(company.date)}
                    </time>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteShell>
  );
}
