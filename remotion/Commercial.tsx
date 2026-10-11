import React, { useState } from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { BeatId, CommercialData } from "../src/lib/commercial";
import { F, useLocaleFonts } from "./fonts";
import { C, FPS } from "./types";

/* ------------------------------------------------------------------ */
/* Types & helpers                                                     */
/* ------------------------------------------------------------------ */

export type CommercialTiming = {
  bpm: number;
  bar: number;
  duration: number;
  voice: string;
  music: string;
  beats: Array<{ id: BeatId; bar: number; endBar: number; start: number; end: number; voiceStart: number; voiceEnd: number }>;
  sentences: Array<{ beat: number; text: string; start: number; end: number }>;
};

export type CommercialProps = { data: CommercialData; timing: CommercialTiming; siteUrl: string; captions?: boolean };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sec = (s: number) => Math.round(s * FPS);
const OVERLAP = 10;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const Ctx = React.createContext<{ beatLen: number; energy: (frame: number) => number }>({ beatLen: 18, energy: () => 0 });

/** Spring that starts `delay` frames into the current Sequence. */
function useIn(delay = 0, damping = 16, stiffness = 140) {
  const frame = useCurrentFrame();
  return spring({ frame: frame - delay, fps: FPS, config: { damping, stiffness, mass: 0.8 } });
}

/** 0→1 decay on every beat — drives pulses that hit with the kick. */
function usePulse(absoluteFrame: number) {
  const { beatLen, energy } = React.useContext(Ctx);
  const local = (absoluteFrame % beatLen) / beatLen;
  return Math.exp(-local * 5) * energy(absoluteFrame);
}

function SafeImg({ src, style }: { src?: string; style?: React.CSSProperties }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  const url = src.startsWith("/") ? staticFile(src.slice(1)) : src;
  return <Img src={url} referrerPolicy="no-referrer" onError={() => setFailed(true)} maxRetries={2} style={style} />;
}

function tokens(text: string, cjk: boolean): string[] {
  return cjk ? (text.match(/[　-鿿＀-￯]|[^\s　-鿿＀-￯]+/g) ?? [text]) : text.split(/\s+/);
}

function fit(text: string, width: number, max: number, ratio = 0.52) {
  const len = Array.from(text).reduce((n, ch) => n + (/[　-鿿]/.test(ch) ? 1.9 : 1), 0) || 1;
  return Math.min(max, width / (len * ratio));
}

function parseMetric(v: string) {
  const m = v.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/);
  return m ? { pre: m[1]!, n: Number(m[2]!.replace(",", ".")), post: m[3]! } : null;
}

function Count({ value, from, dur = 36, style }: { value: string; from: number; dur?: number; style: React.CSSProperties }) {
  const frame = useCurrentFrame();
  const p = parseMetric(value);
  if (!p) return <span style={style}>{value}</span>;
  const k = interpolate(frame, [from, from + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.exp) });
  return (
    <span style={{ ...style, fontVariantNumeric: "tabular-nums" }}>
      {p.pre}
      {Math.round(p.n * k)}
      {p.post}
    </span>
  );
}

