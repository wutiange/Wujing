"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export function MarkdownContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return;
    }

    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      securityLevel: "loose",
    });

    container
      .querySelectorAll(
        "pre > code.language-mermaid, pre.mermaid-source > code.language-mermaid",
      )
      .forEach((code) => {
      const pre = code.parentElement;
      if (!pre) {
        return;
      }

      const diagram = document.createElement("div");
      diagram.className = "mermaid";
      diagram.textContent = code.textContent ?? "";
      pre.replaceWith(diagram);
    });

    void mermaid.run({ nodes: container.querySelectorAll(".mermaid") });
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
