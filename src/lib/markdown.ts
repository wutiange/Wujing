import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const contentRoot = path.join(process.cwd(), "content");

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
  const processedContent = await remark().use(html).process(content);

  return {
    slug,
    title: (data.title as string) || slug,
    date: formatDate(data.date),
    description: data.description as string | undefined,
    contentHtml: processedContent.toString(),
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

  if (!fs.existsSync(categoryDirectory)) {
    return [];
  }

  return fs
    .readdirSync(categoryDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
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
  return getProjectItemSlugs(companySlug, projectSlug, category)
    .map((slug) => {
      const fullPath = path.join(
        getCategoryDirectory(companySlug, projectSlug, category),
        `${slug}.md`,
      );
      return parseProjectItemMeta(fullPath, slug);
    })
    .sort((a, b) => b.difficulty - a.difficulty || a.title.localeCompare(b.title));
}

export async function getProjectItemBySlug(
  companySlug: string,
  projectSlug: string,
  category: ProjectCategory,
  itemSlug: string,
): Promise<ProjectItem> {
  const fullPath = path.join(
    getCategoryDirectory(companySlug, projectSlug, category),
    `${itemSlug}.md`,
  );
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);

  return {
    slug: itemSlug,
    title: (data.title as string) || itemSlug,
    date: formatDate(data.date),
    description: data.description as string | undefined,
    difficulty: parseDifficulty(data.difficulty),
    contentHtml: processedContent.toString(),
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