/** Words slam in one by one (kinetic typography). */
function Slam({ text, cjk, from, every, style, accentLast = true }: { text: string; cjk: boolean; from: number; every: number; style: React.CSSProperties; accentLast?: boolean }) {
  const frame = useCurrentFrame();
  const words = tokens(text, cjk);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: cjk ? 0 : "0 0.28em", ...style }}>
      {words.map((w, i) => {
        const s = spring({ frame: frame - from - i * every, fps: FPS, config: { damping: 13, stiffness: 180 } });
        const last = accentLast && i === words.length - 1;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: interpolate(s, [0, 0.3], [0, 1], clamp),
              transform: `scale(${1.7 - 0.7 * s}) translateY(${(1 - s) * 30}px)`,
              filter: `blur(${(1 - s) * 10}px)`,
              color: last ? C.leaf : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Backdrop                                                            */
/* ------------------------------------------------------------------ */

function Backdrop() {
  const frame = useCurrentFrame();
  const pulse = usePulse(frame);
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1100px 800px at ${70 + Math.sin(t / 3) * 10}% ${20 + Math.cos(t / 4) * 10}%, ${C.forest}${Math.round(60 + pulse * 70).toString(16)}, transparent 70%), radial-gradient(900px 700px at ${15 + Math.cos(t / 5) * 8}% 95%, ${C.leaf}22, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(to right, rgba(232,254,246,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(232,254,246,0.04) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          transform: `perspective(900px) rotateX(58deg) translateY(${(t * 40) % 96}px) scale(2.2)`,
          transformOrigin: "50% 100%",
          maskImage: "linear-gradient(to top, black 10%, transparent 75%)",
          opacity: 0.9,
        }}
      />
      <Particles />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6))" }} />
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.06, mixBlendMode: "overlay" }}>
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 10} />
        </filter>
        <rect width="100%" height="100%" filter="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
}

function Particles() {
  const frame = useCurrentFrame();
  const dots = React.useMemo(
    () => Array.from({ length: 46 }, (_, i) => ({ x: (i * 397) % 1920, y: (i * 613) % 1080, r: 1 + ((i * 7) % 3), s: 0.2 + ((i * 13) % 10) / 20 })),
    [],
  );
  return (
    <AbsoluteFill>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: d.x,
            top: (d.y - frame * d.s + 1080 * 4) % 1080,
            width: d.r * 2,
            height: d.r * 2,
            borderRadius: d.r,
            background: i % 5 ? "rgba(232,254,246,0.25)" : C.leaf,
            opacity: 0.35 + 0.35 * Math.sin(frame / 20 + i),
          }}
        />
      ))}
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */

type SceneProps = { d: CommercialData; dur: number; voiceAt: number; cjk: boolean };

