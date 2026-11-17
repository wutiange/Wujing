import Link from "next/link";
import { MarkdownContent } from "@/components/MarkdownContent";
import { SiteShell } from "@/components/SiteShell";
import { notFound } from "next/navigation";
import {
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

  return (
    <SiteShell>
      <div className="page-panel">
        <Link href="/" className="back-link">
          ← 返回首页
        </Link>

        <article>
          <header className="article-header">
            <h1>{company.title}</h1>
            {company.date ? (
              <time dateTime={company.date}>{company.date}</time>
            ) : null}
            {company.description ? (
              <p className="article-desc">{company.description}</p>
            ) : null}
          </header>

          {company.contentHtml ? (
            <div className="mb-10">
              <MarkdownContent html={company.contentHtml} />
            </div>
          ) : null}

          {projects.length > 0 ? (
            <section>
              <h2 className="section-label">项目</h2>
              <ul className="list-stack">
                {projects.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/companies/${slug}/projects/${project.slug}`}
                      className="list-link"
                    >
                      <h3>{project.title}</h3>
                      {project.description ? <p>{project.description}</p> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {!company.contentHtml && projects.length === 0 ? (
            <p className="empty-hint">暂无内容，请直接编辑对应的 Markdown 文件。</p>
          ) : null}
        </article>
      </div>
    </SiteShell>
  );
}
