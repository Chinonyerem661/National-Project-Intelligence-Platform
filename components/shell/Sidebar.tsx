"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Building2,
  Gauge,
  Images,
  Settings2,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Overview", icon: Gauge },
  { href: "/projects", label: "Projects", icon: Building2 },
  { href: "/evidence", label: "Evidence", icon: Images },
  { href: "/budget", label: "Disbursement", icon: Wallet },
  { href: "/admin", label: "Administration", icon: Settings2 },
];

export function Sidebar({ flagged }: { flagged: number }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-58 flex-col border-r border-ink-800 bg-ink-950 lg:flex">
      <div className="border-b border-ink-800 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-sm bg-moss-600">
            <ShieldCheck className="size-4 text-white" strokeWidth={2} />
          </span>
          <div className="leading-none">
            <p className="font-display text-[13px] font-semibold tracking-[-0.01em] text-white">
              MoT
            </p>
          </div>
        </div>
        <p className="mt-2.5 font-mono text-[10px] leading-relaxed tracking-[0.09em] text-ink-500 uppercase">
          National Project
          <br />
          Intelligence Platform
        </p>
      </div>

      <nav className="flex-1 px-3 py-4" aria-label="Primary">
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "group flex items-center gap-2.5 rounded-sm px-3 py-2.25 text-[13px] transition-colors",
                    active
                      ? "bg-ink-800 text-white"
                      : "text-ink-400 hover:bg-ink-900 hover:text-ink-200",
                  )}
                >
                  <Icon className="size-3.75 shrink-0" strokeWidth={1.75} />
                  <span className="flex-1">{item.label}</span>
                  {item.href === "/evidence" && flagged > 0 ? (
                    <span className="rounded-full bg-rust-600 px-1.5 py-px font-mono text-[10px] text-white tabular">
                      {flagged}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-ink-800 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-moss-400 opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-moss-500" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.09em] text-ink-400 uppercase">
            Systems nominal
          </span>
        </div>
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink-600">
          Evidence store synced
          <br />
          15 Aug 2026 · 09:00 WAT
        </p>
      </div>
    </aside>
  );
}
