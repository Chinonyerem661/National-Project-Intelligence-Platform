"use client";

import { useState } from "react";
import clsx from "clsx";
import { PhotoCard, PhotoInspector } from "./PhotoCard";
import type { Photo } from "@/lib/types";

export function Gallery({
  photos,
  columns = "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
  showProject,
  projectNames,
  ratio,
}: {
  photos: Photo[];
  columns?: string;
  showProject?: boolean;
  projectNames?: Record<string, string>;
  ratio?: string;
}) {
  const [open, setOpen] = useState<Photo | null>(null);

  const step = (delta: number) => {
    if (!open) return;
    const i = photos.findIndex((p) => p.id === open.id);
    const next = photos[i + delta];
    if (next) setOpen(next);
  };

  return (
    <>
      <div className={clsx("grid gap-3", columns)}>
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onOpen={setOpen}
            showProject={showProject}
            projectName={projectNames?.[photo.projectId]}
            ratio={ratio}
          />
        ))}
      </div>
      <PhotoInspector
        photo={open}
        list={photos}
        projectName={open ? projectNames?.[open.projectId] : undefined}
        onClose={() => setOpen(null)}
        onStep={step}
      />
    </>
  );
}
