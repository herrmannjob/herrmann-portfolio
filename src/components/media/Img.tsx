"use client";

import { useEffect, useRef, useState } from "react";
import type { Media } from "@/lib/types";
import { BrandCover } from "./BrandCover";

type Props = {
  media?: Pick<Media, "src" | "alt" | "width" | "height">;
  /** Shown when there is no image or it fails to load */
  fallbackLabel: string;
  accent?: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  sizes?: string;
};

/**
 * Plain <img> on purpose: researched images live on third-party hosts, so we
 * skip next/image's optimizer (which would need every host whitelisted) and
 * degrade to a generated brand cover if the host is down or blocks hotlinking.
 */
export function Img({ media, fallbackLabel, accent, className = "", imgClassName = "", eager }: Props) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  // An image can fail before hydration attaches onError — check once mounted.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [media?.src]);
  if (!media || failed) {
    return <BrandCover label={fallbackLabel} accent={accent} className={className} />;
  }
  return (
    <div className={`relative overflow-hidden bg-panel ${className}`}>
      <img
        ref={ref}
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
