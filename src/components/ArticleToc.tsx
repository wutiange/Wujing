"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/markdown";

export function ArticleToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
          return;
        }

        const above = headings
          .filter((heading) => heading.getBoundingClientRect().top <= 96)
          .at(-1);
        if (above) {
          setActiveId(above.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="article-toc" aria-label="文章目录">
      <h2 className="article-toc-title">目录</h2>
      <ul className="article-toc-list">
        {items.map((item) => (
          <li
            key={item.id}
            className={`article-toc-item depth-${item.depth}${
              activeId === item.id ? " is-active" : ""
            }`}
          >
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
