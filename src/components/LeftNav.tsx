import { RecentNotes } from "@/components/RecentNotes";
import { getSidebarSections } from "@/lib/sidebar";

export function LeftNav() {
  const { notes, companies } = getSidebarSections();

  return (
    <div className="left-nav">
      <RecentNotes
        title={notes.title}
        items={notes.items}
        total={notes.total}
        limit={notes.limit}
        moreHref={notes.moreHref}
        unit="篇"
      />
      <RecentNotes
        title={companies.title}
        items={companies.items}
        total={companies.total}
        limit={companies.limit}
        moreHref={companies.moreHref}
        unit="家"
      />
    </div>
  );
}
