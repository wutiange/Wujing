import Link from "next/link";
import { MarkdownContent } from "@/components/MarkdownContent";
import { notFound } from "next/navigation";
import { DifficultyBadge } from "@/components/DifficultyBadge";
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
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href={`/companies/${slug}/projects/${project}`}
          className="mb-8 inline-block text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          ← 返回 {projectMeta.title}
        </Link>

        <article>
          <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">
              {company.title} · {projectMeta.title} · 问题记录
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {item.title}
              </h1>
              <DifficultyBadge level={item.difficulty} />
            </div>
            {item.date && (
              <time className="mt-2 block text-sm text-zinc-500">
                {item.date}
              </time>
            )}
            {item.description && (
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            )}
          </header>

          {item.contentHtml ? (
            <MarkdownContent html={item.contentHtml} />
          ) : (
            <p className="text-zinc-500">暂无正文，请直接编辑对应的 Markdown 文件。</p>
          )}
        </article>
      </main>
    </div>
  );
}
