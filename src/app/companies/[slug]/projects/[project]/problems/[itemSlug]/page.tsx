import { ArticleBreadcrumb } from "@/components/ArticleBreadcrumb";
import { ArticleToc } from "@/components/ArticleToc";
import { MarkdownContent } from "@/components/MarkdownContent";
import { notFound } from "next/navigation";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { SiteShell } from "@/components/SiteShell";
import {
  CATEGORY_LABELS,
  getAllProjectItemParams,
  getCompanyBySlug,
  getCompanySlugs,
  getProjectItemBySlug,
  getProjectItemSlugs,
  getProjectMeta,
  getProjectSlugs,
} from "@/lib/markdown";
import {
  isStaticExportSkip,
  withStaticExportFallback,
} from "@/lib/static-params";

export async function generateStaticParams() {
  return withStaticExportFallback(
    getAllProjectItemParams()
      .filter((param) => param.category === "problems")
      .map(({ slug, project, itemSlug }) => ({
        slug,
        project,
        itemSlug,
      })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; project: string; itemSlug: string }>;
}) {
  const { slug, project, itemSlug } = await params;

  if (isStaticExportSkip(slug, project, itemSlug)) {
    notFound();
  }

  if (
    !getCompanySlugs().includes(slug) ||
    !getProjectSlugs(slug).includes(project) ||
    !getProjectItemSlugs(slug, project, "problems").includes(itemSlug)
  ) {
    return { title: "未找到" };
  }

  const item = await getProjectItemBySlug(slug, project, "problems", itemSlug);

  return {
    title: item.title,
    description: item.description,
  };
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string; project: string; itemSlug: string }>;
}) {
  const { slug, project, itemSlug } = await params;

  if (isStaticExportSkip(slug, project, itemSlug)) {
    notFound();
  }

  if (
    !getCompanySlugs().includes(slug) ||
    !getProjectSlugs(slug).includes(project) ||
    !getProjectItemSlugs(slug, project, "problems").includes(itemSlug)
  ) {
    notFound();
  }

  const company = await getCompanyBySlug(slug);
  const projectMeta = getProjectMeta(slug, project);
  const item = await getProjectItemBySlug(slug, project, "problems", itemSlug);

  return (
    <SiteShell
      right={item.toc.length > 0 ? <ArticleToc items={item.toc} /> : undefined}
    >
      <div className="page-panel">
        <article>
          <header className="article-header">
            <ArticleBreadcrumb
              items={[
                { label: "首页", href: "/" },
                { label: "工作经历", href: "/companies" },
                { label: company.title, href: `/companies/${slug}` },
                {
                  label: projectMeta.title,
                  href: `/companies/${slug}/projects/${project}`,
                },
                {
                  label: CATEGORY_LABELS.problems,
                  href: `/companies/${slug}/projects/${project}#problems`,
                },
              ]}
            />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1>{item.title}</h1>
              <DifficultyBadge level={item.difficulty} />
            </div>
            {item.date ? <time dateTime={item.date}>{item.date}</time> : null}
            {item.description ? (
              <p className="article-desc">{item.description}</p>
            ) : null}
          </header>

          {item.contentHtml ? (
            <MarkdownContent html={item.contentHtml} />
          ) : (
            <p className="empty-hint">暂无正文，请直接编辑对应的 Markdown 文件。</p>
          )}
        </article>
      </div>
    </SiteShell>
  );
}
