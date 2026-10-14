"use client";

import { useState } from "react";
import { Play } from "lucide-react";

type Parsed = { kind: "iframe" | "file"; src: string; poster?: string };

/** YouTube/Vimeo link → privacy-enhanced player URL (+ poster for YouTube), or a direct video file. */
export function parseVideo(url: string): Parsed | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    let yt: string | undefined;
    if (host === "youtube.com" || host === "m.youtube.com") yt = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{11})/)?.[1];
    if (host === "youtu.be") yt = u.pathname.slice(1, 12);
    if (yt && /^[\w-]{11}$/.test(yt)) {
      return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${yt}?rel=0&autoplay=1`, poster: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` };
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = u.pathname.match(/(\d{6,})/)?.[1];
      return id ? { kind: "iframe", src: `https://player.vimeo.com/video/${id}?dnt=1&autoplay=1` } : null;
    }
    if (/\.(mp4|webm|ogg|mov)$/i.test(u.pathname)) return { kind: "file", src: url };
  } catch {
    /* not a URL */
  }
  return null;
}

/**
 * Click-to-play: the third-party player (and its trackers and scripts) only
 * loads when the visitor asks for it — until then it is a poster and a button.
 */
export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const v = parseVideo(url);
  if (!v) return null;
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border border-mist/10 bg-ink">
      {v.kind === "file" ? (
        <video src={v.src} controls preload="metadata" className="absolute inset-0 h-full w-full" aria-label={title} />
      ) : playing ? (
        <iframe
          src={v.src}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 grid place-items-center focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-leaf">
          {v.poster && (
            <img src={v.poster} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-70 blur-[1px] transition duration-700 group-hover:scale-100 group-hover:opacity-90 group-hover:blur-0" />
          )}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/10" />
          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-leaf text-ink shadow-[0_0_0_10px_rgba(168,217,101,.18)] transition-transform group-hover:scale-110">
            <Play size={30} className="translate-x-[2px]" fill="currentColor" aria-hidden />
          </span>
          <span className="absolute inset-x-0 bottom-0 p-5 text-left font-mono text-xs uppercase tracking-[0.18em] text-mist/85 sm:p-7">{title}</span>
        </button>
      )}
    </div>
  );
}
