import React, { useMemo, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { buildScenes, type Scene, type StudioWork } from "../src/lib/summary";
import { F, useLocaleFonts } from "./fonts";
import { C, FPS, type PresentationProps } from "./types";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const sec = (s: number) => Math.round(s * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OVERLAP = 14; // frames of cross-fade between scenes

function useEnter(delay = 0, damping = 18) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.7, stiffness: 120 } });
}

/** Remote images: never let a blocked hotlink break the render. */
function SafeImg({ src, style }: { src?: string; style?: React.CSSProperties }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  const url = src.startsWith("/") ? staticFile(src.slice(1)) : src;
  return <Img src={url} referrerPolicy="no-referrer" onError={() => setFailed(true)} maxRetries={2} style={style} />;
}

/** Chinese text: one token per character, but Latin words (Angular, C#/.NET) stay whole. */
function tokensCJK(text: string): string[] {
  return text.match(/[　-鿿＀-￯]|[^\s　-鿿＀-￯]+|\s+/g) ?? [text];
}

function parseMetric(v: string) {
  const m = v.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/);
  return m ? { pre: m[1]!, n: Number(m[2]!.replace(",", ".")), post: m[3]! } : null;
}

function CountUp({ value, start, style }: { value: string; start: number; style: React.CSSProperties }) {
  const frame = useCurrentFrame();
  const p = parseMetric(value);
  if (!p) return <span style={style}>{value}</span>;
  const k = interpolate(frame, [start, start + 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const n = Number.isInteger(p.n) ? Math.round(p.n * k) : (p.n * k).toFixed(1);
  return (
    <span style={{ ...style, fontVariantNumeric: "tabular-nums" }}>
      {p.pre}
      {n}
      {p.post}
    </span>
  );
}

/** Word-by-word reveal over a window of frames. */
function Reveal({ text, from, to, style, lang }: { text: string; from: number; to: number; style: React.CSSProperties; lang: string }) {
  const frame = useCurrentFrame();
  const cjk = lang === "zh";
  const parts = cjk ? tokensCJK(text) : text.split(/(\s+)/);
  const words = parts.filter((p) => p.trim()).length || 1;
  let i = 0;
  return (
    <p style={style}>
      {parts.map((w, k) => {
        if (!w.trim()) return w;
        const at = from + ((to - from) * i++) / words;
        const o = interpolate(frame, [at, at + 8], [0, 1], clamp);
        return (
          <span key={k} style={{ opacity: 0.12 + 0.88 * o, display: "inline-block", transform: `translateY(${(1 - o) * 10}px)` }}>
            {w}
          </span>
        );
      })}
    </p>
  );
}

function fitFont(text: string, maxWidth: number, max: number, ratio = 0.47) {
  const len = Math.max(1, Array.from(text).reduce((n, ch) => n + (/[　-鿿]/.test(ch) ? 2 : 1), 0));
  return Math.min(max, maxWidth / (len * ratio));
}

/* ------------------------------------------------------------------ */
/* Backdrop + chrome                                                   */
/* ------------------------------------------------------------------ */

function Backdrop({ accent }: { accent: string }) {
  const frame = useCurrentFrame();
  const drift = (frame / FPS) * 6;
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(232,254,246,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(232,254,246,0.045) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: `${drift}px ${drift * 0.6}px`,
          maskImage: "radial-gradient(ellipse at 40% 45%, black 25%, transparent 80%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 700px at ${78 + Math.sin(frame / 90) * 4}% ${-6 + Math.cos(frame / 120) * 4}%, ${accent}40, transparent 70%), radial-gradient(800px 600px at 0% 105%, ${C.forest}55, transparent 70%)`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55))" }} />
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
}

function Chrome({ kicker, index, total, progress }: { kicker: string; index: number; total: number; progress: number }) {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 96, top: 64, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: C.leaf, display: "grid", placeItems: "center", fontFamily: F.display, fontWeight: 900, fontSize: 36, color: C.ink }}>H</div>
        <span style={{ fontFamily: F.mono, fontSize: 22, color: "rgba(232,254,246,0.65)" }}>~/herrmann</span>
      </div>
      <div style={{ position: "absolute", right: 96, top: 80, fontFamily: F.mono, fontSize: 20, letterSpacing: 3, color: C.mint, textTransform: "uppercase", maxWidth: 900, textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {kicker}
      </div>
      <div style={{ position: "absolute", left: 96, right: 96, bottom: 40, display: "flex", gap: 8 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(232,254,246,0.12)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(i < index ? 1 : i === index ? progress : 0) * 100}%`, background: C.leaf }} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

/** Live captions with a soft word-progress highlight and a voice meter. */
function Captions({ props, audioSrc }: { props: PresentationProps; audioSrc: string }) {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = props.track.sentences.find((x) => t >= x.start - 0.05 && t <= x.end + 0.25);
  const audio = useAudioData(audioSrc);
  if (!s) return null;
  const cjk = props.data.locale === "zh";
  const all = cjk ? tokensCJK(s.text) : s.text.split(/\s+/);
  const per = cjk ? 26 : 13; // ≈ two lines at 32px
  const chunks = Math.max(1, Math.ceil(all.length / per));
  const progress = interpolate(t, [s.start, s.end], [0, all.length], clamp);
  const chunk = Math.min(chunks - 1, Math.floor(progress / Math.ceil(all.length / chunks)));
  const size = Math.ceil(all.length / chunks);
  const words = all.slice(chunk * size, (chunk + 1) * size);
  const parts = cjk ? words : words.flatMap((w, k) => (k ? [" ", w] : [w]));
  const spoken = progress - chunk * size;
  const appear = interpolate(t, [s.start - 0.05, s.start + 0.2], [0, 1], clamp);
  let i = 0;
  const bars = audio ? visualizeAudio({ fps: FPS, frame, audioData: audio, numberOfSamples: 16, smoothing: true }) : [];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 74, display: "flex", justifyContent: "center", opacity: appear }}>
      <div style={{ maxWidth: 1560, display: "flex", alignItems: "center", gap: 26, padding: "16px 30px", borderRadius: 16, background: "rgba(7,16,12,0.78)", border: "1px solid rgba(232,254,246,0.1)", backdropFilter: "blur(8px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, height: 44 }}>
          {bars.slice(0, 7).map((v, k) => (
            <div key={k} style={{ width: 5, borderRadius: 3, background: C.leaf, height: 8 + Math.min(1, v * 6) * 36, opacity: 0.85 }} />
          ))}
        </div>
        <p style={{ margin: 0, fontFamily: F.sans, fontWeight: 500, fontSize: 32, lineHeight: 1.3, color: "rgba(232,254,246,0.5)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {parts.map((w, k) => {
            if (!w.trim()) return w;
            const on = i++ < spoken;
            return (
              <span key={k} style={{ color: on ? C.mist : undefined, transition: "none" }}>
                {w}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */

function IntroScene({ scene, data, dur }: { scene: Extract<Scene, { kind: "intro" }>; data: PresentationProps["data"]; dur: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const name = scene.title.toUpperCase();
  const photoIn = useEnter(6, 20);
  const typed = Math.floor(interpolate(frame, [30, 30 + scene.sub.length * 1.6], [0, scene.sub.length], clamp));
  const sub = useEnter(48);
  const tilt = interpolate(frame, [0, dur], [-4, 3]);
  return (
    <AbsoluteFill>
      {data.photoSrc && (
        <div
          style={{
            position: "absolute",
            right: 140,
            top: 170,
            width: 560,
            height: 700,
            borderRadius: 22,
            overflow: "hidden",
            border: "1px solid rgba(232,254,246,0.15)",
            boxShadow: `0 60px 160px -40px ${C.forest}cc`,
            transform: `perspective(1600px) rotateY(${tilt}deg) translateY(${(1 - photoIn) * 80}px) scale(${0.92 + photoIn * 0.08})`,
            opacity: photoIn,
          }}
        >
          <div style={{ height: 46, background: C.panel, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", fontFamily: F.mono, fontSize: 17, color: "rgba(232,254,246,0.6)" }}>
            <span style={{ width: 13, height: 13, borderRadius: 7, background: "#ff5f57" }} />
            <span style={{ width: 13, height: 13, borderRadius: 7, background: "#febc2e" }} />
            <span style={{ width: 13, height: 13, borderRadius: 7, background: "#28c840" }} />
            <span style={{ marginLeft: 10 }}>~/portrait/herrmann.jpg</span>
          </div>
          <SafeImg src={data.photoSrc} style={{ width: "100%", height: 654, objectFit: "cover", objectPosition: "50% 20%", transform: `scale(${1.08 - frame / dur / 14})` }} />
        </div>
      )}
      <div style={{ position: "absolute", left: 96, top: 250, width: 1080 }}>
        <div style={{ fontFamily: F.mono, fontSize: 28, color: "rgba(232,254,246,0.55)" }}>$ whoami</div>
        <div style={{ display: "flex", marginTop: 6, fontFamily: F.display, fontWeight: 900, fontSize: fitFont(name, 980, 250, 0.56), lineHeight: 0.9, color: C.leaf, letterSpacing: -2 }}>
          {Array.from(name).map((ch, i) => {
            const s = spring({ frame: frame - 8 - i * 2.5, fps, config: { damping: 14, stiffness: 140 } });
            return (
              <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - s) * 120}%)`, opacity: s }}>
                {ch}
              </span>
            );
          })}
          <span style={{ width: 22, marginLeft: 10, background: C.signal, opacity: Math.floor(frame / 16) % 2 ? 0 : 1, transform: "scaleY(0.72)" }} />
        </div>
        <div style={{ marginTop: 26, fontFamily: F.mono, fontSize: 34, color: C.mist }}>
          {scene.sub.slice(0, typed)}
          <span style={{ opacity: typed < scene.sub.length ? 1 : 0, color: C.leaf }}>▍</span>
        </div>
        <div style={{ marginTop: 34, fontFamily: F.sans, fontWeight: 600, fontSize: 42, lineHeight: 1.25, color: "rgba(232,254,246,0.85)", opacity: sub, transform: `translateY(${(1 - sub) * 20}px)` }}>
          {scene.kicker}
        </div>
        <div style={{ marginTop: 26, display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 999, border: `1px solid ${C.leaf}66`, fontFamily: F.mono, fontSize: 22, color: C.leaf, opacity: useEnter(70) }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: C.leaf, boxShadow: `0 0 ${10 + Math.sin(frame / 6) * 6}px ${C.leaf}` }} />
          {data.location}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function TextScene({ scene, lang, dur }: { scene: Extract<Scene, { kind: "text" | "outro" }>; lang: string; dur: number }) {
  const title = useEnter(4);
  const chips = scene.kind === "text" ? scene.kicker.split(" · ").filter(Boolean) : [];
  return (
    <AbsoluteFill style={{ padding: "210px 96px 0" }}>
      <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: fitFont(scene.title, 1700, 190, 0.5), lineHeight: 0.92, textTransform: "uppercase", color: scene.kind === "outro" ? C.leaf : C.mist, transform: `translateY(${(1 - title) * 60}px)`, opacity: title }}>
        {scene.title}
      </div>
      {chips.length > 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 30 }}>
          {chips.map((c, i) => (
            <Chip key={c} delay={14 + i * 6}>
              {c}
            </Chip>
          ))}
        </div>
      )}
      <Reveal text={scene.body} from={20} to={dur * 0.75} lang={lang} style={{ marginTop: 40, maxWidth: 1600, fontFamily: F.sans, fontSize: 46, lineHeight: 1.35, color: C.mist }} />
    </AbsoluteFill>
  );
}

