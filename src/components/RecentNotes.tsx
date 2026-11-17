import Link from "next/link";

export interface RecentItem {
  href: string;
  title: string;
  date?: string;
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

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function RecentNotes({
  title,
  items,
  moreHref,
  moreLabel,
}: {
  title: string;
  items: RecentItem[];
  moreHref?: string;
  moreLabel?: string;
}) {
  return (
    <section className="recent-notes">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="recent-empty">暂无内容</p>
      ) : (
        <ul className="recent-ul">
          {items.map((item) => (
            <li key={item.href} className="recent-li">
              <div className="section">
                <div className="desc">
                  <h3>
                    <Link href={item.href}>{item.title}</Link>
                  </h3>
                  {item.description ? (
                    <p className="recent-desc">{item.description}</p>
                  ) : null}
                </div>
                {item.date ? (
                  <p className="meta">
                    <time dateTime={item.date}>{formatDisplayDate(item.date)}</time>
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
      {moreHref && moreLabel ? (
        <p>
          <Link className="see-more" href={moreHref}>
            {moreLabel}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
