import { Topbar } from "@/components/shell/Topbar";
import { ReviewQueue } from "@/components/evidence/ReviewQueue";
import { PHOTOS, PROJECTS } from "@/lib/data";

export default function EvidencePage() {
  const names = Object.fromEntries(PROJECTS.map((p) => [p.id, p.name]));

  return (
    <>
      <Topbar eyebrow="Verification" title="Evidence review" />
      <main className="px-6 py-7 lg:px-9">
        <ReviewQueue initial={PHOTOS} projectNames={names} />
      </main>
    </>
  );
}
