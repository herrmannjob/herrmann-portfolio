import React from "react";
import { Composition } from "remotion";
import { Presentation } from "./Presentation";
import { FPS, HEIGHT, WIDTH, type PresentationProps } from "./types";

// Props come from scripts/studio/render.ts (script.json + manifest.json).
const placeholder = {
  data: {
    locale: "en",
    displayName: "Herrmann",
    fullName: "Gabriel Herrmann Grecchi",
    headline: "",
    roles: [],
    intro: "",
    bio: [],
    location: "",
    email: "",
    availability: "",
    stats: [],
    skills: [],
    featured: [],
    others: [],
    recommendations: [],
  },
  track: { hash: "", src: "/studio/en/video.mp3", duration: 5, scenes: [{ kind: "intro", start: 0, end: 5 }], sentences: [] },
  siteUrl: "https://herrmann-portfolio.vercel.app",
} satisfies PresentationProps;

export const Root: React.FC = () => (
  <Composition
    id="Presentation"
    component={Presentation}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    durationInFrames={FPS * 5}
    defaultProps={placeholder as PresentationProps}
    calculateMetadata={({ props }) => ({ durationInFrames: Math.ceil((props.track.duration + 1.2) * FPS) })}
  />
);