function Hook({ d, dur, voiceAt, cjk }: SceneProps) {
  const frame = useCurrentFrame();
  const logo = useIn(4, 12);
  const open = interpolate(frame, [voiceAt - 14, voiceAt + 6], [0, 1], { ...clamp, easing: ease });
  const rows = [0, 1, 2].map((r) => d.wall.filter((_, i) => i % 3 === r));
  return (
    <AbsoluteFill>
      {/* wall of work, tilted and drifting */}
      <AbsoluteFill style={{ opacity: 0.55 * open, transform: "perspective(1800px) rotateX(18deg) rotateZ(-8deg) scale(1.35)", transformOrigin: "50% 50%" }}>
        {rows.map((row, r) => (
          <div key={r} style={{ position: "absolute", left: 0, top: 120 + r * 300, display: "flex", gap: 28, transform: `translateX(${(r % 2 ? -1 : 1) * frame * 1.6 - 400}px)` }}>
            {[...row, ...row].map((src, i) => (
              <div key={i} style={{ width: 460, height: 270, borderRadius: 18, overflow: "hidden", background: C.panel, border: "1px solid rgba(232,254,246,0.12)", flexShrink: 0 }}>
                <SafeImg src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, ${C.ink}ee 30%, ${C.ink}99 70%)`, opacity: open }} />
      {/* opening sting */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - open }}>
        <div style={{ width: interpolate(frame, [0, 30], [0, 900], { ...clamp, easing: ease }), height: 2, background: C.leaf, boxShadow: `0 0 30px ${C.leaf}` }} />
        <div style={{ position: "absolute", width: 150, height: 150, borderRadius: 30, background: C.leaf, display: "grid", placeItems: "center", fontFamily: F.display, fontWeight: 900, fontSize: 110, color: C.ink, transform: `scale(${logo})`, boxShadow: `0 0 ${80 * logo}px ${C.leaf}88` }}>H</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 140px" }}>
        <Slam text={d.copy.hook} cjk={cjk} from={voiceAt} every={cjk ? 3 : 7} style={{ fontFamily: F.display, fontWeight: 900, fontSize: fit(d.copy.hook, 2600, 180), lineHeight: 0.95, textTransform: "uppercase", color: C.mist, textAlign: "center" }} />
      </AbsoluteFill>
      <ExitFlash dur={dur} />
    </AbsoluteFill>
  );
}

function Origin({ d, dur, voiceAt }: SceneProps) {
  const frame = useCurrentFrame();
  const year = Math.round(interpolate(frame, [voiceAt, voiceAt + 26], [1990, 2014], { ...clamp, easing: Easing.out(Easing.exp) }));
  const toToday = interpolate(frame, [dur * 0.62, dur * 0.62 + 20], [0, 1], { ...clamp, easing: ease });
  const pin = useIn(voiceAt + 20, 12);
  const code = ["$ git init", "$ npm run build", "✓ compiled successfully", "$ git push origin main", "✓ deployed to production"];
  return (
    <AbsoluteFill style={{ padding: "0 120px" }}>
      <div style={{ position: "absolute", left: 120, top: 210, fontFamily: F.display, fontWeight: 900, fontSize: 420, lineHeight: 0.85, color: C.mist, letterSpacing: -8 }}>
        {year}
        <span style={{ display: "inline-block", fontSize: 220, color: C.leaf, margin: "0 30px", opacity: toToday, transform: `translateX(${(1 - toToday) * -60}px)` }}>→</span>
        <span style={{ fontSize: 220, color: C.leaf, opacity: toToday }}>{d.copy.today}</span>
      </div>
      <div style={{ position: "absolute", left: 130, top: 640, display: "flex", alignItems: "center", gap: 26, opacity: pin, transform: `translateY(${(1 - pin) * 30}px)` }}>
        <div style={{ position: "relative", width: 40, height: 40 }}>
          {[0, 1, 2].map((k) => {
            const r = ((frame + k * 20) % 60) / 60;
            return <div key={k} style={{ position: "absolute", inset: -40 * r, borderRadius: "50%", border: `2px solid ${C.leaf}`, opacity: 1 - r }} />;
          })}
          <div style={{ position: "absolute", inset: 8, borderRadius: "50%", background: C.leaf, boxShadow: `0 0 20px ${C.leaf}` }} />
        </div>
        <span style={{ fontFamily: F.mono, fontSize: 44, color: C.mist }}>{d.location}</span>
      </div>
      <div style={{ position: "absolute", right: 120, top: 640, width: 620, padding: "26px 30px", borderRadius: 18, background: "rgba(16,29,23,0.88)", border: "1px solid rgba(232,254,246,0.12)", fontFamily: F.mono, fontSize: 26, lineHeight: 1.7 }}>
        {code.map((l, i) => {
          const at = voiceAt + 26 + i * 16;
          const chars = Math.floor(interpolate(frame, [at, at + 14], [0, l.length], clamp));
          return (
            <div key={i} style={{ color: l.startsWith("✓") ? C.leaf : "rgba(232,254,246,0.85)", minHeight: 44 }}>
              {l.slice(0, chars)}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function Scale({ d, dur, voiceAt }: SceneProps) {
  const frame = useCurrentFrame();
  const halves = d.proof.map((p, i) => {
    const at = i === 0 ? voiceAt : voiceAt + Math.round(dur * 0.32);
    return { ...p, at };
  });
  return (
    <AbsoluteFill style={{ flexDirection: "row" }}>
      {halves.map((p, i) => {
        const s = spring({ frame: frame - p.at + 6, fps: FPS, config: { damping: 18, stiffness: 120 } });
        return (
          <div key={i} style={{ position: "relative", flex: 1, overflow: "hidden", clipPath: `inset(0 ${i === 0 ? (1 - s) * 100 : 0}% 0 ${i === 1 ? (1 - s) * 100 : 0}%)` }}>
            <SafeImg src={p.cover} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.6 - (frame / dur) * 0.2})`, filter: "blur(38px) saturate(1.3)", opacity: 0.55 }} />
            <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.ink}cc 0%, ${C.ink}66 40%, ${C.ink}f2 100%)` }} />
            <div style={{ position: "absolute", left: 80, right: 80, bottom: 190 }}>
              {p.logo && (
                <div style={{ display: "inline-grid", placeItems: "center", height: 84, padding: "0 22px", borderRadius: 16, background: "rgba(232,254,246,0.94)" }}>
                  <SafeImg src={p.logo} style={{ height: 52, maxWidth: 260, objectFit: "contain" }} />
                </div>
              )}
              <Count value={p.value} from={p.at + 4} style={{ display: "block", marginTop: 20, fontFamily: F.display, fontWeight: 900, fontSize: 300, lineHeight: 0.9, color: C.leaf, textShadow: `0 0 60px ${C.leaf}55` }} />
              <div style={{ marginTop: 14, fontFamily: F.sans, fontWeight: 600, fontSize: 44, lineHeight: 1.2, color: C.mist, maxWidth: 760 }}>{p.label}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 6, marginLeft: -3, background: C.leaf, transform: `scaleY(${interpolate(frame, [voiceAt, voiceAt + 30], [0, 1], { ...clamp, easing: ease })})` }} />
    </AbsoluteFill>
  );
}

function Apps({ d, dur, voiceAt }: SceneProps) {
  const frame = useCurrentFrame();
  const title = useIn(voiceAt - 6);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: F.display, fontWeight: 900, fontSize: fit(d.copy.appsTitle, 1500, 140), textTransform: "uppercase", color: C.mist, opacity: title, transform: `translateY(${(1 - title) * 40}px)` }}>
        {d.copy.appsTitle}
      </div>
      <AbsoluteFill style={{ perspective: 1800 }}>
        {d.apps.map((a, i) => {
          const s = spring({ frame: frame - voiceAt - i * 8, fps: FPS, config: { damping: 15, stiffness: 110 } });
          const x = (i - 1) * 520;
          const rot = (i - 1) * -16 + Math.sin(frame / 40 + i) * 3;
          const shot = a.shots.length ? a.shots[Math.floor((frame / FPS / 1.6 + i) % a.shots.length)] : undefined;
          return (
            <div key={a.name} style={{ position: "absolute", left: 960 - 170 + x, top: 270, width: 340, transform: `translateY(${(1 - s) * 700}px) rotateY(${rot}deg) translateZ(${i === 1 ? 120 : 0}px)`, transformStyle: "preserve-3d" }}>
              <div style={{ height: 600, borderRadius: 48, padding: 12, background: "#0d0f0e", border: "2px solid rgba(232,254,246,0.25)", boxShadow: `0 60px 120px rgba(0,0,0,0.7), 0 0 80px ${C.forest}55` }}>
                <div style={{ width: "100%", height: "100%", borderRadius: 38, overflow: "hidden", background: C.panel }}>
                  <SafeImg src={shot} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                </div>
              </div>
              <div style={{ marginTop: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: F.sans, fontWeight: 700, fontSize: 30, color: C.mist }}>
                {a.icon && (
                  <span style={{ width: 52, height: 52, borderRadius: 13, overflow: "hidden", background: "#fff", flexShrink: 0 }}>
                    <SafeImg src={a.icon} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </span>
                )}
                {a.name}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <ExitFlash dur={dur} />
    </AbsoluteFill>
  );
}

function Range({ d, dur, voiceAt }: SceneProps) {
  const frame = useCurrentFrame();
  const title = useIn(voiceAt - 4);
  const ai = interpolate(frame, [dur * 0.6, dur * 0.6 + 18], [0, 1], { ...clamp, easing: ease });
  const items = d.tech;
  return (
    <AbsoluteFill>
      {items.map((w, i) => {
        const ring = i % 3;
        const n = items.filter((_, k) => k % 3 === ring).length;
        const idx = Math.floor(i / 3);
        const a = (idx / n) * Math.PI * 2 + frame / (240 + ring * 90) * (ring % 2 ? -1 : 1);
        const rx = 520 + ring * 230;
        const ry = 230 + ring * 95;
        const z = Math.sin(a);
        const s = spring({ frame: frame - voiceAt - i * 1.5, fps: FPS, config: { damping: 16 } });
        const isAI = /llm|rag|agentic|eval|fine-tun|prompt|claude|cursor/i.test(w);
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              left: 960 + Math.cos(a) * rx,
              top: 540 + z * ry,
              transform: `translate(-50%, -50%) scale(${(0.7 + 0.35 * (z + 1) / 2) * s})`,
              opacity: (0.35 + 0.65 * (z + 1) / 2) * s,
              padding: "12px 24px",
              borderRadius: 999,
              border: `1px solid ${isAI && ai > 0.5 ? C.leaf : "rgba(232,254,246,0.22)"}`,
              background: isAI && ai > 0.5 ? `${C.leaf}22` : "rgba(16,29,23,0.8)",
              fontFamily: F.mono,
              fontSize: 26,
              color: isAI && ai > 0.5 ? C.leaf : C.mist,
              whiteSpace: "nowrap",
              zIndex: Math.round(z * 10) + 10,
            }}
          >
            {w}
          </div>
        );
      })}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", zIndex: 30 }}>
        <div style={{ textAlign: "center", opacity: title, transform: `scale(${0.85 + 0.15 * title})` }}>
          <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: fit(d.copy.rangeTitle, 1300, 150), lineHeight: 0.95, textTransform: "uppercase", color: C.mist, textShadow: `0 0 40px ${C.ink}` }}>{d.copy.rangeTitle}</div>
          <div style={{ marginTop: 26, display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 30px", borderRadius: 999, background: C.leaf, color: C.ink, fontFamily: F.mono, fontWeight: 700, fontSize: 34, opacity: ai, transform: `scale(${0.6 + 0.4 * ai})`, boxShadow: `0 0 ${60 * ai}px ${C.leaf}aa` }}>
            AI · 2020 → LLMs · RAG · Agents
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function People({ d, dur, voiceAt, cjk }: SceneProps) {
  const frame = useCurrentFrame();
  const title = useIn(voiceAt - 6);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 120, fontFamily: F.mono, fontSize: 30, letterSpacing: 4, color: C.mint, textTransform: "uppercase", opacity: title }}>
        {d.copy.peopleTitle} · LinkedIn
      </div>
      {d.quotes.map((q, i) => {
        const at = voiceAt + i * Math.round((dur * 0.55) / Math.max(1, d.quotes.length));
        const s = spring({ frame: frame - at, fps: FPS, config: { damping: 16, stiffness: 120 } });
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div
            key={q.name}
            style={{
              position: "absolute",
              left: 120 + col * 860,
              top: 220 + row * 360 + col * 50,
              width: 800,
              height: 320,
              boxSizing: "border-box",
              overflow: "hidden",
              padding: "34px 40px",
              borderRadius: 24,
              background: "rgba(16,29,23,0.9)",
              border: `1px solid ${i === Math.min(d.quotes.length - 1, Math.floor(interpolate(frame, [voiceAt, voiceAt + dur * 0.55], [0, d.quotes.length], clamp))) ? `${C.leaf}88` : "rgba(232,254,246,0.12)"}`,
              boxShadow: "0 40px 80px rgba(0,0,0,0.45)",
              transform: `translateY(${(1 - s) * 120}px) rotate(${(col ? 1.5 : -1.5) * (1 - s * 0.6)}deg)`,
              opacity: s,
            }}
          >
            <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 90, lineHeight: 0.6, color: C.leaf }}>“</div>
            <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: q.text.length > 110 ? 30 : 34, lineHeight: 1.35, color: C.mist }}>{q.text}</div>
            <div style={{ marginTop: 18, fontFamily: F.mono, fontSize: 22, color: C.mint }}>— {q.name}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

function Value({ d, dur, voiceAt }: SceneProps) {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [voiceAt - 8, voiceAt + 12], [0, 1], { ...clamp, easing: ease });
  const second = interpolate(frame, [voiceAt + dur * 0.42, voiceAt + dur * 0.42 + 14], [0, 1], { ...clamp, easing: ease });
  const side = (i: 0 | 1, on: number) => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 110px", opacity: 0.25 + 0.75 * on, transform: `scale(${0.94 + 0.06 * on})` }}>
      <div style={{ fontFamily: F.mono, fontSize: 30, color: C.mint, letterSpacing: 3, textTransform: "uppercase" }}>{d.copy.rolesSub[i]}</div>
      <div style={{ marginTop: 10, fontFamily: F.display, fontWeight: 900, fontSize: fit(d.copy.roles[i], 760, 200), lineHeight: 0.9, textTransform: "uppercase", color: on > 0.5 ? (i ? C.leaf : C.mist) : C.mist }}>{d.copy.roles[i]}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ flexDirection: "row", clipPath: `inset(0 ${(1 - split) * 50}% 0 ${(1 - split) * 50}%)` }}>
      {side(0, 1 - second * 0.6)}
      <div style={{ width: 4, background: `linear-gradient(${C.ink}, ${C.leaf}, ${C.ink})`, transform: "skewX(-8deg)" }} />
      {side(1, second)}
    </AbsoluteFill>
  );
}

function Reveal({ d, dur, voiceAt }: SceneProps) {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 3, 16], [0, 1, 0], clamp);
  const photo = useIn(2, 18, 90);
  const ring = interpolate(frame, [0, 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const name = d.displayName.toUpperCase();
  const sweep = interpolate(frame, [6, 50], [-40, 140], clamp);
  const full = Math.floor(interpolate(frame, [voiceAt + 26, voiceAt + 26 + d.fullName.length * 1.3], [0, d.fullName.length], clamp));
  const role = useIn(voiceAt + 60);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 960, top: 540, width: 1600 * ring, height: 1600 * ring, marginLeft: -800 * ring, marginTop: -800 * ring, borderRadius: "50%", border: `3px solid ${C.leaf}`, opacity: 1 - ring }} />
      {d.photoSrc && (
        <div style={{ position: "absolute", right: 150, top: 150, width: 600, height: 760, borderRadius: 28, overflow: "hidden", transform: `scale(${0.9 + 0.1 * photo}) translateX(${(1 - photo) * 120}px)`, opacity: photo, boxShadow: `0 80px 200px -40px ${C.forest}` }}>
          <SafeImg src={d.photoSrc} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", transform: `scale(${1.12 - frame / dur * 0.08})` }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${sweep - 20}%, rgba(255,255,255,0.35) ${sweep}%, transparent ${sweep + 20}%)`, mixBlendMode: "overlay" }} />
          <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 2px ${C.leaf}66`, borderRadius: 28 }} />
        </div>
      )}
      <div style={{ position: "absolute", left: 120, top: 300 }}>
        <div style={{ display: "flex", fontFamily: F.display, fontWeight: 900, fontSize: fit(name, 1050, 300, 0.56), lineHeight: 0.85, color: C.leaf, letterSpacing: -4, textShadow: `0 0 80px ${C.leaf}55` }}>
          {Array.from(name).map((ch, i) => {
            const s = spring({ frame: frame - 4 - i * 2, fps: FPS, config: { damping: 10, stiffness: 200 } });
            return (
              <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - s) * 160}px) scale(${1.3 - 0.3 * s})`, opacity: s }}>
                {ch}
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: 30, fontFamily: F.mono, fontSize: 46, color: C.mist, minHeight: 60 }}>
          {d.fullName.slice(0, full)}
          {full < d.fullName.length && <span style={{ color: C.leaf }}>▍</span>}
        </div>
        <div style={{ marginTop: 24, display: "inline-block", padding: "14px 28px", borderRadius: 14, border: `2px solid ${C.leaf}`, fontFamily: F.sans, fontWeight: 700, fontSize: 44, color: C.leaf, opacity: role, transform: `translateY(${(1 - role) * 20}px)` }}>
          {d.role}
        </div>
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
}

