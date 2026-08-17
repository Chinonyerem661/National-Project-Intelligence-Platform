"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Camera, CheckCircle2, MapPin, Smartphone } from "lucide-react";
import { EvidenceImage } from "./EvidenceImage";
import { PhotoInspector } from "./PhotoCard";
import { Card, EmptyState, SurveyLabel, Tag, VerdictPill } from "@/components/ui/primitives";
import { verdictOf } from "@/lib/data";
import { coords, relative } from "@/lib/format";
import type { Photo, Verdict } from "@/lib/types";

type FilterId = "flagged" | "review" | "pending" | "all";

const CATEGORY_LABEL: Record<Photo["category"], string> = {
  progress: "Progress",
  hidden: "Hidden works",
  defect: "Defect",
  delivery: "Delivery",
};

export function ReviewQueue({
  initial,
  projectNames,
}: {
  initial: Photo[];
  projectNames: Record<string, string>;
}) {
  const [photos, setPhotos] = useState(initial);
  const [filter, setFilter] = useState<FilterId>("flagged");
  const [open, setOpen] = useState<Photo | null>(null);
  const [log, setLog] = useState<string[]>([]);


  const undecided = (p: Photo) => p.status !== "approved" && p.status !== "rejected";

  const counts = useMemo(
    () => ({
      flagged: photos.filter((p) => verdictOf(p) === "flagged" && undecided(p)).length,
      review: photos.filter((p) => verdictOf(p) === "review" && undecided(p)).length,
      pending: photos.filter((p) => p.status === "pending").length,
      all: photos.length,
    }),
    [photos],
  );

  const visible = useMemo(() => {
    const rank: Record<Verdict, number> = { flagged: 0, review: 1, verified: 2 };
    return photos
      .filter((p) => {
        if (filter === "flagged") return verdictOf(p) === "flagged" && undecided(p);
        if (filter === "review") return verdictOf(p) === "review" && undecided(p);
        if (filter === "pending") return p.status === "pending";
        return true;
      })
      .sort((a, b) => {
        const d = rank[verdictOf(a)] - rank[verdictOf(b)];
        return d !== 0 ? d : Date.parse(b.uploadedAt) - Date.parse(a.uploadedAt);
      });
  }, [photos, filter]);

  const decide = (photo: Photo, decision: "approved" | "rejected" | "release") => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id !== photo.id
          ? p
          : decision === "release"
            ? { ...p, publicRelease: !p.publicRelease }
            : { ...p, status: decision },
      ),
    );
    setLog((prev) =>
      [
        decision === "release"
          ? `${photo.id} ${photo.publicRelease ? "hidden from" : "shown to"} the public`
          : `${photo.id} ${decision === "approved" ? "approved" : "rejected"} by I. Sule`,
        ...prev,
      ].slice(0, 6),
    );
    setOpen(null);
  };

  const step = (delta: number) => {
    if (!open) return;
    const i = visible.findIndex((p) => p.id === open.id);
    const next = visible[i + delta];
    if (next) setOpen(next);
  };

  const FILTERS: { id: FilterId; label: string; n: number; accent: string }[] = [
    { id: "flagged", label: "Flagged", n: counts.flagged, accent: "bg-rust-500" },
    { id: "review", label: "Needs review", n: counts.review, accent: "bg-ochre-500" },
    { id: "pending", label: "Waiting to be checked", n: counts.pending, accent: "bg-ink-800" },
    { id: "all", label: "All photos", n: counts.all, accent: "bg-ink-300" },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={clsx(
              "rounded-xl border bg-surface p-5 text-left shadow-(--shadow-card) transition-colors",
              filter === f.id ? "border-ink-800" : "border-line hover:border-line-strong",
            )}
          >
            <div className={clsx("mb-4 h-0.75 w-7 rounded-full", f.accent)} />
            <p className="font-display text-[27px] leading-none font-semibold tracking-[-0.008em] text-ink-950 tabular">
              {f.n}
            </p>
            <p className="survey-label mt-2.5">{f.label}</p>
          </button>
        ))}
      </div>

      {log.length > 0 ? (
        <div className="mt-3 rounded-xl border border-moss-100 bg-moss-50 px-5 py-3.5">
          <SurveyLabel className="mb-2">Recent decisions</SurveyLabel>
          <ul className="space-y-1">
            {log.map((entry, i) => (
              <li key={i} className="font-mono text-[11.5px] text-moss-700 tabular">
                {entry}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Card className="mt-3">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-[15px] leading-tight">Photos to check</h2>
            <p className="mt-1 text-[12.5px] text-ink-500">
              Every decision is saved automatically, so nothing gets lost
            </p>
          </div>
          <span className="font-mono text-[11.5px] text-ink-400 tabular">
            {visible.length} shown
          </span>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="size-4 text-moss-600" />}
            title="All done!"
            body="No photos match this filter. Try a different tab above."
          />
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((photo) => {
              const verdict = verdictOf(photo);
              return (
                <li
                  key={photo.id}
                  className={clsx(
                    "flex flex-col gap-4 p-4 transition-colors sm:flex-row",
                    verdict === "flagged" ? "bg-rust-50/40" : "hover:bg-paper",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(photo)}
                    className="relative w-full shrink-0 overflow-hidden rounded-xl bg-ink-900 sm:w-42"
                    style={{ aspectRatio: "4 / 3" }}
                    aria-label={`View photo ${photo.id}`}
                  >
                    <EvidenceImage
                      scene={photo.scene}
                      alt={`${photo.stage} at ${photo.location}`}
                      className="size-full"
                      sizes="200px"
                      width={340}
                      height={255}
                    />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => setOpen(photo)}
                          className="block text-left"
                        >
                          <span className="text-[14px] font-medium text-ink-900 hover:text-moss-700">
                            {photo.stage} — {photo.location}
                          </span>
                        </button>
                        <p className="mt-0.5 text-[12.5px] text-ink-500">
                          {projectNames[photo.projectId]}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Tag>{CATEGORY_LABEL[photo.category]}</Tag>
                        <VerdictPill verdict={verdict} />
                      </div>
                    </div>

                    {photo.finding ? (
                      <p
                        className={clsx(
                          "mt-2 text-[12.5px] leading-relaxed",
                          verdict === "flagged" ? "text-rust-600" : "text-ochre-600",
                        )}
                      >
                        {photo.finding}
                      </p>
                    ) : null}

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] text-ink-400 tabular">
                      <span className="inline-flex items-center gap-1.5">
                        <Camera className="size-3" /> {photo.uploader}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Smartphone className="size-3" /> {photo.device}
                      </span>
                      <span
                        className={clsx(
                          "inline-flex items-center gap-1.5",
                          photo.insideGeofence ? "" : "text-rust-600",
                        )}
                      >
                        <MapPin className="size-3" /> {coords(photo.lat, photo.lng)}
                      </span>
                      <span>{relative(photo.capturedAt)}</span>
                    </div>

                    <div className="mt-3.5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => decide(photo, "approved")}
                        className="rounded-xl bg-moss-600 px-3.5 py-1.75 text-[12.5px] font-medium text-white transition hover:bg-moss-700"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => decide(photo, "rejected")}
                        className="rounded-xl border border-line-strong px-3.5 py-1.75 text-[12.5px] font-medium text-rust-600 transition hover:border-rust-500/40 hover:bg-rust-50"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpen(photo)}
                        className="rounded-xl border border-line px-3.5 py-1.75 text-[12.5px] text-ink-600 transition hover:bg-surface"
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <PhotoInspector
        photo={open}
        list={visible}
        projectName={open ? projectNames[open.projectId] : undefined}
        onClose={() => setOpen(null)}
        onStep={step}
        onDecide={decide}
      />
    </>
  );
}

