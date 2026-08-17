import { Bell, Search } from "lucide-react";
import type { ReactNode } from "react";

export function Topbar({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="flex items-center justify-between gap-6 px-6 py-4 lg:px-9">
        <div className="min-w-0">
          <span className="survey-label">{eyebrow}</span>
          <h1 className="mt-1.5 truncate font-display text-[22px] leading-none font-semibold">
            {title}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          {action}
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              placeholder="Search projects"
              aria-label="Search projects"
              className="w-52 rounded-xl border border-line bg-surface py-1.75 pr-3 pl-8 text-[12.5px] text-ink-800 placeholder:text-ink-400 focus:border-line-strong focus:outline-none"
            />
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl border border-line bg-surface p-2 text-ink-500 transition hover:text-ink-800"
          >
            <Bell className="size-3.5" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-rust-500" />
          </button>
          <div className="flex items-center gap-2.5 border-l border-line pl-2.5">
            <div className="hidden text-right lg:block">
              <p className="text-[12.5px] leading-tight font-medium text-ink-900">Ibrahim Sule</p>
              <p className="font-mono text-[10px] tracking-[0.06em] text-ink-400 uppercase">
                ICT Administrator
              </p>
            </div>
            <span className="flex size-8 items-center justify-center rounded-full bg-ink-900 font-mono text-[11px] text-white">
              IS
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
