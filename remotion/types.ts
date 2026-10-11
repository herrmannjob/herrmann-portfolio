import type { StudioData } from "../src/lib/summary";

/** One narration track as written by scripts/studio/tts.py into public/studio/manifest.json. */
export type Track = {
  hash: string;
  src: string;
  duration: number;
  scenes: Array<{ kind: string; start: number; end: number }>;
  sentences: Array<{ scene: number; text: string; start: number; end: number }>;
};

export type PresentationProps = {
  data: StudioData;
  track: Track;
  /** Public URL printed at the end of the video */
  siteUrl: string;
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const C = {
  ink: "#07100C",
  night: "#0B1611",
  panel: "#101D17",
  forest: "#0A7C15",
  leaf: "#A8D965",
  mint: "#58AE8D",
  mist: "#E8FEF6",
  signal: "#EACE43",
  moss: "#1F3A2A",
};
