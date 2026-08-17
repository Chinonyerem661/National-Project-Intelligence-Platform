import { Topbar } from "@/components/shell/Topbar";
import { PolicyPanel } from "@/components/admin/PolicyPanel";
import { Card, CardHead, Meter, SurveyLabel, Tag } from "@/components/ui/primitives";
import { DEVICES, INTEGRATIONS, PHOTOS, POLICY, PROJECTS, SEED_AUDIT, USERS } from "@/lib/data";
import { dateTime, relative } from "@/lib/format";

const DEVICE_TONE: Record<string, string> = {
  Synced: "text-moss-700 bg-moss-50 border-moss-100",
  Syncing: "text-moss-700 bg-moss-50 border-moss-100",
  "Offline queue": "text-ochre-600 bg-ochre-50 border-ochre-500/25",
  Dormant: "text-ink-500 bg-paper border-line",
};

export default function AdminPage() {
  const storageGb = +(PHOTOS.reduce((s, p) => s + p.bytes, 0) * 260 / 1e9).toFixed(1);
  const usedPct = Math.round((storageGb / POLICY.storageQuotaGb) * 100);
  const queued = DEVICES.reduce((s, d) => s + d.queued, 0);

  const byRegion = Array.from(new Set(PROJECTS.map((p) => p.region))).map((region) => {
    const ids = PROJECTS.filter((p) => p.region === region).map((p) => p.id);
    const shots = PHOTOS.filter((p) => ids.includes(p.projectId));
    return {
      region,
      count: shots.length,
      gb: +((shots.reduce((s, p) => s + p.bytes, 0) * 260) / 1e9).toFixed(1),
    };
  }).sort((a, b) => b.gb - a.gb);

  const maxGb = byRegion[0]?.gb ?? 1;

  return (
    <>
      <Topbar eyebrow="Settings" title="Manage the platform" />

      <main className="px-6 py-7 lg:px-9">
        <PolicyPanel policy={POLICY} />

        <section className="mt-3 grid gap-3 lg:grid-cols-2">
          <Card>
            <CardHead
              title="Photo storage"
              note={`${PHOTOS.length} photos kept for ${POLICY.retentionYears} years`}
            />
            <div className="p-5">
              <div className="mb-5 rounded-xl border border-line bg-paper p-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <SurveyLabel>Storage used</SurveyLabel>
                  <span className="font-mono text-[12.5px] text-ink-900 tabular">
                    {storageGb} GB / {POLICY.storageQuotaGb} GB
                  </span>
                </div>
                <Meter value={usedPct} tone={usedPct > 80 ? "ochre" : "ink"} height={6} track="bg-ink-200" />
              </div>

              <div className="space-y-3.5">
                {byRegion.map((r) => (
                  <div key={r.region}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="text-[12.5px] text-ink-700">{r.region}</span>
                      <span className="font-mono text-[11.5px] text-ink-400 tabular">
                        {r.gb} GB · {r.count} photos
                      </span>
                    </div>
                    <Meter value={(r.gb / maxGb) * 100} tone="moss" height={4} />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <CardHead
              title="Photos waiting to upload"
              note={`${queued} photos waiting on ${DEVICES.filter((d) => d.queued > 0).length} phones with no signal`}
            />
            <ul className="divide-y divide-line">
              {DEVICES.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink-900">{d.holder}</p>
                    <p className="mt-0.5 font-mono text-[10.5px] tracking-[0.06em] text-ink-400 uppercase">
                      {d.id} · v{d.appVersion} · {d.region}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.75 text-[11px] font-medium ${DEVICE_TONE[d.state]}`}
                    >
                      {d.state}
                    </span>
                    <p className="mt-1 font-mono text-[10.5px] text-ink-400 tabular">
                      {d.queued > 0 ? `${d.queued} queued · ` : ""}
                      {d.lastSync}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="border-t border-line bg-paper px-5 py-3.5 text-[12.5px] leading-relaxed text-ink-600">
              Photos can still be taken with no signal. They&apos;ll upload automatically once the
              phone reconnects — nothing gets lost.
            </p>
          </Card>
        </section>

        <section className="mt-3 grid gap-3 lg:grid-cols-2">
          <Card>
            <CardHead title="People with access" note={`${USERS.length} people can log in`} />
            <ul className="divide-y divide-line">
              {USERS.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink-900">{u.name}</p>
                    <p className="mt-0.5 text-[12px] text-ink-500">
                      {u.role} · {u.region}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={`font-mono text-[11px] tracking-[0.06em] uppercase ${
                        u.status === "Active" ? "text-moss-600" : "text-rust-600"
                      }`}
                    >
                      {u.status}
                    </span>
                    <p className="mt-0.5 font-mono text-[10.5px] text-ink-400 tabular">
                      {u.lastLogin}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="Connected systems" note="Other ministry systems that share data with this platform" />
            <ul className="divide-y divide-line">
              {INTEGRATIONS.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink-900">{i.name}</p>
                    <p className="mt-0.5 font-mono text-[10.5px] tracking-[0.06em] text-ink-400 uppercase">
                      {i.direction} · {i.lastSync}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.75 text-[11px] font-medium ${
                      i.state === "Connected"
                        ? "border-moss-100 bg-moss-50 text-moss-700"
                        : "border-ochre-500/25 bg-ochre-50 text-ochre-600"
                    }`}
                  >
                    {i.state}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <Card className="mt-3">
          <CardHead
            title="Activity log"
            note="A permanent record of everything that's changed on this platform"
          />
          <ul className="divide-y divide-line">
            {SEED_AUDIT.map((a) => (
              <li key={a.id} className="flex items-start gap-4 px-5 py-3.5">
                <span className="mt-px shrink-0">
                  <Tag tone={a.action === "REJECT" ? "clay" : a.action === "RELEASE" ? "moss" : "neutral"}>
                    {a.action}
                  </Tag>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-ink-800">{a.summary}</p>
                  <p className="mt-0.5 font-mono text-[10.5px] tracking-[0.06em] text-ink-400 uppercase">
                    {a.actor} · {a.entityType} · {dateTime(a.timestamp)}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[10.5px] text-ink-400 tabular">
                  {relative(a.timestamp)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </main>
    </>
  );
}
