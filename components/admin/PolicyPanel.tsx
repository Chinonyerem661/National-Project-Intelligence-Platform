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
    label: "Require in-app camera capture",
    note: "Blocks gallery uploads for progress and hidden-works evidence.",
  },
  {
    key: "duplicateDetection",
    label: "Perceptual duplicate detection",
    note: "Flags images already submitted against any contract in the portfolio.",
  },
  {
    key: "hiddenWorksGate",
    label: "Hidden-works gate",
    note: "Blocks the next milestone claim until covering-stage evidence exists.",
  },
  {
    key: "publicReleaseRequiresApproval",
    label: "Manual approval for public release",
    note: "No image reaches the transparency portal without an explicit decision.",
  },
];

export function PolicyPanel({ policy: initial }: { policy: CapturePolicy }) {
  const [policy, setPolicy] = useState(initial);

  const set = <K extends keyof CapturePolicy>(key: K, value: CapturePolicy[K]) =>
    setPolicy((p) => ({ ...p, [key]: value }));

  return (
    <Card>
      <CardHead
        title="Evidence capture rules"
        note="Applied to every field device on next sync. Every change is written to the audit trail."
      />

      <div className="grid gap-5 border-b border-line p-5 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <SurveyLabel>Geofence radius</SurveyLabel>
            <span className="font-mono text-[13px] font-medium text-ink-900 tabular">
              {policy.geofenceRadius} m
            </span>
          </div>
          <p className="mb-3 text-[12.5px] leading-relaxed text-ink-500">
            Distance from the corridor centreline within which capture is accepted.
          </p>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={policy.geofenceRadius}
            onChange={(e) => set("geofenceRadius", Number(e.target.value))}
            aria-label="Geofence radius in metres"
            className="w-full accent-moss-600"
          />
        </div>

        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <SurveyLabel>Maximum capture age</SurveyLabel>
            <span className="font-mono text-[13px] font-medium text-ink-900 tabular">
              {policy.maxCaptureAgeDays} days
            </span>
          </div>
          <p className="mb-3 text-[12.5px] leading-relaxed text-ink-500">
            Older images are held for review rather than accepted automatically.
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
