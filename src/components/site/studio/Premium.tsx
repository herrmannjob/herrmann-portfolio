"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Pause, Play, RotateCcw } from "lucide-react";
import { useDictionary } from "@/lib/i18n/client";
import type { MediaTrack } from "@/lib/studio-media";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * Plays a pre-rendered neural narration (scripts/studio) and reports which
 * sentence is being spoken, so the text can follow along.
 */
export function NarrationPlayer({
  track,
  fileName,
  onSentence,
  seekRef,
}: {
  track: MediaTrack;
  fileName: string;
  onSentence: (index: number) => void;
  /** Lets the transcript seek: click a sentence to jump there */
  seekRef?: React.MutableRefObject<((sentence: number) => void) | null>;
}) {
  const t = useDictionary().studio;
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [rate, setRate] = useState(1);
  const last = useRef(-1);

  useEffect(() => {
    if (!seekRef) return;
    seekRef.current = (i) => {
      const el = audio.current;
      const s = track.sentences[i];
      if (!el || !s) return;
      el.currentTime = s.start;
      void el.play();
    };
    return () => {
      seekRef.current = null;
    };
  }, [seekRef, track]);

  useEffect(() => {
    const el = audio.current;
    if (el) el.playbackRate = rate;
  }, [rate]);

  const onTime = () => {
    const el = audio.current!;
    setTime(el.currentTime);
    const i = track.sentences.findIndex((s) => el.currentTime >= s.start - 0.05 && el.currentTime < s.end + 0.3);
    if (i !== last.current) {
      last.current = i;
      onSentence(i);
    }
  };

  return (
    <div className="rounded-lg border border-leaf/30 bg-leaf/[0.06] p-3 sm:p-4">
      <audio
        ref={audio}
        src={track.src}
        preload="metadata"
        onTimeUpdate={onTime}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          onSentence(-1);
          last.current = -1;
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-primary py-2 text-sm"
          onClick={() => (playing ? audio.current?.pause() : void audio.current?.play())}
          data-autoplay-target
        >
          {playing ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />} {playing ? t.pause : t.listen}
        </button>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-md border border-mist/20 text-mist/80 hover:border-leaf hover:text-leaf"
          aria-label={t.restart}
          title={t.restart}
          onClick={() => {
            if (!audio.current) return;
            audio.current.currentTime = 0;
            void audio.current.play();
          }}
        >
          <RotateCcw size={16} aria-hidden />
        </button>
        <label className="flex min-w-[180px] flex-1 items-center gap-3 font-mono text-[11px] text-mist/70">
          <span className="tabular-nums">{fmt(time)}</span>
          <input
            type="range"
            min={0}
            max={track.duration}
            step={0.1}
            value={time}
            aria-label={t.seek}
            aria-valuetext={`${fmt(time)} / ${fmt(track.duration)}`}
            onChange={(e) => {
              if (audio.current) audio.current.currentTime = Number(e.target.value);
              setTime(Number(e.target.value));
            }}
            className="h-1 flex-1 cursor-pointer accent-[#A8D965]"
          />
          <span className="tabular-nums">{fmt(track.duration)}</span>
        </label>
        <label className="flex items-center gap-2 font-mono text-[11px] text-mist/70">
          {t.speed}
          <select className="rounded-md border border-mist/20 bg-ink px-2 py-1.5 text-mist" value={rate} onChange={(e) => setRate(Number(e.target.value))}>
            {[0.85, 1, 1.15, 1.3, 1.5].map((r) => (
              <option key={r} value={r}>{r}×</option>
            ))}
          </select>
        </label>
        <a href={track.src} download={fileName} className="btn-ghost py-2 text-sm">
          <Download size={15} aria-hidden /> {t.downloadAudio}
        </a>
      </div>
      <p className="mt-2 font-mono text-[11px] text-mist/65">{t.neural}</p>
    </div>
  );
}

/** The Remotion presentation, rendered offline per language. */
export function PresentationVideo({ track, locale, onFallback }: { track: MediaTrack; locale: string; onFallback: () => void }) {
  const t = useDictionary().studio;
  if (!track.video) return null;
  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-mist/10 bg-ink">
        {/* Captions are burned into the video; the full transcript is right below. */}
        <video
          src={track.video}
          poster={track.poster}
          controls
          playsInline
          preload="metadata"
          className="block aspect-video w-full bg-ink"
          aria-describedby="studio-transcript"
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a href={track.video} download={`herrmann-presentation-${locale}.mp4`} className="btn-ghost py-2 text-sm">
          <Download size={15} aria-hidden /> {t.downloadVideo}
        </a>
        <button type="button" className="btn-ghost py-2 text-sm" onClick={onFallback}>
          {t.liveVersion}
        </button>
        <span className="font-mono text-[11px] text-mist/65">{t.madeWith}</span>
      </div>
      <details className="mt-4 rounded-lg border border-mist/10 bg-ink/60 p-4">
        <summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.16em] text-mint">{t.transcript}</summary>
        <div id="studio-transcript" className="mt-3 space-y-2 text-[15px] leading-relaxed text-mist/80">
          {track.sentences.map((s, i) => (
            <p key={i}>
              <span className="mr-2 font-mono text-[11px] text-mist/65">{fmt(s.start)}</span>
              {s.text}
            </p>
          ))}
        </div>
      </details>
    </div>
  );
}
