import type { Locale } from "./i18n/config";
import { buildScenes, narrationHash, type StudioData, type SummaryLength } from "./summary";
import manifest from "../../public/studio/manifest.json";

/** A pre-rendered summary narration. */
export type MediaTrack = {
  hash: string;
  src: string;
  duration: number;
  scenes: Array<{ kind: string; start: number; end: number }>;
  sentences: Array<{ scene: number; text: string; start: number; end: number }>;
};

/** The Remotion commercial for one locale (scripts/studio/render.ts). */
export type CommercialMedia = {
  video: string;
  poster?: string;
  duration: number;
  sentences: Array<{ text: string; start: number; end: number }>;
};

export type StudioMedia = Partial<Record<SummaryLength, MediaTrack>> & { video?: CommercialMedia };

const m = manifest as { tracks?: Record<string, Record<string, MediaTrack>>; commercial?: Record<string, Partial<CommercialMedia>> };
const tracks = m.tracks ?? {};

/**
 * Pre-rendered media for this locale — only the tracks whose narration still
 * matches the live content. If the admin edits a text, that track is dropped
 * and the site falls back to synthesizing speech in the browser.
 */
export function studioMediaFor(data: StudioData, locale: Locale): StudioMedia {
  const out: StudioMedia = {};
  for (const cut of ["short", "medium", "full"] as const) {
    const t = tracks[locale]?.[cut];
    if (t && t.hash === narrationHash(buildScenes(data, cut))) out[cut] = t;
  }
  const c = m.commercial?.[locale];
  if (c?.video && c.sentences && c.duration) {
    out.video = { video: c.video, poster: c.poster, duration: c.duration, sentences: c.sentences.map(({ text, start, end }) => ({ text, start, end })) };
  }
  return out;
}
