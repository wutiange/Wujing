import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <div className="site-header">
      <h1 className="page-title">
        <Link href="/">{siteConfig.name}</Link>
      </h1>
      <ThemeToggle />
    </div>
  );
}
