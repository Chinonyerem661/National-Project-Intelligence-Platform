import type { SceneId } from "./types";

/**
 * Photography resolution, in order of preference:
 *
 *   1. `public/evidence/<file>` — your own photographs. Best quality, and the
 *      only option that shows actual Nigerian projects. Drop files in with
 *      these exact names; no code changes needed anywhere.
 *   2. A keyword photo CDN — real photographs, keyless, deterministic per
 *      `lock` value so a given card always shows the same picture. Makes the
 *      app look right the moment you run it, before you source anything.
 *   3. A designed plate naming the shot that belongs there.
 *
 * `subject` is the art-direction brief. Landscape, shot low or oblique rather
 * than straight-on — angled shots read as documentary, straight-on reads as
 * stock.
 */
export interface PhotoSource {
  file: string;
  keywords: string;
  lock: number;
  subject: string;
}

export const PHOTO_SOURCES: Record<SceneId, PhotoSource> = {
  earthworks: {
    file: "earthworks.jpg",
    keywords: "nigeria,construction",
    lock: 4102,
    subject: "Excavator cutting a road formation, red laterite spoil, low angle",
  },
  subgrade: {
    file: "subgrade.jpg",
    keywords: "nigeria,road",
    lock: 4218,
    subject: "Graded earth formation running to the horizon, tyre tracks in the surface",
  },
  basecourse: {
    file: "basecourse.jpg",
    keywords: "nigeria,construction",
    lock: 4337,
    subject: "Vibratory roller compacting crushed stone base, oblique angle",
  },
  paving: {
    file: "paving.jpg",
    keywords: "nigeria,construction",
    lock: 2020,
    subject: "Asphalt paver laying binder course, steam rising, crew alongside",
  },
  wearing: {
    file: "wearing.jpg",
    keywords: "nigeria,road",
    lock: 4571,
    subject: "Finished carriageway curving away under raking light",
  },
  marking: {
    file: "marking.jpg",
    keywords: "nigeria,road",
    lock: 4690,
    subject: "Fresh white centre-line on new asphalt, close perspective down the road",
  },
  drainage: {
    file: "drainage.jpg",
    keywords: "nigeria,construction",
    lock: 4812,
    subject: "Reinforced concrete box culvert under construction, formwork visible",
  },
  rebar: {
    file: "rebar.jpg",
    keywords: "nigeria,rebar",
    lock: 4933,
    subject: "Dense reinforcement cage before pour, shot down the length of the mat",
  },
  pier: {
    file: "pier.jpg",
    keywords: "nigeria,bridge",
    lock: 5051,
    subject: "Bridge pier columns from below, upward angle against open sky",
  },
  deck: {
    file: "deck.jpg",
    keywords: "nigeria,bridge",
    lock: 5174,
    subject: "Bridge deck under construction, girders receding in perspective",
  },
  ballast: {
    file: "ballast.jpg",
    keywords: "nigeria,railway",
    lock: 5296,
    subject: "Railway ballast bed and sleepers before rail laying",
  },
  track: {
    file: "track.jpg",
    keywords: "nigeria,railway",
    lock: 5418,
    subject: "Track converging to a vanishing point, camera low between the rails",
  },
  signage: {
    file: "signage.jpg",
    keywords: "nigeria,construction",
    lock: 5533,
    subject: "Newly erected gantry or directional sign, upward angle",
  },
  delivery: {
    file: "delivery.jpg",
    keywords: "nigeria,construction",
    lock: 5657,
    subject: "Stacked cement bags, culvert rings or steel on a laydown area",
  },
  defect: {
    file: "defect.jpg",
    keywords: "nigeria,pothole",
    lock: 5772,
    subject: "Cracked or potholed carriageway, close low angle, cone nearby",
  },
  survey: {
    file: "survey.jpg",
    keywords: "nigeria,surveyor",
    lock: 5896,
    subject: "Surveyor with total station on a corridor, figure in hi-vis",
  },
};

export function localUrl(scene: SceneId): string {
  return `/evidence/${PHOTO_SOURCES[scene].file}`;
}

/**
 * LoremFlickr serves real Creative Commons photographs by keyword with no API
 * key. `lock` pins the result so cards don't reshuffle between renders.
 * Repoint this single function at your own bucket when you have one.
 */
export function remoteUrl(scene: SceneId, w = 1600, h = 1067): string {
  const s = PHOTO_SOURCES[scene];
  return `https://loremflickr.com/${w}/${h}/${s.keywords}?lock=${s.lock}`;
}

export const PHOTO_MANIFEST = (Object.keys(PHOTO_SOURCES) as SceneId[]).map((scene) => ({
  scene,
  ...PHOTO_SOURCES[scene],
}));
