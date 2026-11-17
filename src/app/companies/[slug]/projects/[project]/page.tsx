import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectItemSection } from "@/components/ProjectItemSection";
import { SiteShell } from "@/components/SiteShell";
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
    <SiteShell>
      <div className="page-panel">
        <Link href={`/companies/${slug}`} className="back-link">
          ← 返回 {company.title}
        </Link>

        <header className="article-header">
          <p className="article-kicker">{company.title}</p>
          <h1>{projectMeta.title}</h1>
          {projectMeta.description ? (
            <p className="article-desc">{projectMeta.description}</p>
          ) : null}
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
      </div>
    </SiteShell>
  );
}
