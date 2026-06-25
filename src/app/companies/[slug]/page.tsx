import Link from "next/link";
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
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          ← 返回首页
        </Link>

        <article>
          <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-800">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {company.title}
            </h1>
            {company.date && (
              <time className="mt-2 block text-sm text-zinc-500">
                {company.date}
              </time>
            )}
            {company.description && (
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                {company.description}
              </p>
            )}
          </header>

          {company.contentHtml ? (
            <div
              className="prose mb-12"
              dangerouslySetInnerHTML={{ __html: company.contentHtml }}
            />
          ) : null}

          {projects.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
                项目
              </h2>
              <ul className="space-y-3">
                {projects.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/companies/${slug}/projects/${project.slug}`}
                      className="group block rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
                    >
                      <h3 className="text-lg font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {project.description}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!company.contentHtml && projects.length === 0 && (
            <p className="text-zinc-500">暂无内容，请直接编辑对应的 Markdown 文件。</p>
          )}
        </article>
      </main>
    </div>
  );
}
