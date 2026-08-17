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
 */
export function EvidenceImage({
  scene,
  alt,
  className,
  sizes,
  priority,
  width = 1600,
  height = 1067,
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
  const chain = [localUrl(scene), remoteUrl(scene, width, height)];
  const [resolved, setResolved] = useState<string | null | "exhausted">(null);

  useEffect(() => {
    let cancelled = false;
    setResolved(null);

    (async () => {
      for (const url of chain) {
        const ok = await new Promise<boolean>((resolve) => {
          const probe = new window.Image();
          probe.onload = () => resolve(true);
          probe.onerror = () => resolve(false);
          probe.src = url;
        });
        if (cancelled) return;
        if (ok) {
          setResolved(url);
          return;
        }
      }
      if (!cancelled) setResolved("exhausted");
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, width, height]);

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
