import { LeftNav } from "@/components/LeftNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function SiteShell({
  children,
  right,
  home = false,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
  home?: boolean;
}) {
  return (
    <div className={`site-root${home ? " is-home" : ""}`}>
      <div className="site-body">
        <aside className="sidebar sidebar-left">
          <SiteHeader />
          <div className="desktop-only-nav">
            <LeftNav />
          </div>
        </aside>

        <div className="site-center">
          {children}
          <div className="mobile-side-stacks">
            <LeftNav />
          </div>
        </div>

        {right ? <aside className="sidebar sidebar-right">{right}</aside> : null}
      </div>
      <SiteFooter />
    </div>
  );
}
