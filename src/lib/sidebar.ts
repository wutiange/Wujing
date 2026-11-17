import fs from "fs";
import path from "path";
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
  const companiesRoot = path.join(process.cwd(), "content", "companies");

  return getAllCompanies()
    .map((company) =>
      withCreatedDate(
        company,
        path.join(companiesRoot, `${company.slug}.md`),
      ),
    )
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function toSidebarItems(
  items: NoteMeta[],
  hrefFor: (slug: string) => string,
) {
  return items.map((item) => ({
    href: hrefFor(item.slug),
    title: item.title,
    date: item.date,
    description: item.description,
  }));
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
      items: toSidebarItems(companies, (slug) => `/companies/${slug}`),
      total: companies.length,
      moreHref: "/companies",
      limit: SIDEBAR_LIMIT,
    },
  };
}
