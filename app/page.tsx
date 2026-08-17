import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Images } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { EvidenceImage } from "@/components/evidence/EvidenceImage";
import { Gallery } from "@/components/evidence/Gallery";
import {
  Card,
  CardHead,
  Meter,
  Stat,
  StatusPill,
  SurveyLabel,
  toneForStatus,
  VerdictPill,
} from "@/components/ui/primitives";
import { PHOTOS, PROJECTS, isUndecided, verdictOf } from "@/lib/data";
import { coords, naira, pct, relative, shortDate } from "@/lib/format";
import type { Region } from "@/lib/types";

export default function OverviewPage() {
  const value = PROJECTS.reduce((s, p) => s + p.budget, 0);
  const disbursed = PROJECTS.reduce((s, p) => s + p.spent, 0);
  const attention = PROJECTS.filter((p) => p.status === "At Risk" || p.status === "Delayed");
  const flagged = PHOTOS.filter((p) => verdictOf(p) === "flagged" && isUndecided(p));
  const verified = PHOTOS.filter((p) => verdictOf(p) === "verified");

  const names = Object.fromEntries(PROJECTS.map((p) => [p.id, p.name]));

  const recent = [...PHOTOS]
    .filter((p) => verdictOf(p) === "verified")
    .sort((a, b) => Date.parse(b.capturedAt) - Date.parse(a.capturedAt));

  const lead = recent[0];
  const secondary = recent.slice(1, 4);

  const regions = Array.from(new Set(PROJECTS.map((p) => p.region))) as Region[];
  const byRegion = regions
    .map((region) => {
      const list = PROJECTS.filter((p) => p.region === region);
      return {
        region,
        count: list.length,
        value: list.reduce((s, p) => s + p.budget, 0),
        onTrack: list.filter((p) => p.status === "On Track" || p.status === "Ahead").length,
        atRisk: list.filter((p) => p.status === "At Risk").length,
        delayed: list.filter((p) => p.status === "Delayed").length,
      };
    })
    .sort((a, b) => b.value - a.value);

  return (
    <>
      <Topbar eyebrow="Portfolio · August 2026" title="National delivery overview" />

      {/* Statement band — the editorial beat before the instrument panel */}
      <section className="border-b border-ink-800 bg-ink-950 px-6 py-9 lg:px-9">
        <span className="survey-label text-ink-500">MoT · National Project Intelligence Platform</span>
        <h2 className="mt-2.5 max-w-3xl font-display text-[28px] leading-[1.2] font-semibold tracking-[-0.008em] text-white sm:text-[34px]">
          <span className="rounded-xs bg-moss-500/20 px-1.5 py-0.5">{naira(value)}</span> under active
          delivery across {PROJECTS.length} federal contracts
        </h2>
        <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-ink-400">
          Every disbursement is tied to site evidence captured, verified and reconciled against the
          physical progress it claims.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink-800 pt-5">
          {[
            ["Disbursed to date", `${pct(disbursed, value)}%`],
            ["Evidence on file", String(PHOTOS.length)],
            ["Awaiting adjudication", String(flagged.length)],
          ].map(([k, v]) => (
            <div key={k}>
              <span className="font-mono text-[9.5px] tracking-[0.12em] text-ink-500 uppercase">{k}</span>
              <p className="mt-1 font-mono text-[15px] text-white tabular">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <main className="px-6 py-7 lg:px-9">
        {/* Measures */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="Contracts in delivery"
            value={String(PROJECTS.length)}
            detail={`${attention.length} require ministry attention`}
          />
          <Stat
            label="Portfolio value"
            value={naira(value)}
            detail={`${pct(disbursed, value)}% disbursed to date`}
            accent="ink"
          />
          <Stat
            label="Evidence on file"
            value={String(PHOTOS.length)}
            detail={`${verified.length} images cleared verification`}
            accent="moss"
          />
          <Stat
            label="Failed verification"
            value={String(flagged.length)}
            detail="Awaiting adjudication"
            accent={flagged.length > 0 ? "rust" : "moss"}
          />
        </section>

        {/* Field photography — the thesis of the platform, given the space it deserves */}
        <section className="mt-8">
          <div className="mb-3.5 flex items-end justify-between gap-4">
            <div>
              <SurveyLabel>From the field</SurveyLabel>
              <h2 className="mt-1.5 text-[17px]">Most recent verified evidence</h2>
            </div>
            <Link
              href="/evidence"
              className="group inline-flex items-center gap-1 text-[12.5px] text-ink-600 transition hover:text-moss-600"
            >
              All evidence
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
            </Link>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
            {lead ? (
              <Link
                href={`/projects/${lead.projectId}`}
                className="group relative block overflow-hidden rounded-sm border border-line bg-ink-950 shadow-(--shadow-raised)"
              >
                <div className="relative aspect-16/10 lg:aspect-video">
                  <EvidenceImage
                    scene={lead.scene}
                    alt={`${lead.stage} at ${lead.location}`}
                    className="size-full transition-transform duration-900 ease-out group-hover:scale-[1.025]"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                  />
                  <div className="scrim absolute inset-0" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <VerdictPill verdict="verified" dark />
                    <span className="font-mono text-[10px] tracking-[0.11em] text-white/60 uppercase">
                      {lead.projectId} · {lead.location}
                    </span>
                  </div>
                  <h3 className="max-w-lg font-display text-[24px] leading-[1.15] font-semibold tracking-[-0.008em] text-white">
                    {lead.stage}
                  </h3>
                  <p className="mt-2 max-w-md text-[13px] leading-relaxed text-white/70">
                    {lead.caption}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-white/15 pt-3">
                    {[
                      ["Contract", names[lead.projectId]],
                      ["Position", coords(lead.lat, lead.lng)],
                      ["Captured", shortDate(lead.capturedAt)],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <span className="font-mono text-[9px] tracking-[0.12em] text-white/40 uppercase">
                          {k}
                        </span>
                        <p className="font-mono text-[11px] text-white/85 tabular">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ) : null}

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <Gallery
                photos={secondary}
                columns="grid-cols-2 lg:grid-cols-3"
                showProject
                projectNames={names}
                ratio="4 / 3"
              />
            </div>
          </div>
        </section>

        {/* Regional delivery + attention */}
        <section className="mt-8 grid gap-3 lg:grid-cols-[1.35fr_1fr]">
          <Card>
            <CardHead
              title="Delivery by region"
              note="Contract count and status distribution across the portfolio"
            />
            <div className="divide-y divide-line">
              {byRegion.map((r) => {
                const total = r.count;
                return (
                  <div key={r.region} className="px-5 py-4">
                    <div className="mb-2.5 flex items-baseline justify-between gap-4">
                      <span className="text-[13.5px] font-medium text-ink-900">{r.region}</span>
                      <span className="font-mono text-[11.5px] text-ink-500 tabular">
                        {r.count} contract{r.count === 1 ? "" : "s"} · {naira(r.value)}
                      </span>
                    </div>
                    <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                      {r.onTrack > 0 ? (
                        <div className="rounded-full bg-moss-500" style={{ flex: r.onTrack }} />
                      ) : null}
                      {r.atRisk > 0 ? (
                        <div className="rounded-full bg-ochre-500" style={{ flex: r.atRisk }} />
                      ) : null}
                      {r.delayed > 0 ? (
                        <div className="rounded-full bg-rust-500" style={{ flex: r.delayed }} />
                      ) : null}
                      {total === 0 ? <div className="flex-1 rounded-full bg-ink-100" /> : null}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line px-5 py-3">
              {[
                ["bg-moss-500", "On track"],
                ["bg-ochre-500", "At risk"],
                ["bg-rust-500", "Delayed"],
              ].map(([dot, label]) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className={`size-1.5 rounded-full ${dot}`} />
                  <span className="font-mono text-[10px] tracking-[0.09em] text-ink-400 uppercase">
                    {label}
                  </span>
                </span>
              ))}
            </div>
          </Card>

          <Card>
            <CardHead title="Requires attention" note="Ranked by forecast schedule impact" />
            <div className="divide-y divide-line">
              {attention
                .slice()
                .sort((a, b) => b.forecastSlip - a.forecastSlip)
                .map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="block px-5 py-4 transition-colors hover:bg-paper"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-medium text-ink-900">{p.name}</p>
                        <p className="mt-0.5 font-mono text-[10.5px] tracking-[0.06em] text-ink-400 uppercase">
                          {p.id} · {p.region}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-[12px] font-medium text-rust-600 tabular">
                        +{p.forecastSlip}d
                      </span>
                    </div>
                    {p.risk ? (
                      <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-ink-500">
                        {p.risk}
                      </p>
                    ) : null}
                  </Link>
                ))}
            </div>

            {flagged.length > 0 ? (
              <Link
                href="/evidence"
                className="flex items-center gap-3 border-t border-line bg-rust-50 px-5 py-4 transition-colors hover:bg-rust-50/70"
              >
                <AlertTriangle className="size-4 shrink-0 text-rust-600" strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-ink-900">
                    {flagged.length} images failed verification
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink-500">
                    Geofence, duplication and metadata findings pending adjudication
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-rust-600" />
              </Link>
            ) : null}
          </Card>
        </section>

        {/* Spend against progress */}
        <section className="mt-8">
          <Card>
            <CardHead
              title="Disbursement against physical progress"
              note="Variance is the difference between money released and work evidenced"
              action={
                <Link
                  href="/budget"
                  className="inline-flex items-center gap-1 text-[12.5px] text-ink-600 transition hover:text-moss-600"
                >
                  Full ledger <ArrowUpRight className="size-3.5" />
                </Link>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-left">
                <thead>
                  <tr className="border-b border-line">
                    {["Contract", "Status", "Progress", "Disbursed", "Variance", "Evidence"].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={`px-5 py-2.5 font-mono text-[10px] font-normal tracking-[0.11em] text-ink-400 uppercase ${
                            i > 2 ? "text-right" : ""
                          }`}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {PROJECTS.map((p) => {
                    const util = pct(p.spent, p.budget);
                    const variance = util - p.progress;
                    const shots = PHOTOS.filter((x) => x.projectId === p.id);
                    const bad = shots.filter((x) => verdictOf(x) === "flagged" && isUndecided(x));
                    return (
                      <tr key={p.id} className="group transition-colors hover:bg-paper">
                        <td className="px-5 py-3.5">
                          <Link href={`/projects/${p.id}`} className="block">
                            <span className="text-[13.5px] font-medium text-ink-900 group-hover:text-moss-700">
                              {p.name}
                            </span>
                            <span className="mt-0.5 block font-mono text-[10.5px] tracking-[0.06em] text-ink-400 uppercase">
                              {p.id} · {p.contractor}
                            </span>
                          </Link>
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusPill status={p.status} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-16">
                              <Meter value={p.progress} tone={toneForStatus(p.status)} height={4} />
                            </div>
                            <span className="font-mono text-[12px] text-ink-700 tabular">
                              {p.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-[12px] text-ink-700 tabular">
                          {naira(p.spent)}
                        </td>
                        <td
                          className={`px-5 py-3.5 text-right font-mono text-[12px] tabular ${
                            Math.abs(variance) > 8
                              ? "font-medium text-rust-600"
                              : "text-ink-500"
                          }`}
                        >
                          {variance > 0 ? "+" : ""}
                          {variance} pts
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="inline-flex items-center gap-1.5 font-mono text-[12px] tabular">
                            <Images className="size-3.5 text-ink-300" />
                            <span className="text-ink-700">{shots.length}</span>
                            {bad.length > 0 ? (
                              <span className="text-rust-600">· {bad.length} flagged</span>
                            ) : null}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 pb-2">
          <span className="font-mono text-[10px] tracking-[0.09em] text-ink-400 uppercase">
            Federal Ministry of Transportation · National Project Intelligence Platform
          </span>
          <span className="font-mono text-[10px] tracking-[0.09em] text-ink-400 uppercase tabular">
            Data as at {relative(PROJECTS[1].updatedAt)}
          </span>
        </footer>
      </main>
    </>
  );
}
