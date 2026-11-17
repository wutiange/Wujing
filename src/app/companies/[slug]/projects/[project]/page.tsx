import { notFound } from "next/navigation";
import { ArticleBreadcrumb } from "@/components/ArticleBreadcrumb";
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
            ]}
          />
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
