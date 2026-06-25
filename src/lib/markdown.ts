import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";

const contentRoot = path.join(process.cwd(), "content");

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function remarkMermaid() {
  return (tree: Root) => {
    visit(tree, "code", (node, index, parent) => {
      if (node.lang !== "mermaid" || !parent || index === undefined) {
        return;
      }

      parent.children[index] = {
        type: "html",
        value: `<pre class="mermaid-source"><code class="language-mermaid">${escapeHtml(node.value)}</code></pre>`,
      };
    });
  };
}

async function renderMarkdown(content: string): Promise<string> {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkMermaid)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrettyCode, {
      theme: "ayu-dark",
      keepBackground: false,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return processed.toString();
}

export type ProjectCategory = "problems" | "features";

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  problems: "问题记录",
  features: "功能实现",
};

function formatDate(value: unknown): string | undefined {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value);
}

function parseDifficulty(value: unknown): number {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return 0;
  }

  return Math.min(10, Math.max(0, Math.round(num)));
}

function getContentDirectory(subdir = ""): string {
  return subdir ? path.join(contentRoot, subdir) : contentRoot;
}

async function parseMarkdownFile(fullPath: string, slug: string) {
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const processedContent = await renderMarkdown(content);

  return {
    slug,
    title: (data.title as string) || slug,
    date: formatDate(data.date),
    description: data.description as string | undefined,
    contentHtml: processedContent,
  };
}

function parseMarkdownMeta(fullPath: string, slug: string): NoteMeta {
  const { data } = matter(fs.readFileSync(fullPath, "utf8"));

  return {
    slug,
    title: (data.title as string) || slug,
    date: formatDate(data.date),
    description: data.description as string | undefined,
  };
}

