import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} {siteConfig.author}
      </p>
      <ul>
        <li>
          <a href={siteConfig.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </li>
      </ul>
    </footer>
  );
}
