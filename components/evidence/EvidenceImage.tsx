"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { PHOTO_SOURCES, localUrl, remoteUrl } from "@/lib/images";
import type { SceneId } from "@/lib/types";

/**
 * Resolves a scene to a photograph, walking local file → photo CDN → plate.
 *
 * Plain <img> rather than next/image: sources are mixed local/remote, and it
 * keeps remote-pattern config out of next.config. The chain is probed with a
 * detached Image() before the visible <img> ever points at it — a same-origin
 * 404 for a missing local file resolves faster than hydration, so an onError
 * handler on the rendered element arrives too late to catch it. Swap to
 * next/image once photography is finalised locally.
 *
 * Local and remote are probed in parallel rather than in sequence — the local
 * file almost never exists yet, so waiting out its 404 before even starting
 * the remote fetch was adding a full extra round trip to every photo on the
 * page. Results are cached per scene+size for the life of the tab, so the
 * same photo appearing in a card and a gallery only fetches once. A timeout
 * keeps one slow CDN response from leaving a tile spinning indefinitely.
 */
const resolveCache = new Map<string, string | "exhausted">();
const REMOTE_TIMEOUT_MS = 6000;

function probe(url: string, timeoutMs?: number): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };
    img.onload = () => finish(true);
    img.onerror = () => finish(false);
    img.src = url;
    if (timeoutMs) setTimeout(() => finish(false), timeoutMs);
  });
}

export function EvidenceImage({
  scene,
  alt,
  className,
  sizes,
  priority,
  width = 800,
  height = 534,
}: {
  scene: SceneId;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}) {
  const source = PHOTO_SOURCES[scene];
  const cacheKey = `${scene}:${width}x${height}`;
  const [resolved, setResolved] = useState<string | null | "exhausted">(
    () => resolveCache.get(cacheKey) ?? null,
  );

  useEffect(() => {
    const cached = resolveCache.get(cacheKey);
    if (cached) {
      setResolved(cached);
      return;
    }

    let cancelled = false;
    setResolved(null);

    const local = localUrl(scene);
    const remote = remoteUrl(scene, width, height);

    Promise.all([probe(local), probe(remote, REMOTE_TIMEOUT_MS)]).then(
      ([localOk, remoteOk]) => {
        if (cancelled) return;
        const result = localOk ? local : remoteOk ? remote : "exhausted";
        resolveCache.set(cacheKey, result);
        setResolved(result);
      },
    );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, scene, width, height]);

  if (resolved === "exhausted") {
    return (
      <div
        className={clsx("hatch relative flex flex-col justify-between bg-ink-900 p-4", className)}
        role="img"
        aria-label={`${alt} — photograph not yet supplied`}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[0.11em] text-ink-400 uppercase">
            Awaiting photography
          </span>
          <span className="font-mono text-[10px] tracking-[0.11em] text-ink-500 uppercase">
            {scene}
          </span>
        </div>
        <p className="max-w-[34ch] text-[12px] leading-snug text-ink-300">{source.subject}</p>
        <span className="font-mono text-[10px] tracking-[0.08em] text-ink-500">
          public/evidence/{source.file}
        </span>
      </div>
    );
  }

  if (!resolved) {
    return <div className={clsx("animate-pulse bg-ink-900", className)} role="img" aria-label={alt} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={clsx("object-cover", className)}
    />
  );
}
