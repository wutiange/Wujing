import Link from "next/link";
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
    <SiteShell>
      <div className="page-panel">
        <Link href="/" className="back-link">
          ← 返回首页
        </Link>

        <article>
          <header className="article-header">
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
