import Link from "next/link";
import { Images } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { EvidenceImage } from "@/components/evidence/EvidenceImage";
import {
  Card,
  Meter,
  StatusPill,
  SurveyLabel,
  toneForStatus,
} from "@/components/ui/primitives";
import { PHOTOS, PROJECTS, isUndecided, verdictOf } from "@/lib/data";
import { naira, pct, relative } from "@/lib/format";

export default function ProjectsPage() {
  return (
    <>
      <Topbar eyebrow="Portfolio" title="Contracts in delivery" />

      <main className="px-6 py-7 lg:px-9">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((p) => {
            const shots = PHOTOS.filter((x) => x.projectId === p.id);
            const flagged = shots.filter((x) => verdictOf(x) === "flagged" && isUndecided(x));
            const cover = [...shots]
              .filter((x) => verdictOf(x) === "verified")
              .sort((a, b) => Date.parse(b.capturedAt) - Date.parse(a.capturedAt))[0];
            const util = pct(p.spent, p.budget);
            const variance = util - p.progress;

            return (
              <Link key={p.id} href={`/projects/${p.id}`} className="group block">
                <Card className="h-full overflow-hidden transition-colors group-hover:border-line-strong">
                  <div className="relative aspect-video overflow-hidden bg-ink-900">
                    {cover ? (
                      <EvidenceImage
                        scene={cover.scene}
                        alt={`${cover.stage} at ${cover.location}`}
                        className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : null}
                    <div className="scrim pointer-events-none absolute inset-x-0 bottom-0 h-3/4" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="rounded-full border border-white/20 bg-ink-950/60 px-2 py-0.75 font-mono text-[10px] tracking-[0.09em] text-white uppercase backdrop-blur-sm">
                        {p.mode}
                      </span>
                    </div>
                    {flagged.length > 0 ? (
                      <div className="absolute top-3 right-3">
                        <span className="rounded-full bg-rust-600 px-2 py-0.75 font-mono text-[10px] tracking-[0.06em] text-white uppercase">
                          {flagged.length} flagged
                        </span>
                      </div>
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="font-mono text-[10px] tracking-[0.11em] text-white/55 uppercase">
                        {p.id} · {p.region}
                      </p>
                      <h2 className="mt-1 font-display text-[16px] leading-tight font-semibold text-white">
                        {p.name}
                      </h2>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <StatusPill status={p.status} />
                      <span className="font-mono text-[11px] text-ink-400 tabular">
                        {relative(p.updatedAt)}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="mb-1.5 flex items-baseline justify-between">
                        <SurveyLabel>Physical progress</SurveyLabel>
                        <span className="font-mono text-[13px] font-medium text-ink-900 tabular">
                          {p.progress}%
                        </span>
                      </div>
                      <Meter value={p.progress} tone={toneForStatus(p.status)} />
                    </div>

                    <dl className="survey-rule mt-4 grid grid-cols-3 gap-3">
                      {[
                        ["Value", naira(p.budget)],
                        ["Disbursed", `${util}%`],
                        ["Variance", `${variance > 0 ? "+" : ""}${variance} pts`],
                      ].map(([k, v], i) => (
                        <div key={k}>
                          <dt className="survey-label">{k}</dt>
                          <dd
                            className={`mt-1 font-mono text-[12.5px] tabular ${
                              i === 2 && Math.abs(variance) > 8
                                ? "font-medium text-rust-600"
                                : "text-ink-800"
                            }`}
                          >
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                      <span className="truncate text-[12px] text-ink-500">{p.contractor}</span>
                      <span className="ml-3 inline-flex shrink-0 items-center gap-1.5 font-mono text-[11.5px] text-ink-500 tabular">
                        <Images className="size-3.5 text-ink-300" />
                        {shots.length}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
