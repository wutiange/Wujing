import Link from "next/link";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import {
  CATEGORY_LABELS,
  type ProjectCategory,
  type ProjectItemMeta,
} from "@/lib/markdown";

export function ProjectItemSection({
  companySlug,
  projectSlug,
  category,
  items,
}: {
  companySlug: string;
  projectSlug: string;
  category: ProjectCategory;
  items: ProjectItemMeta[];
}) {
  const label = CATEGORY_LABELS[category];

  return (
    <section>
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </h2>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-200 p-5 text-sm text-zinc-500 dark:border-zinc-800">
          暂无{label}，请在{" "}
          <code className="text-xs">
            content/companies/{companySlug}/projects/{projectSlug}/{category}/
          </code>{" "}
          目录下添加 Markdown 文件。
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/companies/${companySlug}/projects/${projectSlug}/${category}/${item.slug}`}
                className="group flex items-start justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
              >
                <div className="min-w-0">
                  <h3 className="font-medium text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {item.description}
                    </p>
                  )}
                  {item.date && (
                    <time className="mt-2 block text-xs text-zinc-400">
                      {item.date}
                    </time>
                  )}
                </div>
                <DifficultyBadge level={item.difficulty} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
