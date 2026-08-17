import clsx from "clsx";
import type { ReactNode } from "react";
import type { ProjectStatus, Verdict } from "@/lib/types";

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag
      className={clsx("rounded-xl border border-line bg-surface shadow-(--shadow-card)", className)}
    >
      {children}
    </Tag>
  );
}

export function CardHead({
  title,
  note,
  action,
}: {
  title: string;
  note?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
      <div className="min-w-0">
        <h2 className="text-[15px] leading-tight">{title}</h2>
        {note ? <p className="mt-1 text-[12.5px] text-ink-500">{note}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function SurveyLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={clsx("survey-label block", className)}>{children}</span>;
}

const STATUS_STYLE: Record<ProjectStatus, string> = {
  Ahead: "text-moss-700 bg-moss-50 border-moss-100",
  "On Track": "text-moss-700 bg-moss-50 border-moss-100",
  "At Risk": "text-ochre-600 bg-ochre-50 border-ochre-500/25",
  Delayed: "text-rust-600 bg-rust-50 border-rust-500/25",
};

const STATUS_DOT: Record<ProjectStatus, string> = {
  Ahead: "bg-moss-500",
  "On Track": "bg-moss-500",
  "At Risk": "bg-ochre-500",
  Delayed: "bg-rust-500",
};

export function StatusPill({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.75 text-[11px] font-medium whitespace-nowrap",
        STATUS_STYLE[status],
      )}
    >
      <span className={clsx("size-1.5 rounded-full", STATUS_DOT[status])} />
      {status}
    </span>
  );
}

const VERDICT_STYLE: Record<Verdict, { label: string; cls: string; dot: string }> = {
  verified: { label: "Verified", cls: "text-moss-700 bg-moss-50 border-moss-100", dot: "bg-moss-500" },
  review: { label: "Review", cls: "text-ochre-600 bg-ochre-50 border-ochre-500/25", dot: "bg-ochre-500" },
  flagged: { label: "Flagged", cls: "text-rust-600 bg-rust-50 border-rust-500/25", dot: "bg-rust-500" },
};

export function VerdictPill({ verdict, dark }: { verdict: Verdict; dark?: boolean }) {
  const v = VERDICT_STYLE[verdict];
  if (dark) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-ink-950/65 px-2.5 py-0.75 text-[11px] font-medium text-white backdrop-blur-sm">
        <span className={clsx("size-1.5 rounded-full", v.dot)} />
        {v.label}
      </span>
    );
  }
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.75 text-[11px] font-medium whitespace-nowrap",
        v.cls,
      )}
    >
      <span className={clsx("size-1.5 rounded-full", v.dot)} />
      {v.label}
    </span>
  );
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "moss" | "clay" }) {
  const tones = {
    neutral: "border-line bg-paper text-ink-600",
    moss: "border-moss-100 bg-moss-50 text-moss-700",
    clay: "border-clay-500/25 bg-clay-50 text-clay-600",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-1.5 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  detail,
  trend,
  accent = "ink",
}: {
  label: string;
  value: string;
  detail?: string;
  trend?: ReactNode;
  accent?: "ink" | "moss" | "ochre" | "rust";
}) {
  const rule = {
    ink: "bg-ink-800",
    moss: "bg-moss-500",
    ochre: "bg-ochre-500",
    rust: "bg-rust-500",
  }[accent];

  return (
    <Card className="p-5">
      <div className={clsx("mb-4 h-0.75 w-7 rounded-full", rule)} />
      <SurveyLabel>{label}</SurveyLabel>
      <p className="mt-2.5 font-display text-[27px] leading-none font-semibold tracking-[-0.008em] text-ink-950 tabular">
        {value}
      </p>
      {detail ? <p className="mt-2 text-[12.5px] text-ink-500">{detail}</p> : null}
      {trend}
    </Card>
  );
}

export function Meter({
  value,
  tone = "moss",
  height = 5,
  track = "bg-ink-100",
}: {
  value: number;
  tone?: "moss" | "ochre" | "rust" | "ink";
  height?: number;
  track?: string;
}) {
  const fill = {
    moss: "bg-moss-500",
    ochre: "bg-ochre-500",
    rust: "bg-rust-500",
    ink: "bg-ink-800",
  }[tone];

  return (
    <div className={clsx("w-full overflow-hidden rounded-full", track)} style={{ height }}>
      <div
        className={clsx("h-full rounded-full transition-[width] duration-500", fill)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function toneForStatus(status: ProjectStatus): "moss" | "ochre" | "rust" {
  if (status === "Delayed") return "rust";
  if (status === "At Risk") return "ochre";
  return "moss";
}

export function DataRow({
  label,
  value,
  mono = true,
  tone,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  tone?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-0">
      <span className="survey-label shrink-0">{label}</span>
      <span
        className={clsx(
          "text-right text-[12.5px] leading-snug",
          mono && "font-mono tabular",
          tone ?? "text-ink-800",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-3 flex size-10 items-center justify-center rounded-full border border-line bg-paper text-ink-400">
        {icon}
      </div>
      <h3 className="text-[14px]">{title}</h3>
      <p className="mt-1 max-w-sm text-[12.5px] text-ink-500">{body}</p>
    </div>
  );
}
