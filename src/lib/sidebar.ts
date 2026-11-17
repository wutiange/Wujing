import fs from "fs";
import path from "path";
import { formatTenureRange, tenureSortKey } from "@/lib/dates";
import { getAllCompanies, getAllNotes, type NoteMeta } from "@/lib/markdown";

const SIDEBAR_LIMIT = 5;

function getFileCreatedDate(fullPath: string): string | undefined {
  try {
    const stats = fs.statSync(fullPath);
    const created = stats.birthtimeMs > 0 ? stats.birthtime : stats.mtime;
    return created.toISOString().slice(0, 10);
  } catch {
    return undefined;
  }
}

function withCreatedDate(
  item: NoteMeta,
  fullPath: string,
): NoteMeta & { date?: string } {
  return {
    ...item,
    date: item.date || getFileCreatedDate(fullPath),
  };
}

export function getSidebarNotes() {
  const contentRoot = path.join(process.cwd(), "content");

  return getAllNotes()
    .map((note) =>
      withCreatedDate(note, path.join(contentRoot, `${note.slug}.md`)),
    )
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function getSidebarCompanies() {
  return getAllCompanies().sort(
    (a, b) => tenureSortKey(b.end, b.start) - tenureSortKey(a.end, a.start),
  );
}

export function toSidebarItems(
  items: NoteMeta[],
  hrefFor: (slug: string) => string,
  options?: { useTenure?: boolean },
) {
  return items.map((item) => {
    const tenure = options?.useTenure
      ? formatTenureRange(item.start, item.end)
      : undefined;

    return {
      href: hrefFor(item.slug),
      title: item.title,
      date: options?.useTenure ? undefined : item.date,
      dateLabel: tenure || undefined,
      description: item.description,
    };
  });
}

export function getSidebarSections() {
  const notes = getSidebarNotes();
  const companies = getSidebarCompanies();

  return {
    notes: {
      title: "学习笔记",
      items: toSidebarItems(notes, (slug) => `/notes/${slug}`),
      total: notes.length,
      moreHref: "/notes",
      limit: SIDEBAR_LIMIT,
    },
    companies: {
      title: "工作经历",
      items: toSidebarItems(
        companies,
        (slug) => `/companies/${slug}`,
        { useTenure: true },
      ),
      total: companies.length,
      moreHref: "/companies",
      limit: SIDEBAR_LIMIT,
    },
  };
}