function getMarkdownSlugs(subdir = ""): string[] {
  const contentDirectory = getContentDirectory(subdir);

  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  return fs
    .readdirSync(contentDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export interface NoteMeta {
  slug: string;
  title: string;
  date?: string;
  description?: string;
}

export interface ProjectItemMeta extends NoteMeta {
  difficulty: number;
}

export interface ProjectItem extends ProjectItemMeta {
  contentHtml: string;
}

export function getNoteSlugs(): string[] {
  return getMarkdownSlugs();
}

export async function getNoteBySlug(slug: string) {
  const fullPath = path.join(getContentDirectory(), `${slug}.md`);
  return parseMarkdownFile(fullPath, slug);
}

export function getAllNotes(): NoteMeta[] {
  return getMarkdownSlugs()
    .map((slug) => {
      const fullPath = path.join(getContentDirectory(), `${slug}.md`);
      return parseMarkdownMeta(fullPath, slug);
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function getCompanySlugs(): string[] {
  return getMarkdownSlugs("companies");
}

export async function getCompanyBySlug(slug: string) {
  const fullPath = path.join(getContentDirectory("companies"), `${slug}.md`);
  return parseMarkdownFile(fullPath, slug);
}

export function getAllCompanies(): NoteMeta[] {
  return getMarkdownSlugs("companies").map((slug) => {
    const fullPath = path.join(getContentDirectory("companies"), `${slug}.md`);
    return parseMarkdownMeta(fullPath, slug);
  });
}

function getProjectsDirectory(companySlug: string): string {
  return path.join(contentRoot, "companies", companySlug, "projects");
}

export function getProjectSlugs(companySlug: string): string[] {
  const projectsDirectory = getProjectsDirectory(companySlug);

  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(projectsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export function getProjectMeta(companySlug: string, projectSlug: string) {
  const indexPath = path.join(
    getProjectsDirectory(companySlug),
    projectSlug,
    "index.md",
  );

  if (fs.existsSync(indexPath)) {
    const { data } = matter(fs.readFileSync(indexPath, "utf8"));
    return {
      slug: projectSlug,
      title: (data.title as string) || projectSlug,
      description: data.description as string | undefined,
    };
  }

  return {
    slug: projectSlug,
    title: projectSlug,
    description: undefined,
  };
}

export function getAllProjects(companySlug: string) {
  return getProjectSlugs(companySlug).map((slug) =>
    getProjectMeta(companySlug, slug),
  );
}

function getCategoryDirectory(
  companySlug: string,
  projectSlug: string,
  category: ProjectCategory,
): string {
  return path.join(
    getProjectsDirectory(companySlug),
    projectSlug,
    category,
  );
}

function listProjectItemFiles(categoryDirectory: string): string[] {
  if (!fs.existsSync(categoryDirectory)) {
    return [];
  }

  return fs.readdirSync(categoryDirectory).filter((file) => file.endsWith(".md"));
}

function getItemUrlSlug(fileName: string, fullPath: string): string {
  const { data } = matter(fs.readFileSync(fullPath, "utf8"));

  if (typeof data.slug === "string" && data.slug.trim()) {
    return data.slug.trim();
  }

  return fileName.replace(/\.md$/, "");
}

function resolveProjectItemPath(
  companySlug: string,
  projectSlug: string,
  category: ProjectCategory,
  itemSlug: string,
): string | null {
  const categoryDirectory = getCategoryDirectory(
    companySlug,
    projectSlug,
    category,
  );

  for (const fileName of listProjectItemFiles(categoryDirectory)) {
    const fullPath = path.join(categoryDirectory, fileName);
    if (getItemUrlSlug(fileName, fullPath) === itemSlug) {
      return fullPath;
    }
  }

  return null;
}

export function getProjectItemSlugs(
  companySlug: string,
  projectSlug: string,
  category: ProjectCategory,
): string[] {
  const categoryDirectory = getCategoryDirectory(
    companySlug,
    projectSlug,
    category,
  );

  return listProjectItemFiles(categoryDirectory).map((fileName) =>
    getItemUrlSlug(fileName, path.join(categoryDirectory, fileName)),
  );
}

function parseProjectItemMeta(
  fullPath: string,
  slug: string,
): ProjectItemMeta {
  const { data } = matter(fs.readFileSync(fullPath, "utf8"));

  return {
    slug,
    title: (data.title as string) || slug,
    date: formatDate(data.date),
    description: data.description as string | undefined,
    difficulty: parseDifficulty(data.difficulty),
  };
}

export function getAllProjectItems(
  companySlug: string,
  projectSlug: string,
  category: ProjectCategory,
): ProjectItemMeta[] {
  const categoryDirectory = getCategoryDirectory(
    companySlug,
    projectSlug,
    category,
  );

  return listProjectItemFiles(categoryDirectory)
    .map((fileName) => {
      const fullPath = path.join(categoryDirectory, fileName);
      const urlSlug = getItemUrlSlug(fileName, fullPath);
      return parseProjectItemMeta(fullPath, urlSlug);
    })
    .sort((a, b) => b.difficulty - a.difficulty || a.title.localeCompare(b.title));
}

export async function getProjectItemBySlug(
  companySlug: string,
  projectSlug: string,
  category: ProjectCategory,
  itemSlug: string,
): Promise<ProjectItem> {
  const fullPath = resolveProjectItemPath(
    companySlug,
    projectSlug,
    category,
    itemSlug,
  );

  if (!fullPath) {
    throw new Error(`Project item not found: ${itemSlug}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const contentHtml = await renderMarkdown(content);

  return {
    slug: itemSlug,
    title: (data.title as string) || itemSlug,
    date: formatDate(data.date),
    description: data.description as string | undefined,
    difficulty: parseDifficulty(data.difficulty),
    contentHtml,
  };
}

export function isProjectCategory(value: string): value is ProjectCategory {
  return value === "problems" || value === "features";
}

export function getAllProjectItemParams() {
  const params: {
    slug: string;
    project: string;
    category: ProjectCategory;
    itemSlug: string;
  }[] = [];

  for (const companySlug of getCompanySlugs()) {
    for (const projectSlug of getProjectSlugs(companySlug)) {
      for (const category of ["problems", "features"] as const) {
        for (const itemSlug of getProjectItemSlugs(
          companySlug,
          projectSlug,
          category,
        )) {
          params.push({
            slug: companySlug,
            project: projectSlug,
            category,
            itemSlug,
          });
        }
      }
    }
  }

  return params;
}

export function getAllProjectParams() {
  const params: { slug: string; project: string }[] = [];

  for (const companySlug of getCompanySlugs()) {
    for (const projectSlug of getProjectSlugs(companySlug)) {
      params.push({ slug: companySlug, project: projectSlug });
    }
  }

  return params;
}
