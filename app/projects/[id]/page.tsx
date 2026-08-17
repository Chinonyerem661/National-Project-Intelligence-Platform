import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Topbar } from "@/components/shell/Topbar";
import { Gallery } from "@/components/evidence/Gallery";
import {
  Card,
  CardHead,
  DataRow,
  EmptyState,
  Meter,
  StatusPill,
  SurveyLabel,
  toneForStatus,
} from "@/components/ui/primitives";
import { PHOTOS, PROJECTS, isUndecided, projectById, verdictOf } from "@/lib/data";
import { coords, naira, pct, shortDate } from "@/lib/format";
import { Images } from "lucide-react";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projectById(id);
  if (!project) notFound();

  const shots = PHOTOS.filter((p) => p.projectId === project.id).sort(
    (a, b) => Date.parse(b.capturedAt) - Date.parse(a.capturedAt),
  );
  const flagged = shots.filter((p) => verdictOf(p) === "flagged" && isUndecided(p));
  const accepted = shots.filter((p) => p.status === "approved");
  const util = pct(project.spent, project.budget);
  const variance = util - project.progress;
  const names = { [project.id]: project.name };

  return (
    <>
      <Topbar eyebrow={`${project.id} · ${project.region} · ${project.mode}`} title={project.name} />

      <main className="px-6 py-7 lg:px-9">
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-1.5 text-[12.5px] text-ink-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="size-3.5" /> All projects
        </Link>

        <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-3">
            <Card className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusPill status={project.status} />
                <span className="font-mono text-[11.5px] text-ink-400 tabular">
                  {shortDate(project.startedAt)} — {shortDate(project.dueAt)}
                </span>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-baseline justify-between">
                  <SurveyLabel>Work completed, confirmed by photos</SurveyLabel>
                  <span className="font-display text-[24px] leading-none font-semibold text-ink-950 tabular">
                    {project.progress}%
                  </span>
                </div>
                <Meter value={project.progress} tone={toneForStatus(project.status)} height={7} />
              </div>

              <div className="survey-rule mt-5 grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-4">
                {[
                  ["Budget", naira(project.budget)],
                  ["Paid so far", `${naira(project.spent)} · ${util}%`],
                  ["Difference", `${variance > 0 ? "+" : ""}${variance}%`],
                  [
                    "Schedule",
                    project.forecastSlip > 0
                      ? `${project.forecastSlip} days late`
                      : project.forecastSlip < 0
                        ? `${Math.abs(project.forecastSlip)} days ahead`
                        : "On schedule",
                  ],
                ].map(([k, v], i) => (
                  <div key={k}>
                    <SurveyLabel>{k}</SurveyLabel>
                    <p
                      className={`mt-1.5 font-mono text-[13px] tabular ${
                        (i === 2 && Math.abs(variance) > 8) ||
                        (i === 3 && project.forecastSlip > 0)
                          ? "font-medium text-rust-600"
                          : "text-ink-900"
                      }`}
                    >
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {project.risk ? (
              <Card className="border-l-[3px] border-l-ochre-500 p-5">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-ochre-600" strokeWidth={1.75} />
                  <div>
                    <SurveyLabel>Watch out for</SurveyLabel>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-800">{project.risk}</p>
                  </div>
                </div>
              </Card>
            ) : null}

            <Card>
              <CardHead
                title="Photos from the site"
                note={`${shots.length} photos · ${accepted.length} approved${
                  flagged.length ? ` · ${flagged.length} flagged` : ""
                }`}
              />
              <div className="p-5">
                {shots.length === 0 ? (
                  <EmptyState
                    icon={<Images className="size-4" />}
                    title="No photos yet"
                    body="No one has uploaded site photos for this project yet."
                  />
                ) : (
                  <Gallery
                    photos={shots}
                    columns="grid-cols-2 md:grid-cols-3"
                    projectNames={names}
                  />
                )}
              </div>
            </Card>
          </div>

          {/* Record column */}
          <div className="space-y-3">
            <Card className="p-5">
              <SurveyLabel className="mb-3">Project details</SurveyLabel>
              <DataRow label="Project ID" value={project.id} />
              <DataRow label="Contractor" value={project.contractor} mono={false} />
              <DataRow label="Region" value={project.region} mono={false} />
              <DataRow label="Type" value={project.mode} mono={false} />
              <DataRow label="Location" value={coords(project.lat, project.lng)} />
              <DataRow label="Started" value={shortDate(project.startedAt)} />
              <DataRow label="Due" value={shortDate(project.dueAt)} />
            </Card>

            <Card className="p-5">
              <SurveyLabel className="mb-3">Payments</SurveyLabel>
              <div className="mb-4">
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[12.5px] text-ink-600">Paid so far</span>
                  <span className="font-mono text-[12.5px] text-ink-900 tabular">{util}%</span>
                </div>
                <Meter value={util} tone="ink" />
              </div>
              <DataRow label="Budget" value={naira(project.budget)} />
              <DataRow label="Paid" value={naira(project.spent)} />
              <DataRow label="Remaining" value={naira(project.budget - project.spent)} />
              <DataRow
                label="Difference"
                value={`${variance > 0 ? "+" : ""}${variance}%`}
                tone={Math.abs(variance) > 8 ? "text-rust-600 font-medium" : undefined}
              />
              <p className="mt-4 border-t border-line pt-3 text-[12px] leading-relaxed text-ink-500">
                {accepted.length} of {shots.length} photos approved
                {flagged.length
                  ? `. ${flagged.length} still need a decision before they count toward payment.`
                  : ". All photos have been checked."}
              </p>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
