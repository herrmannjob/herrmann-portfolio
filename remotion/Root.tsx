import React from "react";
import { Composition } from "remotion";
import { Commercial, type CommercialProps } from "./Commercial";
import { FPS, HEIGHT, WIDTH } from "./types";

// Real props come from scripts/studio/render.ts (script.json + manifest.json).
const placeholder = {
  data: {
    locale: "en",
    copy: { hook: "", appsTitle: "", rangeTitle: "", peopleTitle: "", roles: ["", ""], rolesSub: ["", ""], cta: "", today: "", proof: ["", ""] },
    lines: [],
    displayName: "Herrmann",
    fullName: "Gabriel Herrmann Grecchi",
    role: "",
    location: "",
    email: "",
    availability: "",
    proof: [],
    apps: [],
    wall: [],
    tech: [],
    quotes: [],
    logos: [],
  },
  timing: { bpm: 100, bar: 2.4, duration: 5, voice: "/studio/en/commercial-voice.mp3", music: "/studio/en/commercial-music.mp3", beats: [], sentences: [] },
  siteUrl: "https://herrmann-portfolio.vercel.app",
} satisfies CommercialProps;

export const Root: React.FC = () => (
  <Composition
    id="Commercial"
    component={Commercial}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    durationInFrames={FPS * 5}
    defaultProps={placeholder as CommercialProps}
    calculateMetadata={({ props }) => ({ durationInFrames: Math.ceil(props.timing.duration * FPS) })}
  />
);
