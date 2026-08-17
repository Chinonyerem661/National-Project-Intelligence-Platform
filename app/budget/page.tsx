import Link from "next/link";
import { Topbar } from "@/components/shell/Topbar";
import { Card, CardHead, Meter, Stat, StatusPill } from "@/components/ui/primitives";
import { PHOTOS, PROJECTS, isUndecided, verdictOf } from "@/lib/data";
import { naira, pct } from "@/lib/format";

export default function BudgetPage() {
  const value = PROJECTS.reduce((s, p) => s + p.budget, 0);
  const spent = PROJECTS.reduce((s, p) => s + p.spent, 0);
  const overrun = PROJECTS.filter((p) => pct(p.spent, p.budget) - p.progress > 8);

  return (
    <>
      <Topbar eyebrow="Finance" title="Disbursement ledger" />

      <main className="px-6 py-7 lg:px-9">
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Portfolio value" value={naira(value)} detail="Across 10 active contracts" />
          <Stat
            label="Released to date"
            value={naira(spent)}
            detail={`${pct(spent, value)}% of baseline`}
            accent="moss"
          />
          <Stat
            label="Remaining commitment"
            value={naira(value - spent)}
            detail="Unreleased against signed contracts"
          />
          <Stat
            label="Contracts overrunning"
            value={String(overrun.length)}
            detail="Money released ahead of evidenced work"
            accent={overrun.length ? "rust" : "moss"}
          />
        </section>

        <Card className="mt-8">
          <CardHead
            title="Release against evidenced progress"
            note="Variance beyond ±8 points triggers a ministry review under the delivery framework"
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-220 text-left">
              <thead>
                <tr className="border-b border-line">
                  {[
                    "Contract",
                    "Status",
                    "Baseline",
                    "Released",
                    "Remaining",
                    "Utilised",
                    "Progress",
                    "Variance",
                    "Evidence",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 font-mono text-[10px] font-normal tracking-[0.11em] text-ink-400 uppercase ${
                        i > 1 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {PROJECTS.map((p) => {
                  const util = pct(p.spent, p.budget);
                  const variance = util - p.progress;
                  const hot = Math.abs(variance) > 8;
                  const shots = PHOTOS.filter((x) => x.projectId === p.id);
                  const bad = shots.filter((x) => verdictOf(x) === "flagged" && isUndecided(x));

                  return (
                    <tr key={p.id} className="group transition-colors hover:bg-paper">
                      <td className="px-4 py-3.5">
                        <Link href={`/projects/${p.id}`}>
                          <span className="text-[13.5px] font-medium text-ink-900 group-hover:text-moss-700">
                            {p.name}
                          </span>
                          <span className="mt-0.5 block font-mono text-[10.5px] tracking-[0.06em] text-ink-400 uppercase">
                            {p.id}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusPill status={p.status} />
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-[12px] text-ink-700 tabular">
                        {naira(p.budget)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-[12px] text-ink-700 tabular">
                        {naira(p.spent)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-[12px] text-ink-500 tabular">
                        {naira(p.budget - p.spent)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2.5">
                          <div className="w-14">
                            <Meter value={util} tone="ink" height={4} />
                          </div>
                          <span className="w-9 text-right font-mono text-[12px] text-ink-700 tabular">
                            {util}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-[12px] text-ink-700 tabular">
                        {p.progress}%
                      </td>
                      <td
                        className={`px-4 py-3.5 text-right font-mono text-[12px] tabular ${
                          hot ? "font-medium text-rust-600" : "text-ink-500"
                        }`}
                      >
                        {variance > 0 ? "+" : ""}
                        {variance}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-[12px] tabular">
                        <span className="text-ink-700">{shots.length}</span>
                        {bad.length ? <span className="text-rust-600"> · {bad.length}</span> : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-ink-200 bg-paper">
                  <td className="px-4 py-3.5 font-mono text-[10px] tracking-[0.11em] text-ink-500 uppercase">
                    Portfolio
                  </td>
                  <td />
                  <td className="px-4 py-3.5 text-right font-mono text-[12.5px] font-medium text-ink-950 tabular">
                    {naira(value)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-[12.5px] font-medium text-ink-950 tabular">
                    {naira(spent)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-[12.5px] text-ink-700 tabular">
                    {naira(value - spent)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-[12.5px] font-medium text-ink-950 tabular">
                    {pct(spent, value)}%
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        <p className="mt-4 max-w-2xl text-[12.5px] leading-relaxed text-ink-500">
          Utilised is the share of the contract sum released. Progress is the share of physical work
          supported by accepted site evidence. A positive variance means money has moved ahead of
          verified delivery.
        </p>
      </main>
    </>
  );
}
