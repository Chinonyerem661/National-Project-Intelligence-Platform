"use client";

import { useCallback, useEffect } from "react";
import clsx from "clsx";
import {
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  Globe,
  Images,
  MapPin,
  Smartphone,
  X,
} from "lucide-react";
import { EvidenceImage } from "./EvidenceImage";
import { VerdictPill, Tag } from "@/components/ui/primitives";
import { verdictOf } from "@/lib/data";
import { coords, dateTime, megabytes, relative } from "@/lib/format";
import type { Photo } from "@/lib/types";

const CATEGORY_LABEL: Record<Photo["category"], string> = {
  progress: "Progress",
  hidden: "Hidden works",
  defect: "Defect",
  delivery: "Delivery",
};

export function PhotoCard({
  photo,
  onOpen,
  showProject,
  projectName,
  ratio = "4 / 3",
}: {
  photo: Photo;
  onOpen: (p: Photo) => void;
  showProject?: boolean;
  projectName?: string;
  ratio?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(photo)}
      className="group block w-full overflow-hidden rounded-xl border border-line bg-surface text-left shadow-(--shadow-card) transition-colors hover:border-line-strong"
    >
      <div className="relative overflow-hidden bg-ink-900" style={{ aspectRatio: ratio }}>
        <EvidenceImage
          scene={photo.scene}
          alt={`${photo.stage} at ${photo.location}`}
          className="size-full transition-transform duration-600 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, 25vw"
          width={480}
          height={360}
        />
        <div className="scrim pointer-events-none absolute inset-x-0 bottom-0 h-2/3" />
        <div className="absolute top-3 left-3">
          <VerdictPill verdict={verdictOf(photo)} dark />
        </div>
        {photo.publicRelease ? (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-ink-950/65 px-2 py-0.75 font-mono text-[10px] tracking-[0.08em] text-white uppercase backdrop-blur-sm">
              <Globe className="size-3" /> Public
            </span>
          </div>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <p className="font-mono text-[10px] tracking-[0.11em] text-white/60 uppercase">
            {photo.location}
          </p>
          <p className="mt-1 font-display text-[15px] leading-tight font-semibold text-white">
            {photo.stage}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
        <span className="truncate text-[12px] text-ink-500">
          {showProject ? projectName : CATEGORY_LABEL[photo.category]}
        </span>
        <span className="shrink-0 font-mono text-[11px] text-ink-400 tabular">
          {relative(photo.capturedAt)}
        </span>
      </div>
    </button>
  );
}

function CheckLine({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2.5 py-1.75">
      <span
        className={clsx(
          "flex size-4.5 shrink-0 items-center justify-center rounded-full border",
          ok ? "border-moss-100 bg-moss-50 text-moss-600" : "border-rust-500/25 bg-rust-50 text-rust-600",
        )}
      >
        {ok ? <Check className="size-3" strokeWidth={2.5} /> : <X className="size-3" strokeWidth={2.5} />}
      </span>
      <span className={clsx("text-[12.5px]", ok ? "text-ink-700" : "text-rust-600")}>{label}</span>
    </div>
  );
}

export function PhotoInspector({
  photo,
  list,
  projectName,
  onClose,
  onStep,
  onDecide,
}: {
  photo: Photo | null;
  list: Photo[];
  projectName?: string;
  onClose: () => void;
  onStep: (delta: number) => void;
  onDecide?: (photo: Photo, decision: "approved" | "rejected" | "release") => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "ArrowRight") onStep(1);
    },
    [photo, onClose, onStep],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    if (!photo) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [photo]);

  if (!photo) return null;

  const idx = list.findIndex((p) => p.id === photo.id);
  const verdict = verdictOf(photo);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${photo.id}`}
    >
      <div
        className="grid max-h-[92vh] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-2xl bg-surface shadow-(--shadow-raised) lg:grid-cols-[1.55fr_1fr]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Plate */}
        <div className="relative flex min-h-70 items-center justify-center bg-ink-950 lg:min-h-0">
          <EvidenceImage
            scene={photo.scene}
            alt={`${photo.stage} at ${photo.location}`}
            className="max-h-[60vh] w-full lg:max-h-[92vh]"
            width={1400}
            height={933}
            priority
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
            <div className="scrim absolute inset-x-0 bottom-0 h-32" />
            <div className="relative flex items-end justify-between gap-4">
              <span className="font-mono text-[11px] tracking-[0.1em] text-white/70 tabular">
                {coords(photo.lat, photo.lng)}
              </span>
              <span className="font-mono text-[11px] tracking-[0.1em] text-white/70 tabular">
                {dateTime(photo.capturedAt)}
              </span>
            </div>
          </div>

          {list.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => onStep(-1)}
                disabled={idx <= 0}
                aria-label="Previous image"
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full border border-white/15 bg-ink-950/55 p-2 text-white/80 backdrop-blur-sm transition hover:bg-ink-950/80 disabled:pointer-events-none disabled:opacity-0"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => onStep(1)}
                disabled={idx >= list.length - 1}
                aria-label="Next image"
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-white/15 bg-ink-950/55 p-2 text-white/80 backdrop-blur-sm transition hover:bg-ink-950/80 disabled:pointer-events-none disabled:opacity-0"
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          ) : null}
        </div>

        {/* Record */}
        <div className="flex max-h-[92vh] flex-col overflow-y-auto">
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
            <div className="min-w-0">
              <span className="font-mono text-[10px] tracking-[0.11em] text-ink-400 uppercase">
                {photo.id} · {photo.projectId}
              </span>
              <h2 className="mt-1.5 text-[19px] leading-tight">{photo.stage}</h2>
              <p className="mt-1 text-[12.5px] text-ink-500">
                {photo.location}
                {projectName ? ` · ${projectName}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mt-1 -mr-2 rounded-lg p-2 text-ink-400 transition hover:bg-paper hover:text-ink-800"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="px-6 py-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <VerdictPill verdict={verdict} />
              <Tag>{CATEGORY_LABEL[photo.category]}</Tag>
              {photo.publicRelease ? <Tag tone="moss">Public</Tag> : null}
            </div>

            {photo.caption ? (
              <p className="mb-5 text-[13.5px] leading-relaxed text-ink-700">{photo.caption}</p>
            ) : null}

            {photo.finding ? (
              <div
                className={clsx(
                  "mb-5 rounded-xl border-l-[3px] px-4 py-3",
                  verdict === "flagged"
                    ? "border-l-rust-500 bg-rust-50"
                    : "border-l-ochre-500 bg-ochre-50",
                )}
              >
                <span className="font-mono text-[10px] tracking-[0.11em] uppercase">
                  <span className={verdict === "flagged" ? "text-rust-600" : "text-ochre-600"}>
                    What we found
                  </span>
                </span>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-800">{photo.finding}</p>
                {photo.duplicateOf ? (
                  <p className="mt-2 font-mono text-[11px] text-ink-500">
                    Looks the same as photo {photo.duplicateOf}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="survey-rule mb-5">
              <span className="survey-label mb-2 block">Automatic checks</span>
              <CheckLine ok={photo.hasExif} label="Photo details weren't tampered with" />
              <CheckLine ok={photo.capturedInApp} label="Taken with the in-app camera" />
              <CheckLine ok={photo.insideGeofence} label="Taken at the project site" />
              <CheckLine ok={photo.withinPeriod} label="Taken at a believable time" />
              <CheckLine ok={!photo.duplicateOf} label="Not a repeat of another photo" />
            </div>

            <div className="survey-rule">
              <span className="survey-label mb-2.5 block">Details</span>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-[12.5px]">
                <Field icon={<MapPin className="size-3" />} label="Location">
                  <span className={photo.insideGeofence ? "" : "text-rust-600"}>
                    {coords(photo.lat, photo.lng)}
                  </span>
                </Field>
                <Field icon={<Camera className="size-3" />} label="Taken">
                  {dateTime(photo.capturedAt)}
                </Field>
                <Field icon={<Images className="size-3" />} label="Uploaded">
                  {dateTime(photo.uploadedAt)}
                </Field>
                <Field icon={<Fingerprint className="size-3" />} label="Uploaded by">
                  {photo.uploader}
                </Field>
                <Field icon={<Smartphone className="size-3" />} label="Device">
                  {photo.device}
                </Field>
                <Field icon={<Images className="size-3" />} label="File size">
                  {megabytes(photo.bytes)}
                </Field>
              </dl>
            </div>
          </div>

          {onDecide ? (
            <div className="mt-auto flex flex-wrap gap-2 border-t border-line bg-paper px-6 py-4">
              <button
                type="button"
                onClick={() => onDecide(photo, "approved")}
                className="flex-1 rounded-xl bg-moss-600 px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-moss-700"
              >
                Approve photo
              </button>
              <button
                type="button"
                onClick={() => onDecide(photo, "rejected")}
                className="flex-1 rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-[13px] font-medium text-rust-600 transition hover:border-rust-500/40 hover:bg-rust-50"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => onDecide(photo, "release")}
                className="w-full rounded-xl border border-line px-4 py-2.5 text-[13px] text-ink-700 transition hover:bg-surface"
              >
                {photo.publicRelease ? "Hide from the public" : "Show to the public"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <dt className="flex items-center gap-1.5 whitespace-nowrap text-ink-400">
        {icon}
        <span className="font-mono text-[10px] tracking-[0.09em] uppercase">{label}</span>
      </dt>
      <dd className="text-right font-mono text-[12px] text-ink-800 tabular">{children}</dd>
    </>
  );
}
