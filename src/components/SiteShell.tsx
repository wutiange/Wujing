import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function SiteShell({
  children,
  left,
  right,
  home = false,
}: {
  children: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  home?: boolean;
}) {
  return (
    <div className={`site-root${home ? " is-home" : ""}`}>
      <div className="site-body">
        <aside className="sidebar sidebar-left">
          <SiteHeader />
          {left}
        </aside>

        <div className="site-center">
          {children}
          <div className="mobile-side-stacks">{left}</div>
        </div>

        {right ? <aside className="sidebar sidebar-right">{right}</aside> : null}
      </div>
      <SiteFooter />
    </div>
  );
}
