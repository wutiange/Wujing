import Link from "next/link";
import { notFound } from "next/navigation";
import {
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
              className="prose"
              dangerouslySetInnerHTML={{ __html: company.contentHtml }}
            />
          ) : (
            <p className="text-zinc-500">暂无内容，请直接编辑对应的 Markdown 文件。</p>
          )}
        </article>
      </main>
    </div>
  );
}
