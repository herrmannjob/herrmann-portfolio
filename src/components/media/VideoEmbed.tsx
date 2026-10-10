/** Embeds a YouTube/Vimeo link (privacy-enhanced players) or a direct video file. */
export function parseVideo(url: string): { kind: "iframe" | "file"; src: string } | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{11})/)?.[1];
      return id ? { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}?rel=0` } : null;
    }
    if (host === "youtu.be") {
      const id = u.pathname.slice(1, 12);
      return id ? { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}?rel=0` } : null;
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = u.pathname.match(/(\d{6,})/)?.[1];
      return id ? { kind: "iframe", src: `https://player.vimeo.com/video/${id}?dnt=1` } : null;
    }
    if (/\.(mp4|webm|ogg|mov)$/i.test(u.pathname)) return { kind: "file", src: url };
  } catch {
    /* not a URL */
  }
  return null;
}

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const v = parseVideo(url);
  if (!v) return null;
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border border-mist/10 bg-ink">
      {v.kind === "iframe" ? (
        <iframe
          src={v.src}
          title={title}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <video src={v.src} controls preload="metadata" className="absolute inset-0 h-full w-full" aria-label={title} />
      )}
    </div>
  );
}
