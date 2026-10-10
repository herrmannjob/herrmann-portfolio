"use client";

import { useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import type { Media } from "@/lib/types";

export function Thumb({ media, className = "", contain }: { media?: Media; className?: string; contain?: boolean }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [media?.src]);
  if (!media || failed) {
    return (
      <div className={`grid place-items-center bg-panel text-mist/30 ${className}`} title={failed ? "Não foi possível carregar esta imagem" : undefined}>
        <ImageOff size={18} />
      </div>
    );
  }
  return (
    <img
      ref={ref}
      src={media.src}
      alt={media.alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`bg-[repeating-conic-gradient(#1a2a22_0%_25%,#101d17_0%_50%)] [background-size:16px_16px] ${contain ? "object-contain" : "object-cover"} ${className}`}
    />
  );
}
