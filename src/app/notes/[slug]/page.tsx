import { ArticleBreadcrumb } from "@/components/ArticleBreadcrumb";
import { ArticleToc } from "@/components/ArticleToc";
import { MarkdownContent } from "@/components/MarkdownContent";
import { SiteShell } from "@/components/SiteShell";
import { notFound } from "next/navigation";
import { getNoteBySlug, getNoteSlugs } from "@/lib/markdown";

export async function generateStaticParams() {
  return getNoteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getNoteSlugs();

  if (!slugs.includes(slug)) {
    return { title: "未找到" };
  }

  const note = await getNoteBySlug(slug);

  return {
    title: note.title,
    description: note.description,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getNoteSlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const note = await getNoteBySlug(slug);

  return (
    <SiteShell
      right={note.toc.length > 0 ? <ArticleToc items={note.toc} /> : undefined}
    >
      <div className="page-panel">
        <article>
          <header className="article-header">
            <ArticleBreadcrumb
              items={[
                { label: "首页", href: "/" },
                { label: "学习笔记", href: "/notes" },
                { label: note.title, href: `/notes/${slug}` },
              ]}
            />
            <h1>{note.title}</h1>
            {note.date ? (
              <time dateTime={note.date}>{note.date}</time>
            ) : null}
            {note.description ? (
              <p className="article-desc">{note.description}</p>
            ) : null}
          </header>

          <MarkdownContent html={note.contentHtml} />
        </article>
      </div>
    </SiteShell>
  );
}
