"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Check, Copy, Download, Maximize, Pause, Play, Printer, RotateCcw, SkipBack, SkipForward, Square, Volume2, VolumeX, X } from "lucide-react";
import { LOCALE_TAG } from "@/lib/i18n/config";
import { useDictionary } from "@/lib/i18n/client";
import { buildScenes, estimateSeconds, scenesToText, type StudioData, type SummaryLength } from "@/lib/summary";
import { STUDIO_EVENT, type StudioTab } from "./StudioTrigger";
import { splitSentences, useSpeech } from "./useSpeech";
import { drawFrame, H, W } from "./render";
import { NarrationPlayer, PresentationVideo } from "./Premium";
import type { StudioMedia } from "@/lib/studio-media";

/**
 * "Listen & watch": a summary of the portfolio you can read, hear (speech
 * synthesis) or watch as a narrated video generated on the fly — all on the
 * visitor's device.
 */
export function Studio({ data, media = {} }: { data: StudioData; media?: StudioMedia }) {
  const t = useDictionary().studio;
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<StudioTab>("summary");
  const [length, setLength] = useState<SummaryLength>("medium");
  const [live, setLive] = useState(false);
  const premiumVideo = tab === "video" && !live && Boolean(media.video?.video);
  const opener = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const speech = useSpeech(LOCALE_TAG[data.locale]);

  const scenes = useMemo(() => buildScenes(data, length), [data, length]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<{ tab: StudioTab; opener?: HTMLElement }>).detail;
      opener.current = d.opener ?? (document.activeElement as HTMLElement | null);
      setTab(d.tab);
      if (d.tab === "video") setLength("medium");
      setOpen(true);
    };
    window.addEventListener(STUDIO_EVENT, onOpen);
    return () => window.removeEventListener(STUDIO_EVENT, onOpen);
  }, []);

  const close = useCallback(() => {
    speech.stop();
    setOpen(false);
    opener.current?.focus();
  }, [speech]);

  // Modal behaviour: focus inside, Esc closes, Tab stays inside, page doesn't scroll.
  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    el?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "Tab" && el) {
        const f = Array.from(el.querySelectorAll<HTMLElement>('button:not([disabled]), select, a[href], [tabindex]:not([tabindex="-1"])')).filter(
          (n) => n.offsetParent !== null,
        );
        if (!f.length) return;
        const first = f[0]!;
        const last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  // Switching tab or length stops whatever is being spoken.
  useEffect(() => speech.stop(), [tab, length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const tabs: Array<{ id: StudioTab; label: string }> = [
    { id: "summary", label: t.tabSummary },
    { id: "video", label: t.tabVideo },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden border border-mist/15 bg-night shadow-2xl sm:max-h-[92dvh] sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-mist/10 p-4 sm:p-6">
          <div>
            <h2 id={titleId} className="display text-4xl sm:text-5xl">{t.title}</h2>
            <p className="mt-1 max-w-2xl text-sm text-mist/65">{t.lead}</p>
          </div>
          <button type="button" onClick={close} className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-mist/20 hover:border-leaf" aria-label={t.close}>
            <X size={18} aria-hidden />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mist/10 px-4 py-3 sm:px-6">
          <div role="tablist" aria-label={t.title} className="flex gap-1 rounded-full border border-mist/15 p-1">
            {tabs.map((x, i) => (
              <button
                key={x.id}
                id={`studio-tab-${x.id}`}
                role="tab"
                type="button"
                aria-selected={tab === x.id}
                aria-controls={`studio-panel-${x.id}`}
                tabIndex={tab === x.id ? 0 : -1}
                data-autofocus={tab === x.id ? "" : undefined}
                onClick={() => setTab(x.id)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length]!;
                    setTab(n.id);
                    document.getElementById(`studio-tab-${n.id}`)?.focus();
                  }
                }}
                className={`rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                  tab === x.id ? "bg-leaf text-ink" : "text-mist/70 hover:text-leaf"
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>
          <fieldset className={`flex flex-wrap items-center gap-2 ${premiumVideo ? "invisible" : ""}`} disabled={premiumVideo}>
            <legend className="sr-only">{t.length}</legend>
            {(["short", "medium", "full"] as const).map((l) => (
              <label key={l} className={`cursor-pointer rounded-full border px-3 py-1 font-mono text-[11px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-leaf ${length === l ? "border-leaf text-leaf" : "border-mist/20 text-mist/70 hover:border-mist/50"}`}>
                <input type="radio" name="studio-length" value={l} checked={length === l} onChange={() => setLength(l)} className="sr-only" />
                {t[l]}
              </label>
            ))}
          </fieldset>
        </div>

        <div key={tab} className="min-h-0 flex-1 overflow-y-auto">
          {tab === "summary" ? (
            <SummaryPanel data={data} scenes={scenes} speech={speech} track={media[length]} />
          ) : (
            premiumVideo ? (
            <div id="studio-panel-video" role="tabpanel" aria-labelledby="studio-tab-video" className="p-4 sm:p-6">
              <PresentationVideo track={media.video!} locale={data.locale} onFallback={() => setLive(true)} />
            </div>
          ) : (
            <VideoPanel key={length} data={data} scenes={scenes} speech={speech} />
          )
          )}
        </div>
      </div>
    </div>
  );
}

type Speech = ReturnType<typeof useSpeech>;
type Scenes = ReturnType<typeof buildScenes>;

/* ------------------------------------------------------------------ */
/* Summary: read, listen, copy, download, print                         */
/* ------------------------------------------------------------------ */

function SummaryPanel({ data, scenes, speech, track }: { data: StudioData; scenes: Scenes; speech: Speech; track?: StudioMedia[SummaryLength] }) {
  const t = useDictionary().studio;
  const [active, setActive] = useState(-1);
  const [sentence, setSentence] = useState(-1);
  const seek = useRef<((i: number) => void) | null>(null);
  // Global sentence index for each (scene, sentence) pair, matching the pre-rendered track.
  const sentenceIds = useMemo(() => {
    let n = 0;
    return scenes.map((s) => splitSentences(s.narration).map(() => n++));
  }, [scenes]);
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => scenesToText(data, scenes), [data, scenes]);
  const paragraphs = useMemo(() => scenes.map((s) => s.narration), [scenes]);

  const listen = async () => {
    const chunks: string[] = [];
    const owner: number[] = [];
    paragraphs.forEach((p, i) => splitSentences(p).forEach((c) => (chunks.push(c), owner.push(i))));
    await speech.speak(chunks, (i) => setActive(owner[i] ?? -1));
    setActive(-1);
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `herrmann-summary-${data.locale}.txt` });
    a.click();
    URL.revokeObjectURL(url);
  };

  const print = () => {
    const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
    const html = `<!doctype html><html lang="${LOCALE_TAG[data.locale]}"><head><meta charset="utf-8"><title>${esc(data.displayName)} — ${esc(data.fullName)}</title>
<style>body{font:15px/1.6 system-ui,sans-serif;max-width:680px;margin:40px auto;color:#111}h1{font-size:28px;margin:0}p.k{color:#555;margin:4px 0 24px}</style></head>
<body><h1>${esc(data.displayName)} — ${esc(data.fullName)}</h1><p class="k">${esc(data.headline)}</p>${paragraphs.slice(1).map((p) => `<p>${esc(p)}</p>`).join("")}</body></html>`;
    const frame = Object.assign(document.createElement("iframe"), { title: "print" });
    frame.style.cssText = "position:fixed;width:0;height:0;border:0;opacity:0";
    document.body.appendChild(frame);
    const doc = frame.contentDocument!;
    doc.open();
    doc.write(html);
    doc.close();
    frame.contentWindow!.focus();
    frame.contentWindow!.print();
    setTimeout(() => frame.remove(), 1000);
  };

  return (
    <div id="studio-panel-summary" role="tabpanel" aria-labelledby="studio-tab-summary" className="p-4 sm:p-6">
      {track ? (
        <NarrationPlayer
          track={track}
          fileName={`herrmann-summary-${data.locale}.mp3`}
          seekRef={seek}
          onSentence={(i) => {
            setSentence(i);
            setActive(i >= 0 ? (track.sentences[i]?.scene ?? -1) : -1);
          }}
        />
      ) : (
        <SpeechBar speech={speech} onListen={listen} />
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-ghost py-2 text-sm"
          onClick={async () => {
            await navigator.clipboard?.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
        >
          {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />} {copied ? t.copied : t.copy}
        </button>
        <button type="button" className="btn-ghost py-2 text-sm" onClick={download}>
          <Download size={15} aria-hidden /> {t.download}
        </button>
        <button type="button" className="btn-ghost py-2 text-sm" onClick={print}>
          <Printer size={15} aria-hidden /> {t.print}
        </button>
      </div>

      <article lang={LOCALE_TAG[data.locale]} className="mt-6 rounded-lg border border-mist/10 bg-ink/60 p-5 sm:p-7">
        <h3 className="display text-4xl text-leaf">{data.displayName}</h3>
        <p className="font-mono text-xs text-mist/60">{data.fullName} · {data.headline}</p>
        <div className="mt-5 space-y-4 text-[17px] leading-relaxed">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              aria-current={active === i ? "true" : undefined}
              className={`whitespace-pre-line rounded-md px-2 py-1 transition-colors ${active === i ? "bg-leaf/10 text-mist" : "text-mist/80"}`}
            >
              {track
                ? // Read-along: each sentence highlights while spoken; click one to jump there.
                  splitSentences(p).map((s, j) => {
                    const id = sentenceIds[i]?.[j] ?? -1;
                    return (
                      <span key={j}>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={() => seek.current?.(id)}
                          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), seek.current?.(id))}
                          className={`cursor-pointer rounded px-0.5 transition-colors hover:text-leaf ${sentence === id ? "bg-leaf/25 text-mist" : ""}`}
                        >
                          {s}
                        </span>{" "}
                      </span>
                    );
                  })
                : p}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}

function SpeechBar({ speech, onListen, extra }: { speech: Speech; onListen: () => void; extra?: React.ReactNode }) {
  const t = useDictionary().studio;
  if (!speech.supported) return <p role="status" className="text-sm text-signal">{t.noSpeech}</p>;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {speech.state === "idle" && (
        <button type="button" className="btn-primary py-2 text-sm" onClick={onListen} disabled={!speech.voices.length}>
          <Volume2 size={15} aria-hidden /> {t.listen}
        </button>
      )}
      {speech.state === "speaking" && (
        <button type="button" className="btn-primary py-2 text-sm" onClick={speech.pause}>
          <Pause size={15} aria-hidden /> {t.pause}
        </button>
      )}
      {speech.state === "paused" && (
        <button type="button" className="btn-primary py-2 text-sm" onClick={speech.resume}>
          <Play size={15} aria-hidden /> {t.resume}
        </button>
      )}
      {speech.state !== "idle" && (
        <button type="button" className="btn-ghost py-2 text-sm" onClick={speech.stop}>
          <Square size={14} aria-hidden /> {t.stop}
        </button>
      )}
      {extra}
      <label className="ml-auto flex items-center gap-2 font-mono text-[11px] text-mist/60">
        {t.speed}
        <select className="rounded-md border border-mist/20 bg-ink px-2 py-1.5 text-mist" value={speech.rate} onChange={(e) => speech.setRate(Number(e.target.value))}>
          {[0.8, 1, 1.2, 1.5].map((r) => (
            <option key={r} value={r}>{r}×</option>
          ))}
        </select>
      </label>
      {speech.voices.length > 1 && (
        <label className="flex items-center gap-2 font-mono text-[11px] text-mist/60">
          {t.voice}
          <select className="max-w-[180px] rounded-md border border-mist/20 bg-ink px-2 py-1.5 text-mist" value={speech.voiceURI} onChange={(e) => speech.setVoiceURI(e.target.value)}>
            {speech.voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
            ))}
          </select>
        </label>
      )}
      {!speech.voices.length && <p role="status" className="w-full text-sm text-signal">{t.noVoice}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Video: canvas scenes + narration, playable now or exported as WebM  */
/* ------------------------------------------------------------------ */

function sceneDuration(narration: string, locale: StudioData["locale"]) {
  return Math.max(4, estimateSeconds(narration, locale)) + 0.8;
}

/** Caption for a given point of a scene when no live speech drives it. */
function captionAt(narration: string, p: number) {
  const parts = splitSentences(narration);
  const total = parts.reduce((n, s) => n + s.length, 0) || 1;
  let acc = 0;
  for (const s of parts) {
    acc += s.length;
    if (p <= acc / total) return s;
  }
  return parts[parts.length - 1] ?? "";
}

function usePortrait(src?: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    // Same-origin only, so the canvas stays exportable.
    if (!src || /^https?:/.test(src)) return;
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = src;
  }, [src]);
  return img;
}

function VideoPanel({ data, scenes, speech }: { data: StudioData; scenes: Scenes; speech: Speech }) {
  const t = useDictionary().studio;
  const reduced = useReducedMotion() ?? false;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const photo = usePortrait(data.photoSrc);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [narrate, setNarrate] = useState(speech.supported);
  const [captions, setCaptions] = useState(true);
  const [caption, setCaption] = useState("");
  const [rec, setRec] = useState<number | null>(null);
  // Starts paused: the timeline only moves once the visitor presses play.
  const clock = useRef(((n: number) => ({ start: n, pausedAt: n, spoken: false }))(performance.now()));
  const recCancel = useRef<() => void>(() => {});
  const durations = useMemo(() => scenes.map((s) => sceneDuration(s.narration, data.locale)), [scenes, data.locale]);
  const scene = scenes[index]!;

  // Draw loop
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const loop = () => {
      const c = clock.current;
      const now = c.pausedAt || performance.now();
      const elapsed = (now - c.start) / 1000;
      const dur = durations[index]!;
      const p = c.spoken ? 1 : Math.min(narrate && playing ? 0.97 : 1, elapsed / dur);
      const live = narrate && speech.state !== "idle" ? caption : captionAt(scene.narration, p);
      drawFrame(ctx, scene, { p, t: playing ? elapsed : Math.max(elapsed, 1), index, total: scenes.length, caption: captions ? live : undefined, photo, reduced });
      // Silent playback advances on time; narrated playback advances when speech ends.
      if (playing && !narrate && elapsed >= dur) {
        if (index < scenes.length - 1) goTo(index + 1);
        else setPlaying(false);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }); // re-bound each render on purpose: reads the latest state

  const goTo = useCallback(
    (i: number) => {
      speech.stop();
      const n = performance.now();
      clock.current = { start: n, pausedAt: playing ? 0 : n, spoken: false };
      setCaption("");
      setIndex(i);
    },
    [speech, playing],
  );

  // Narration drives the timeline while playing.
  useEffect(() => {
    if (!playing || !narrate) return;
    let alive = true;
    const chunks = splitSentences(scene.narration);
    clock.current = { start: performance.now(), pausedAt: 0, spoken: false };
    speech.speak(chunks, (i) => setCaption(chunks[i] ?? "")).then((done) => {
      if (!alive || !done) return;
      clock.current.spoken = true;
      setTimeout(() => {
        if (!alive) return;
        if (index < scenes.length - 1) goTo(index + 1);
        else setPlaying(false);
      }, 700);
    });
    return () => {
      alive = false;
    };
  }, [playing, narrate, index]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => {
    const c = clock.current;
    if (playing) {
      setPlaying(false);
      c.pausedAt = performance.now();
      speech.stop();
    } else {
      if (index === scenes.length - 1 && (c.spoken || (performance.now() - c.start) / 1000 >= durations[index]!)) goTo(0);
      else if (c.pausedAt) {
        c.start += performance.now() - c.pausedAt;
        c.pausedAt = 0;
      }
      setPlaying(true);
    }
  };

  const record = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const type = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m));
    if (!ctx || !type || !canvas.captureStream) {
      alert(t.recordUnsupported);
      return;
    }
    setPlaying(false);
    speech.stop();
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 4_000_000 });
    const parts: Blob[] = [];
    recorder.ondataavailable = (e) => e.data.size && parts.push(e.data);
    const total = durations.reduce((a, b) => a + b, 0);
    let cancelled = false;
    recCancel.current = () => {
      cancelled = true;
      recorder.stop();
    };
    recorder.onstop = () => {
      stream.getTracks().forEach((tr) => tr.stop());
      setRec(null);
      if (cancelled) return;
      const url = URL.createObjectURL(new Blob(parts, { type: "video/webm" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: `herrmann-presentation-${data.locale}.webm` });
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    };
    recorder.start(250);
    const t0 = performance.now();
    setRec(0);
    // setInterval keeps rendering even if the tab loses focus.
    const timer = setInterval(() => {
      if (cancelled) return clearInterval(timer);
      const el = (performance.now() - t0) / 1000;
      if (el >= total) {
        clearInterval(timer);
        recorder.stop();
        return;
      }
      let i = 0;
      let acc = 0;
      while (i < durations.length - 1 && el >= acc + durations[i]!) acc += durations[i++]!;
      const local = el - acc;
      const p = local / durations[i]!;
      drawFrame(ctx, scenes[i]!, { p, t: local, index: i, total: scenes.length, caption: captionAt(scenes[i]!.narration, p), photo, reduced: false });
      setRec(Math.round((el / total) * 100));
    }, 1000 / 30);
  };

  useEffect(() => () => recCancel.current(), []);

  return (
    <div id="studio-panel-video" role="tabpanel" aria-labelledby="studio-tab-video" className="p-4 sm:p-6">
      <div ref={stageRef} className="relative overflow-hidden rounded-lg border border-mist/10 bg-ink">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block aspect-video w-full"
          role="img"
          aria-label={`${t.scene(index + 1, scenes.length)} — ${scene.kind === "work" ? scene.work.company : "title" in scene ? scene.title : ""}`}
        />
      </div>
      {/* Text alternative of what is on screen / being said */}
      <p aria-live="polite" lang={LOCALE_TAG[data.locale]} className="sr-only">
        {playing ? scene.narration : ""}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="btn-primary py-2 text-sm" onClick={togglePlay} disabled={rec !== null}>
          {playing ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />} {playing ? t.pause : t.play}
        </button>
        <IconBtn label={t.restart} onClick={() => goTo(0)} disabled={rec !== null}><RotateCcw size={16} /></IconBtn>
        <IconBtn label={t.prevScene} onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0 || rec !== null}><SkipBack size={16} /></IconBtn>
        <IconBtn label={t.nextScene} onClick={() => goTo(Math.min(scenes.length - 1, index + 1))} disabled={index === scenes.length - 1 || rec !== null}><SkipForward size={16} /></IconBtn>
        <span className="font-mono text-[11px] text-mist/60" aria-live="polite">{t.scene(index + 1, scenes.length)}</span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={narrate}
            disabled={!speech.supported || !speech.voices.length}
            onClick={() => {
              setNarrate((v) => !v);
              speech.stop();
            }}
            className={`btn-ghost py-2 text-sm ${narrate ? "border-leaf text-leaf" : ""}`}
          >
            {narrate ? <Volume2 size={15} aria-hidden /> : <VolumeX size={15} aria-hidden />} {t.narration}
          </button>
          <button type="button" aria-pressed={captions} onClick={() => setCaptions((v) => !v)} className={`btn-ghost py-2 text-sm ${captions ? "border-leaf text-leaf" : ""}`}>
            CC <span className="sr-only">{t.captions}</span>
          </button>
          <IconBtn label={t.fullscreen} onClick={() => stageRef.current?.requestFullscreen?.()}><Maximize size={16} /></IconBtn>
        </div>
      </div>
      {speech.supported && !speech.voices.length && <p role="status" className="mt-2 text-sm text-signal">{t.noVoice}</p>}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-mist/10 pt-4">
        {rec === null ? (
          <button type="button" className="btn-ghost py-2 text-sm" onClick={record}>
            <Download size={15} aria-hidden /> {t.record}
          </button>
        ) : (
          <>
            <div className="h-2 w-48 overflow-hidden rounded-full bg-mist/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={rec} aria-label={t.recording(rec)}>
              <div className="h-full bg-leaf transition-[width]" style={{ width: `${rec}%` }} />
            </div>
            <span className="font-mono text-xs text-mist/70" aria-live="polite">{t.recording(rec)}</span>
            <button type="button" className="btn-ghost py-1.5 text-xs" onClick={() => recCancel.current()}>
              <X size={14} aria-hidden /> {t.stop}
            </button>
          </>
        )}
        <p className="basis-full text-xs text-mist/65">{t.recordNote}</p>
      </div>
    </div>
  );
}

function IconBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label} className="grid h-10 w-10 place-items-center rounded-md border border-mist/20 text-mist/80 hover:border-leaf hover:text-leaf disabled:opacity-40">
      <span aria-hidden>{children}</span>
    </button>
  );
}