function Chip({ delay, children }: { delay: number; children: React.ReactNode }) {
  const s = useEnter(delay, 14);
  return (
    <span style={{ fontFamily: F.mono, fontSize: 24, padding: "10px 20px", borderRadius: 999, border: "1px solid rgba(232,254,246,0.2)", color: C.mint, transform: `scale(${0.6 + 0.4 * s})`, opacity: s }}>
      {children}
    </span>
  );
}

function WorkScene({ scene, total, dur, lang }: { scene: Extract<Scene, { kind: "work" }>; total: number; dur: number; lang: string }) {
  const frame = useCurrentFrame();
  const w: StudioWork = scene.work;
  const panel = useEnter(0, 22);
  const name = useEnter(8);
  const meta = useEnter(16);
  const metric = useEnter(28);
  const phones = (w.images ?? []).filter((s) => /mzstatic\.com/.test(s)).slice(0, 3);
  const zoom = interpolate(frame, [0, dur], [1.06, 1.16]);
  const nameSize = fitFont(w.company.toUpperCase(), 820, 170, 0.48);
  return (
    <AbsoluteFill>
      {/* Visual side */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1080, overflow: "hidden", clipPath: `inset(0 ${(1 - panel) * 100}% 0 0)` }}>
        {w.cover ? (
          <SafeImg src={w.cover} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom}) translateX(${interpolate(frame, [0, dur], [0, -30])}px)` }} />
        ) : (
          <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 85% 0%, ${w.accent}66, transparent 60%), ${C.night}` }}>
            <div style={{ position: "absolute", right: -40, top: 160, fontFamily: F.display, fontWeight: 900, fontSize: 560, color: "transparent", WebkitTextStroke: `3px ${w.accent}`, opacity: 0.6, lineHeight: 1 }}>
              {w.company
                .split(/\s+/)
                .slice(0, 2)
                .map((p) => p[0])
                .join("")
                .toUpperCase()}
            </div>
          </AbsoluteFill>
        )}
        <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(7,16,12,0.15) 0%, rgba(7,16,12,0.35) 55%, ${C.ink} 100%), linear-gradient(0deg, ${C.ink} 0%, transparent 35%)` }} />
        {phones.map((src, i) => {
          const s = spring({ frame: frame - 20 - i * 8, fps: FPS, config: { damping: 16 } });
          return (
            <div key={src} style={{ position: "absolute", left: 90 + i * 250, bottom: -60 + (i % 2) * 40, width: 260, borderRadius: 30, overflow: "hidden", border: "2px solid rgba(232,254,246,0.25)", boxShadow: "0 40px 90px rgba(0,0,0,0.6)", transform: `translateY(${(1 - s) * 300}px) rotate(${(i - 1) * 4}deg)` }}>
              <SafeImg src={src} style={{ width: "100%", display: "block" }} />
            </div>
          );
        })}
      </div>
      {w.metrics[0] && (
        <div style={{ position: "absolute", left: 96, top: 170, padding: "22px 30px", borderRadius: 18, background: "rgba(7,16,12,0.82)", border: `1px solid ${w.accent}66`, backdropFilter: "blur(10px)", opacity: metric, transform: `translateY(${(1 - metric) * 40}px)` }}>
          <CountUp value={w.metrics[0].value} start={30} style={{ fontFamily: F.display, fontWeight: 900, fontSize: 132, lineHeight: 1, color: C.leaf }} />
          <div style={{ marginTop: 6, fontFamily: F.sans, fontSize: 24, color: "rgba(232,254,246,0.78)", maxWidth: 420 }}>{w.metrics[0].label}</div>
        </div>
      )}
      <div style={{ position: "absolute", left: 1040, top: 0, bottom: 0, width: 8, background: w.accent, transform: `scaleY(${panel})`, transformOrigin: "top" }} />

      {/* Text side */}
      <div style={{ position: "absolute", left: 1110, right: 96, top: 160 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: meta }}>
          {w.logo && (
            <div style={{ height: 76, minWidth: 76, padding: 10, borderRadius: 16, background: "rgba(232,254,246,0.94)", display: "grid", placeItems: "center" }}>
              <SafeImg src={w.logo} style={{ height: 56, maxWidth: 220, objectFit: "contain" }} />
            </div>
          )}
          <span style={{ fontFamily: F.mono, fontSize: 24, color: C.mint }}>
            {String(scene.index + 1).padStart(3, "0")} / {String(total).padStart(3, "0")}
          </span>
        </div>
        <div style={{ marginTop: 26, fontFamily: F.display, fontWeight: 900, fontSize: nameSize, lineHeight: 0.92, color: C.mist, textTransform: "uppercase", transform: `translateX(${(1 - name) * 80}px)`, opacity: name }}>
          {w.company}
        </div>
        <div style={{ marginTop: 18, fontFamily: F.sans, fontWeight: 600, fontSize: 32, color: C.leaf, opacity: meta }}>{w.title}</div>
        <div style={{ marginTop: 8, fontFamily: F.mono, fontSize: 22, color: "rgba(232,254,246,0.6)", opacity: meta }}>{w.period}</div>
        <Reveal text={w.summary} from={22} to={Math.max(40, dur * 0.6)} lang={lang} style={{ marginTop: 26, fontFamily: F.sans, fontSize: 31, lineHeight: 1.38, color: "rgba(232,254,246,0.86)", display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }} />
      </div>
    </AbsoluteFill>
  );
}

function StatsScene({ scene }: { scene: Extract<Scene, { kind: "stats" }> }) {
  const title = useEnter(2);
  const stats = scene.stats.slice(0, 4);
  return (
    <AbsoluteFill style={{ padding: "210px 96px 0" }}>
      <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 170, lineHeight: 0.9, textTransform: "uppercase", color: C.mist, opacity: title, transform: `translateY(${(1 - title) * 50}px)` }}>{scene.title}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 28, marginTop: 70 }}>
        {stats.map((s, i) => (
          <StatCard key={s.label} delay={14 + i * 9} value={s.value} label={s.label} />
        ))}
      </div>
    </AbsoluteFill>
  );
}

function StatCard({ delay, value, label }: { delay: number; value: string; label: string }) {
  const s = useEnter(delay, 16);
  return (
    <div style={{ padding: "34px 30px", borderRadius: 20, background: "rgba(16,29,23,0.85)", border: "1px solid rgba(232,254,246,0.1)", transform: `translateY(${(1 - s) * 80}px)`, opacity: s }}>
      <CountUp value={value} start={delay + 4} style={{ fontFamily: F.display, fontWeight: 900, fontSize: 150, lineHeight: 1, color: C.leaf }} />
      <div style={{ marginTop: 16, fontFamily: F.sans, fontSize: 28, lineHeight: 1.3, color: "rgba(232,254,246,0.75)" }}>{label}</div>
    </div>
  );
}

function QuoteScene({ scene, lang, dur }: { scene: Extract<Scene, { kind: "quote" }>; lang: string; dur: number }) {
  const mark = useEnter(0, 12);
  const author = useEnter(Math.min(dur * 0.5, 60));
  const initials = scene.author
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return (
    <AbsoluteFill style={{ padding: "190px 160px 0 330px" }}>
      <div style={{ position: "absolute", left: 96, top: 140, fontFamily: F.display, fontWeight: 900, fontSize: 420, lineHeight: 1, color: C.leaf, opacity: 0.9 * mark, transform: `scale(${0.6 + 0.4 * mark})` }}>“</div>
      <div style={{ fontFamily: F.mono, fontSize: 24, color: C.mint, letterSpacing: 3, textTransform: "uppercase" }}>{scene.title}</div>
      <Reveal text={scene.quote} from={10} to={dur * 0.7} lang={lang} style={{ marginTop: 30, fontFamily: F.sans, fontWeight: 500, fontSize: 52, lineHeight: 1.32, color: C.mist }} />
      <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 20, opacity: author }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: C.moss, display: "grid", placeItems: "center", fontFamily: F.display, fontWeight: 800, fontSize: 32, color: C.leaf }}>{initials}</div>
        <div>
          <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 32, color: C.mist }}>{scene.author}</div>
          <div style={{ fontFamily: F.mono, fontSize: 20, color: "rgba(232,254,246,0.6)" }}>LinkedIn</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function OutroScene({ scene, props, dur, lang }: { scene: Extract<Scene, { kind: "outro" }>; props: PresentationProps; dur: number; lang: string }) {
  const frame = useCurrentFrame();
  const title = useEnter(2);
  const card = useEnter(18);
  const end = interpolate(frame, [dur - 70, dur - 30], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ padding: "200px 96px 0", opacity: 1 - end }}>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: fitFont(scene.title, 1720, 230, 0.56), lineHeight: 0.9, whiteSpace: "nowrap", textTransform: "uppercase", color: C.leaf, opacity: title, transform: `translateY(${(1 - title) * 60}px)` }}>
          {scene.title}
        </div>
        <Reveal text={props.data.availability} from={14} to={80} lang={lang} style={{ marginTop: 34, maxWidth: 1500, fontFamily: F.sans, fontSize: 44, lineHeight: 1.3, color: C.mist }} />
        <div style={{ marginTop: 50, display: "flex", gap: 24, opacity: card, transform: `translateY(${(1 - card) * 40}px)` }}>
          {[props.data.email, props.siteUrl.replace(/^https?:\/\//, "")].filter(Boolean).map((v) => (
            <div key={v} style={{ padding: "22px 34px", borderRadius: 16, background: C.leaf, color: C.ink, fontFamily: F.mono, fontWeight: 700, fontSize: 34 }}>
              {v}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      {/* End card */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: end }}>
        <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 260, color: C.leaf, lineHeight: 0.9, transform: `scale(${0.9 + 0.1 * end})` }}>{props.data.displayName.toUpperCase()}</div>
        <div style={{ marginTop: 20, fontFamily: F.mono, fontSize: 32, color: C.mist }}>{props.data.fullName}</div>
        <div style={{ marginTop: 14, fontFamily: F.mono, fontSize: 26, color: C.mint }}>{props.siteUrl.replace(/^https?:\/\//, "")}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */

export const Presentation: React.FC<PresentationProps> = (props) => {
  useLocaleFonts(props.data.locale);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scenes = useMemo(() => buildScenes(props.data, "video"), [props.data]);
  const timing = props.track.scenes;
  const audioSrc = staticFile(props.track.src.replace(/^\//, ""));
  const t = frame / FPS;
  const current = Math.max(0, timing.findIndex((s, i) => t >= (i === 0 ? 0 : s.start) && t < (timing[i + 1]?.start ?? Infinity)));
  const cur = timing[current]!;
  const progress = interpolate(t, [cur.start, cur.end], [0, 1], clamp);
  const accent = scenes[current]?.kind === "work" ? (scenes[current] as Extract<Scene, { kind: "work" }>).work.accent : C.leaf;
  const lang = props.data.locale;
  const works = scenes.filter((s) => s.kind === "work").length;

  // Music bed ducks under the voice and fades at both ends.
  const speaking = (time: number) => props.track.sentences.some((s) => time >= s.start - 0.15 && time <= s.end + 0.1);
  const bedVolume = (f: number) => {
    const time = f / FPS;
    const duck = speaking(time) ? 0.085 : 0.26;
    const fadeIn = interpolate(f, [0, 30], [0, 1], clamp);
    const fadeOut = interpolate(f, [durationInFrames - 75, durationInFrames - 5], [1, 0], clamp);
    return duck * fadeIn * fadeOut;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Backdrop accent={accent} />
      {scenes.map((scene, i) => {
        const from = i === 0 ? 0 : sec(timing[i]?.start ?? 0);
        const to = i === scenes.length - 1 ? durationInFrames : sec(timing[i + 1]?.start ?? timing[i]!.end) + OVERLAP;
        const dur = Math.max(1, to - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`${i + 1}. ${scene.kind}`}>
            <SceneFade dur={dur} last={i === scenes.length - 1}>
              {scene.kind === "intro" && <IntroScene scene={scene} data={props.data} dur={dur} />}
              {scene.kind === "text" && <TextScene scene={scene} lang={lang} dur={dur} />}
              {scene.kind === "work" && <WorkScene scene={scene} total={works} dur={dur} lang={lang} />}
              {scene.kind === "stats" && <StatsScene scene={scene} />}
              {scene.kind === "stack" && <TextScene scene={{ kind: "text", title: scene.title, kicker: "", body: scene.narration, narration: scene.narration }} lang={lang} dur={dur} />}
              {scene.kind === "quote" && <QuoteScene scene={scene} lang={lang} dur={dur} />}
              {scene.kind === "outro" && <OutroScene scene={scene} props={props} dur={dur} lang={lang} />}
            </SceneFade>
          </Sequence>
        );
      })}
      <Chrome kicker={scenes[current]?.kicker ?? ""} index={current} total={scenes.length} progress={progress} />
      <Captions props={props} audioSrc={audioSrc} />
      <Audio src={audioSrc} />
      <Audio src={staticFile("studio/bed.mp3")} volume={bedVolume} />
    </AbsoluteFill>
  );
};

function SceneFade({ dur, last, children }: { dur: number; last: boolean; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, OVERLAP], [0, 1], clamp);
  const exit = last ? 1 : interpolate(frame, [dur - OVERLAP, dur], [1, 0], clamp);
  return <AbsoluteFill style={{ opacity: Math.min(enter, exit), filter: `blur(${(1 - Math.min(enter, exit)) * 6}px)` }}>{children}</AbsoluteFill>;
}
