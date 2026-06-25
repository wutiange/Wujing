import Link from "next/link";
import { getAllNotes } from "@/lib/markdown";

export default function Home() {
  const notes = getAllNotes();

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            吴敬笔记
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            学习记录、工作记录，以及工作中遇到的问题与解决方案。
          </p>
        </header>

        <section>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-zinc-500">
            全部笔记
          </h2>

          {notes.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400">
              暂无笔记，请在 <code className="text-sm">content/</code>{" "}
              目录下添加 Markdown 文件。
            </p>
          ) : (
            <ul className="space-y-4">
              {notes.map((note) => (
                <li key={note.slug}>
                  <Link
                    href={`/notes/${note.slug}`}
                    className="group block rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
                  >
                    <h3 className="text-lg font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
                      {note.title}
                    </h3>
                    {note.description && (
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {note.description}
                      </p>
                    )}
                    {note.date && (
                      <time className="mt-3 block text-xs text-zinc-400">
                        {note.date}
                      </time>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
