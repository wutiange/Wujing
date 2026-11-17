import Link from "next/link";
import { MarkdownContent } from "@/components/MarkdownContent";
import { SiteShell } from "@/components/SiteShell";
import { notFound } from "next/navigation";
import { formatTenureRange } from "@/lib/dates";
import {
  companyHasBodyHtml,
  getAllProjects,
  getCompanyBySlug,
  getCompanySlugs,
} from "@/lib/markdown";

export async function generateStaticParams() {
  return getCompanySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getCompanySlugs();

  if (!slugs.includes(slug)) {
    return { title: "未找到" };
  }

  const company = await getCompanyBySlug(slug);

  return {
    title: company.title,
    description: company.description,
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getCompanySlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const company = await getCompanyBySlug(slug);
  const projects = getAllProjects(slug);
  const tenure = formatTenureRange(company.start, company.end);
  const hasReflection = companyHasBodyHtml(company.contentHtml);
  const isEmpty = !hasReflection && projects.length === 0;

  return (
    <SiteShell>
      <div className="page-panel">
        <Link href="/" className="back-link">
          ← 返回首页
        </Link>

        <article>
          <header className="article-header">
            <h1>{company.title}</h1>
            {tenure ? (
              <time className="tenure-range" dateTime={company.start}>
                {tenure}
              </time>
            ) : null}
            {company.description ? (
              <p className="article-desc">{company.description}</p>
            ) : null}
          </header>

          {/* 项目目录置顶；若有公司感想正文则紧随其后优先呈现 */}
          {projects.length > 0 ? (
            <nav className="project-directory" aria-label="项目目录">
              <h2 className="section-label">项目</h2>
              <ul className="project-directory-list">
                {projects.map((project, index) => (
                  <li key={project.slug}>
                    <Link
                      href={`/companies/${slug}/projects/${project.slug}`}
                      className="project-directory-link"
                    >
                      <span className="project-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="project-directory-body">
                        <span className="project-directory-title">
                          {project.title}
                        </span>
                        {project.description ? (
                          <span className="project-directory-desc">
                            {project.description}
                          </span>
                        ) : null}
                      </span>
                      <span className="project-directory-arrow" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {hasReflection ? (
            <section className="company-reflection">
              <h2 className="section-label">感想</h2>
              <MarkdownContent html={company.contentHtml} />
            </section>
          ) : null}

          {isEmpty ? <p className="empty-hint">暂无内容</p> : null}
        </article>
      </div>
    </SiteShell>
  );
}
