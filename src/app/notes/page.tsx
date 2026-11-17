import Link from "next/link";
import { ArticleBreadcrumb } from "@/components/ArticleBreadcrumb";
import { SiteShell } from "@/components/SiteShell";
import { getSidebarNotes } from "@/lib/sidebar";

export const metadata = {
  title: "学习笔记",
  description: "全部学习笔记",
};

function formatDisplayDate(date?: string) {
  if (!date) {
    return null;
  }

  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NotesIndexPage() {
  const notes = getSidebarNotes();

  return (
    <SiteShell>
      <div className="page-panel">
        <header className="article-header">
          <ArticleBreadcrumb
            items={[
              { label: "首页", href: "/" },
              { label: "学习笔记", href: "/notes" },
            ]}
          />
          <h1>学习笔记</h1>
          <p className="article-desc">共 {notes.length} 篇</p>
        </header>

        {notes.length === 0 ? (
          <p className="empty-hint">暂无笔记，请在 content/ 目录下添加 Markdown。</p>
        ) : (
          <ul className="list-stack">
            {notes.map((note) => (
              <li key={note.slug}>
                <Link className="list-link" href={`/notes/${note.slug}`}>
                  <h3>{note.title}</h3>
                  {note.description ? <p>{note.description}</p> : null}
                  {note.date ? (
                    <time dateTime={note.date}>{formatDisplayDate(note.date)}</time>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteShell>
  );
}
