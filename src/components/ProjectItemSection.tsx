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
      <h2 className="section-label">{label}</h2>

      {items.length === 0 ? (
        <p className="empty-hint">
          暂无{label}，请在{" "}
          <code>
            content/companies/{companySlug}/projects/{projectSlug}/{category}/
          </code>{" "}
          目录下添加 Markdown 文件。
        </p>
      ) : (
        <ul className="list-stack">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/companies/${companySlug}/projects/${projectSlug}/${category}/${item.slug}`}
                className="item-row"
              >
                <div className="min-w-0">
                  <h3>{item.title}</h3>
                  {item.description ? <p className="recent-desc">{item.description}</p> : null}
                  {item.date ? (
                    <time className="article-meta" dateTime={item.date}>
                      {item.date}
                    </time>
                  ) : null}
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
