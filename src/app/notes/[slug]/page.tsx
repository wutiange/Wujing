import Link from "next/link";
import { MarkdownContent } from "@/components/MarkdownContent";
import { notFound } from "next/navigation";
import { getAllNotes, getNoteBySlug, getNoteSlugs } from "@/lib/markdown";

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
              {note.title}
            </h1>
            {note.date && (
              <time className="mt-2 block text-sm text-zinc-500">
                {note.date}
              </time>
            )}
            {note.description && (
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                {note.description}
              </p>
            )}
          </header>

          <MarkdownContent html={note.contentHtml} />
        </article>
      </main>
    </div>
  );
}
