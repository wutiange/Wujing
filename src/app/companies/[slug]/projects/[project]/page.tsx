import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectItemSection } from "@/components/ProjectItemSection";
import {
  getAllProjectItems,
  getAllProjectParams,
  getCompanyBySlug,
  getCompanySlugs,
  getProjectMeta,
  getProjectSlugs,
} from "@/lib/markdown";

export async function generateStaticParams() {
  return getAllProjectParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; project: string }>;
}) {
  const { slug, project } = await params;

  if (
    !getCompanySlugs().includes(slug) ||
    !getProjectSlugs(slug).includes(project)
  ) {
    return { title: "未找到" };
  }

  const projectMeta = getProjectMeta(slug, project);

  return {
    title: `${projectMeta.title} · 项目`,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; project: string }>;
}) {
  const { slug, project } = await params;

  if (
    !getCompanySlugs().includes(slug) ||
    !getProjectSlugs(slug).includes(project)
  ) {
    notFound();
  }

  const company = await getCompanyBySlug(slug);
  const projectMeta = getProjectMeta(slug, project);
  const problems = getAllProjectItems(slug, project, "problems");
  const features = getAllProjectItems(slug, project, "features");

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href={`/companies/${slug}`}
          className="mb-8 inline-block text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          ← 返回 {company.title}
        </Link>

        <header className="mb-10 border-b border-zinc-200 pb-6 dark:border-zinc-800">
          <p className="text-sm text-zinc-500">{company.title}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {projectMeta.title}
          </h1>
          {projectMeta.description && (
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              {projectMeta.description}
            </p>
          )}
        </header>

        <div className="space-y-12">
          <ProjectItemSection
            companySlug={slug}
            projectSlug={project}
            category="problems"
            items={problems}
          />
          <ProjectItemSection
            companySlug={slug}
            projectSlug={project}
            category="features"
            items={features}
          />
        </div>
      </main>
    </div>
  );
}
