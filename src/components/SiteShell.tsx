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
          <div className="scroll-pane scroll-pane--nav desktop-only-nav">
            <LeftNav />
          </div>
        </aside>

        <div className="scroll-pane scroll-pane--content site-center">
          {children}
          <div className="mobile-side-stacks">
            <LeftNav />
          </div>
          <SiteFooter />
        </div>

        {right ? (
          <aside className="scroll-pane scroll-pane--toc sidebar sidebar-right">
            {right}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
