"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Media } from "@/lib/types";
import { Img } from "./Img";
import { useDictionary } from "@/lib/i18n/client";

export function Gallery({ images, label, accent }: { images: Media[]; label: string; accent: string }) {
  const t = useDictionary().gallery;
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    lastFocus.current?.focus();
  }, []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  if (!images.length) return null;
  const current = open !== null ? images[open] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        {images.map((img, i) => {
          // Editorial rhythm: wide, narrow, narrow, wide…
          const span = i % 3 === 0 ? "col-span-2 lg:col-span-4" : "col-span-1 lg:col-span-2";
          // Phone screenshots and square icons are shown whole, never cropped.
          const fit = img.width && img.height && img.height >= img.width ? "!object-contain p-3" : "";
          return (
            <li key={img.id} className={span}>
              <button
                type="button"
                className="group block w-full overflow-hidden rounded-lg border border-mist/10 text-left"
                onClick={(e) => {
                  lastFocus.current = e.currentTarget;
                  setOpen(i);
                }}
                aria-label={`${t.open(i + 1, images.length)}${img.alt ? `: ${img.alt}` : ""}`}
              >
                <Img
                  media={img}
                  fallbackLabel={label}
                  accent={accent}
                  className={i % 3 === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}
                  imgClassName={`transition-transform duration-700 group-hover:scale-[1.03] ${fit}`}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {current && (
        <div role="dialog" aria-modal="true" aria-label={`${label} — ${t.label}`} className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4 font-mono text-xs text-mist/70">
            <span>
              {open! + 1} / {images.length} {current.alt && `· ${current.alt}`}
            </span>
            <button ref={closeRef} type="button" onClick={close} className="grid h-10 w-10 place-items-center rounded-md border border-mist/20" aria-label={t.close}>
              <X size={18} />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-16" onClick={(e) => e.target === e.currentTarget && close()}>
            <img src={current.src} alt={current.alt} referrerPolicy="no-referrer" className="max-h-full max-w-full rounded-md object-contain" />
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-mist/20 bg-ink/70 sm:left-4" aria-label={t.prev}>
                  <ChevronLeft size={20} />
                </button>
                <button type="button" onClick={() => step(1)} className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-mist/20 bg-ink/70 sm:right-4" aria-label={t.next}>
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