function Cta({ d, voiceAt, cjk, siteUrl, endAt }: SceneProps & { siteUrl: string; endAt: number }) {
  const frame = useCurrentFrame();
  const end = interpolate(frame, [endAt, endAt + 14], [0, 1], { ...clamp, easing: ease });
  const url = siteUrl.replace(/^https?:\/\//, "");
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - end, transform: `scale(${1 - end * 0.06})` }}>
        <Slam text={d.copy.cta} cjk={cjk} from={voiceAt + 20} every={cjk ? 3 : 6} style={{ fontFamily: F.display, fontWeight: 900, fontSize: fit(d.copy.cta, 1700, 200), lineHeight: 0.95, textTransform: "uppercase", color: C.mist, maxWidth: 1700 }} />
        <div style={{ marginTop: 50, display: "flex", gap: 26, opacity: interpolate(frame, [voiceAt + 40, voiceAt + 56], [0, 1], clamp) }}>
          {[url, d.email].filter(Boolean).map((v) => (
            <div key={v} style={{ padding: "22px 34px", borderRadius: 16, background: C.leaf, color: C.ink, fontFamily: F.mono, fontWeight: 700, fontSize: 36 }}>
              {v}
            </div>
          ))}
        </div>
        {d.availability && (
          <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 14, fontFamily: F.mono, fontSize: 26, color: C.leaf, opacity: interpolate(frame, [voiceAt + 56, voiceAt + 70], [0, 1], clamp) }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: C.leaf, boxShadow: `0 0 ${12 + Math.sin(frame / 5) * 8}px ${C.leaf}` }} />
            {d.availability}
          </div>
        )}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 130, overflow: "hidden", opacity: 0.85 * (1 - end), maskImage: "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)" }}>
        <div style={{ display: "flex", gap: 40, transform: `translateX(${-frame * 2.4}px)` }}>
          {[...d.logos, ...d.logos, ...d.logos].map((l, i) => (
            <div key={i} style={{ height: 70, minWidth: 70, padding: "0 20px", borderRadius: 14, background: "rgba(232,254,246,0.92)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <SafeImg src={l} style={{ height: 40, maxWidth: 180, objectFit: "contain" }} />
            </div>
          ))}
        </div>
      </div>
      {/* End card */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: end }}>
        <div style={{ width: 130, height: 130, borderRadius: 28, background: C.leaf, display: "grid", placeItems: "center", fontFamily: F.display, fontWeight: 900, fontSize: 96, color: C.ink, boxShadow: `0 0 80px ${C.leaf}88` }}>H</div>
        <div style={{ marginTop: 30, fontFamily: F.display, fontWeight: 900, fontSize: 200, lineHeight: 0.9, color: C.leaf }}>{d.displayName.toUpperCase()}</div>
        <div style={{ marginTop: 16, fontFamily: F.mono, fontSize: 34, color: C.mist }}>{d.fullName} · {d.role}</div>
        <div style={{ marginTop: 14, fontFamily: F.mono, fontSize: 30, color: C.mint }}>{url}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function ExitFlash({ dur }: { dur: number }) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [dur - 6, dur - 2, dur + 4], [0, 0.18, 0], clamp);
  return <AbsoluteFill style={{ background: C.leaf, opacity: o, mixBlendMode: "screen" }} />;
}

