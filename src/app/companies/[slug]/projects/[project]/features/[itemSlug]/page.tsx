import Link from "next/link";
import { MarkdownContent } from "@/components/MarkdownContent";
import { notFound } from "next/navigation";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { SiteShell } from "@/components/SiteShell";
import {
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
      .filter((param) => param.category === "features")
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
    !getProjectItemSlugs(slug, project, "features").includes(itemSlug)
  ) {
    return { title: "未找到" };
  }

  const item = await getProjectItemBySlug(slug, project, "features", itemSlug);

  return {
    title: item.title,
    description: item.description,
  };
}

export default async function FeaturePage({
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
    !getProjectItemSlugs(slug, project, "features").includes(itemSlug)
  ) {
    notFound();
  }

  const company = await getCompanyBySlug(slug);
  const projectMeta = getProjectMeta(slug, project);
  const item = await getProjectItemBySlug(slug, project, "features", itemSlug);

  return (
    <SiteShell>
      <div className="page-panel">
        <Link
          href={`/companies/${slug}/projects/${project}`}
          className="back-link"
        >
          ← 返回 {projectMeta.title}
        </Link>

        <article>
          <header className="article-header">
            <p className="article-kicker">
              {company.title} · {projectMeta.title} · 功能实现
            </p>
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
