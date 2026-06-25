import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const contentDirectory = path.join(process.cwd(), "content");

function formatDate(value: unknown): string | undefined {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value);
}

export interface NoteMeta {
  slug: string;
  title: string;
  date?: string;
  description?: string;
}

export function getNoteSlugs(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  return fs
    .readdirSync(contentDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export async function getNoteBySlug(slug: string) {
  const fullPath = path.join(contentDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);

  return {
    slug,
    title: (data.title as string) || slug,
    date: formatDate(data.date),
    description: data.description as string | undefined,
    contentHtml: processedContent.toString(),
  };
}

export function getAllNotes(): NoteMeta[] {
  return getNoteSlugs()
    .map((slug) => {
      const fullPath = path.join(contentDirectory, `${slug}.md`);
      const { data } = matter(fs.readFileSync(fullPath, "utf8"));

      return {
        slug,
        title: (data.title as string) || slug,
        date: formatDate(data.date),
        description: data.description as string | undefined,
      };
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}
