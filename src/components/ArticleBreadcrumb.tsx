import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function ArticleBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="article-breadcrumb" aria-label="面包屑">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`}>
              {index > 0 ? (
                <span className="article-breadcrumb-sep" aria-hidden="true">
                  ·
                </span>
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
