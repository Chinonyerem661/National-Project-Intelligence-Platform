"use client";

import { useState } from "react";
import clsx from "clsx";
import { Card, CardHead, SurveyLabel } from "@/components/ui/primitives";
import type { CapturePolicy } from "@/lib/types";

function Switch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={clsx(
        "relative h-5.5 w-9.5 shrink-0 rounded-full transition-colors",
        on ? "bg-moss-600" : "bg-ink-200",
      )}
    >
      <span
        className={clsx(
          "absolute top-0.75 size-4 rounded-full bg-white transition-all",
          on ? "left-4.75" : "left-0.75",
        )}
      />
    </button>
  );
}

const RULES: { key: keyof CapturePolicy; label: string; note: string }[] = [
  {
    key: "requireInApp",
    label: "Only allow photos taken in the app",
    note: "Stops people uploading old photos from their gallery instead of taking a new one.",
  },
  {
    key: "duplicateDetection",
    label: "Catch repeated photos automatically",
    note: "Flags a photo if it's already been submitted for any project.",
  },
  {
    key: "hiddenWorksGate",
    label: "Require proof before paying for hidden work",
    note: "Blocks the next payment claim until there's a photo proving the work underneath is done.",
  },
  {
    key: "publicReleaseRequiresApproval",
    label: "A person must approve photos before they go public",
    note: "No photo is shown to the public without someone explicitly deciding to share it.",
  },
];

export function PolicyPanel({ policy: initial }: { policy: CapturePolicy }) {
  const [policy, setPolicy] = useState(initial);

  const set = <K extends keyof CapturePolicy>(key: K, value: CapturePolicy[K]) =>
    setPolicy((p) => ({ ...p, [key]: value }));

  return (
    <Card>
      <CardHead
        title="Rules for photos from the field"
        note="These apply to every phone the next time it connects. Changes are saved automatically."
      />

      <div className="grid gap-5 border-b border-line p-5 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <SurveyLabel>How close photos must be to the site</SurveyLabel>
            <span className="font-mono text-[13px] font-medium text-ink-900 tabular">
              {policy.geofenceRadius} m
            </span>
          </div>
          <p className="mb-3 text-[12.5px] leading-relaxed text-ink-500">
            Photos taken further than this from the project are held for a manual check.
          </p>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={policy.geofenceRadius}
            onChange={(e) => set("geofenceRadius", Number(e.target.value))}
            aria-label="Maximum distance from the site in metres"
            className="w-full accent-moss-600"
          />
        </div>

        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <SurveyLabel>How old a photo can be</SurveyLabel>
            <span className="font-mono text-[13px] font-medium text-ink-900 tabular">
              {policy.maxCaptureAgeDays} days
            </span>
          </div>
          <p className="mb-3 text-[12.5px] leading-relaxed text-ink-500">
            Older photos are held for a manual check rather than accepted automatically.
          </p>
          <input
            type="range"
            min={1}
            max={60}
            value={policy.maxCaptureAgeDays}
            onChange={(e) => set("maxCaptureAgeDays", Number(e.target.value))}
            aria-label="Maximum capture age in days"
            className="w-full accent-moss-600"
          />
        </div>
      </div>

      <ul className="divide-y divide-line">
        {RULES.map((rule) => (
          <li key={rule.key} className="flex items-start justify-between gap-6 px-5 py-4">
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium text-ink-900">{rule.label}</p>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-500">{rule.note}</p>
            </div>
            <Switch
              on={policy[rule.key] as boolean}
              onChange={(v) => set(rule.key, v as CapturePolicy[typeof rule.key])}
              label={rule.label}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
