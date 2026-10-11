import type { Locale } from "./i18n/config";
import { buildScenes, narrationHash, type ScriptCut, type StudioData } from "./summary";
import manifest from "../../public/studio/manifest.json";

/** A pre-rendered narration (and, for the "video" cut, the Remotion MP4). */
export type MediaTrack = {
  hash: string;
  src: string;
  duration: number;
  scenes: Array<{ kind: string; start: number; end: number }>;
  sentences: Array<{ scene: number; text: string; start: number; end: number }>;
  video?: string;
  poster?: string;
};

export type StudioMedia = Partial<Record<ScriptCut, MediaTrack>>;

const tracks = (manifest as { tracks?: Record<string, Record<string, MediaTrack>> }).tracks ?? {};

/**
 * Pre-rendered media for this locale — only the tracks whose narration still
 * matches the live content. If the admin edits a text, that track is dropped
 * and the site falls back to synthesizing speech in the browser.
 */
export function studioMediaFor(data: StudioData, locale: Locale): StudioMedia {
  const out: StudioMedia = {};
  for (const cut of ["short", "medium", "full", "video"] as const) {
    const t = tracks[locale]?.[cut];
    if (t && t.hash === narrationHash(buildScenes(data, cut))) out[cut] = t;
  }
  return out;
}
