"use client";

import { useEffect, useRef, useState } from "react";
import type { Media } from "@/lib/types";

/** Monochrome company logo with a text fallback. */
export function Logo({ media, name, className = "", tone = "light" }: { media?: Media; name: string; className?: string; tone?: "light" | "dark" | "color" }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [media?.src]);
  if (!media || failed) {
    return <span className={`font-display text-xl font-extrabold uppercase tracking-tight ${className}`}>{name}</span>;
  }
  // Opaque square app icons would turn into a solid block when made monochrome — keep their colors.
  const appIcon = Boolean(media.width && media.width === media.height);
  if (appIcon) tone = "color";
  const filter =
    tone === "light" ? "grayscale(1) brightness(0) invert(1)" : tone === "dark" ? "grayscale(1) brightness(0)" : undefined;
  return (
    <img
      ref={ref}
      src={media.src}
      alt={`${name} logo`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-contain ${appIcon ? "aspect-square rounded-[22%]" : ""} ${className}`}
      style={{ filter }}
    />
  );
}
