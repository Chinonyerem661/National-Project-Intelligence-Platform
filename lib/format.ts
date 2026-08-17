export function naira(n: number, opts: { compact?: boolean } = {}): string {
  const { compact = true } = opts;
  if (!compact) return "₦" + n.toLocaleString("en-NG");
  if (n >= 1e9) return "₦" + (n / 1e9).toFixed(2) + "bn";
  if (n >= 1e6) return "₦" + (n / 1e6).toFixed(0) + "m";
  return "₦" + n.toLocaleString("en-NG");
}

export function coords(lat: number, lng: number): string {
  return `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? "N" : "S"} ${Math.abs(lng).toFixed(4)}°${lng >= 0 ? "E" : "W"}`;
}

export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function dateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relative(iso: string, now = Date.parse("2026-08-15T09:00:00Z")): string {
  const diff = now - Date.parse(iso);
  const h = Math.floor(diff / 3.6e6);
  if (h < 1) return "moments ago";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export function megabytes(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

export function pct(part: number, whole: number): number {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}
