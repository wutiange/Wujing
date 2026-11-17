import Link from "next/link";

export interface RecentItem {
  href: string;
  title: string;
  date?: string;
  /** Preformatted label, e.g. tenure `2019年7月~2020年4月`. */
  dateLabel?: string;
  description?: string;
}

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

export function RecentNotes({
  title,
  items,
  moreHref,
  total,
  limit = 5,
  unit = "篇",
  showDescription = false,
}: {
  title: string;
  items: RecentItem[];
  moreHref?: string;
  total?: number;
  limit?: number;
  unit?: string;
  showDescription?: boolean;
}) {
  const visible = items.slice(0, limit);
  const fullCount = total ?? items.length;
  const remaining = Math.max(0, fullCount - visible.length);

  return (
    <section className="recent-notes">
      <h3>{title}</h3>
      {visible.length === 0 ? (
        <p className="recent-empty">暂无内容</p>
      ) : (
        <ul className="recent-ul">
          {visible.map((item) => {
            const metaLabel = item.dateLabel || formatDisplayDate(item.date);

            return (
              <li key={item.href} className="recent-li">
                <div className="section">
                  <div className="desc">
                    <h3>
                      <Link href={item.href}>{item.title}</Link>
                    </h3>
                    {showDescription && item.description ? (
                      <p className="recent-desc">{item.description}</p>
                    ) : null}
                  </div>
                  {metaLabel ? (
                    <p className="meta">
                      <time dateTime={item.date || item.dateLabel}>{metaLabel}</time>
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {remaining > 0 && moreHref ? (
        <p>
          <Link className="see-more" href={moreHref}>
            查看其余 {remaining} {unit} →
          </Link>
        </p>
      ) : null}
    </section>
  );
}
