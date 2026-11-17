import Link from "next/link";
import { ArticleBreadcrumb } from "@/components/ArticleBreadcrumb";
import { SiteShell } from "@/components/SiteShell";
import { formatTenureRange } from "@/lib/dates";
import { getSidebarCompanies } from "@/lib/sidebar";

export const metadata = {
  title: "工作经历",
  description: "全部工作经历",
};

export default function CompaniesIndexPage() {
  const companies = getSidebarCompanies();

  return (
    <SiteShell>
      <div className="page-panel">
        <header className="article-header">
          <ArticleBreadcrumb
            items={[
              { label: "首页", href: "/" },
              { label: "工作经历", href: "/companies" },
            ]}
          />
          <h1>工作经历</h1>
          <p className="article-desc">共 {companies.length} 家</p>
        </header>

        {companies.length === 0 ? (
          <p className="empty-hint">暂无内容</p>
        ) : (
          <ul className="list-stack">
            {companies.map((company) => {
              const tenure = formatTenureRange(company.start, company.end);

              return (
                <li key={company.slug}>
                  <Link className="list-link" href={`/companies/${company.slug}`}>
                    <h3>{company.title}</h3>
                    {company.description ? <p>{company.description}</p> : null}
                    {tenure ? <time dateTime={company.start}>{tenure}</time> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </SiteShell>
  );
}