/** Minimal captions, low on the frame, for viewers watching without sound. */
function Captions({ timing, cjk }: { timing: CommercialTiming; cjk: boolean }) {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = timing.sentences.find((x) => t >= x.start - 0.05 && t <= x.end + 0.2);
  if (!s) return null;
  const words = tokens(s.text, cjk);
  const per = cjk ? 24 : 12;
  const chunks = Math.max(1, Math.ceil(words.length / per));
  const size = Math.ceil(words.length / chunks);
  const prog = interpolate(t, [s.start, s.end], [0, words.length], clamp);
  const chunk = Math.min(chunks - 1, Math.floor(prog / size));
  const shown = words.slice(chunk * size, (chunk + 1) * size);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: F.sans, fontWeight: 600, fontSize: 30, color: "rgba(232,254,246,0.92)", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
      {cjk ? shown.join("") : shown.join(" ")}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */

export const Commercial: React.FC<CommercialProps> = ({ data, timing, siteUrl, captions = true }) => {
  useLocaleFonts(data.locale);
  const { durationInFrames } = useVideoConfig();
  const cjk = data.locale === "zh";
  const beatLen = Math.round((60 / timing.bpm) * FPS);
  const at = (id: BeatId) => timing.beats.find((b) => b.id === id)!;

  // Energy follows the score: quiet intro, drums from "scale", break before the reveal.
  const energy = (f: number) => {
    const t = f / FPS;
    if (t < at("scale").start) return 0.15;
    if (t < at("range").start) return 0.6;
    if (t < at("people").start) return 1;
    if (t < at("reveal").start) return 0.25;
    return 1;
  };

  const speaking = (t: number) => timing.sentences.some((s) => t >= s.start - 0.2 && t <= s.end + 0.15);
  const musicVolume = (f: number) => {
    const t = f / FPS;
    const base = speaking(t) ? 0.42 : 0.85;
    const fade = interpolate(f, [durationInFrames - 50, durationInFrames - 2], [1, 0], clamp);
    return base * fade;
  };

  const scenes: Array<{ id: BeatId; el: (p: SceneProps) => React.ReactNode }> = [
    { id: "hook", el: (p) => <Hook {...p} /> },
    { id: "origin", el: (p) => <Origin {...p} /> },
    { id: "scale", el: (p) => <Scale {...p} /> },
    { id: "apps", el: (p) => <Apps {...p} /> },
    { id: "range", el: (p) => <Range {...p} /> },
    { id: "people", el: (p) => <People {...p} /> },
    { id: "value", el: (p) => <Value {...p} /> },
    { id: "reveal", el: (p) => <Reveal {...p} /> },
    { id: "cta", el: (p) => <Cta {...p} siteUrl={siteUrl} endAt={sec(at("cta").voiceEnd - at("cta").start) + 24} /> },
  ];

  return (
    <Ctx.Provider value={{ beatLen, energy }}>
      <AbsoluteFill style={{ backgroundColor: C.ink }}>
        <Backdrop />
        {scenes.map(({ id, el }, i) => {
          const b = at(id);
          const from = i === 0 ? 0 : sec(b.start);
          const to = i === scenes.length - 1 ? durationInFrames : sec(timing.beats[i + 1]!.start) + OVERLAP;
          const dur = to - from;
          const voiceAt = sec(b.voiceStart) - from;
          return (
            <Sequence key={id} from={from} durationInFrames={dur} name={id}>
              <Transition dur={dur} last={i === scenes.length - 1}>
                {el({ d: data, dur, voiceAt, cjk })}
              </Transition>
            </Sequence>
          );
        })}
        {captions && <Captions timing={timing} cjk={cjk} />}
        <Audio src={staticFile(timing.voice.replace(/^\//, ""))} />
        <Audio src={staticFile(timing.music.replace(/^\//, ""))} volume={musicVolume} />
      </AbsoluteFill>
    </Ctx.Provider>
  );
};

/** Zoom-through transition: scenes punch in and push out on the downbeat. */
function Transition({ dur, last, children }: { dur: number; last: boolean; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, OVERLAP], [0, 1], { ...clamp, easing: ease });
  const exit = last ? 0 : interpolate(frame, [dur - OVERLAP, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: Math.min(enter, 1 - exit), transform: `scale(${(0.92 + 0.08 * enter) * (1 + exit * 0.12)})`, filter: `blur(${(1 - enter) * 8 + exit * 10}px)` }}>
      {children}
    </AbsoluteFill>
  );
}
