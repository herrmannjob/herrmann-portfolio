"use client";

import { useState } from "react";
import { ArrowUpRight, Languages } from "lucide-react";
import type { Recommendation } from "@/lib/types";
import { LOCALE_TAG } from "@/lib/i18n/config";
import { useDictionary, useLocale } from "@/lib/i18n/client";
import { initials } from "@/lib/format";
import { Reveal } from "./Reveal";

export function Recommendations({ items, profileUrl }: { items: Recommendation[]; profileUrl: string }) {
  const t = useDictionary().recs;
  if (!items.length) return null;
  return (
    <section id="recommendations" aria-labelledby="recs-title" className="relative scroll-mt-16 border-t border-mist/10 py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-mist/10 pb-8">
            <div>
              <p className="eyebrow">{t.eyebrow}</p>
              <h2 id="recs-title" className="display mt-3 text-6xl sm:text-8xl">
                {t.titleA} <span className="text-leaf">{t.titleB}</span>
              </h2>
            </div>
            <div className="max-w-sm">
              <p className="text-mist/60">{t.lead}</p>
              <a href={profileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-leaf hover:underline">
                {t.seeAll} <ArrowUpRight size={13} aria-hidden />
              </a>
            </div>
          </div>
        </Reveal>
        <ul className="mt-12 gap-5 [column-fill:_balance] sm:columns-2 lg:columns-3">
          {items.map((r, i) => (
            <li key={r.id} className="mb-5 break-inside-avoid">
              <Reveal delay={(i % 3) * 0.05}>
                <Card r={r} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Card({ r }: { r: Recommendation }) {
  const dict = useDictionary();
  const t = dict.recs;
  const locale = useLocale();
  const translation = locale !== r.lang ? r.translations[locale] : undefined;
  const [original, setOriginal] = useState(false);
  const showing = translation && !original ? translation : r.text;
  const lang = translation && !original ? locale : r.lang;
  const date = r.date
    ? new Intl.DateTimeFormat(LOCALE_TAG[locale], { month: "short", year: "numeric" }).format(new Date(`${r.date}T12:00:00`))
    : "";

  return (
    <figure className="rounded-lg border border-mist/10 bg-panel/60 p-6 transition-colors hover:border-leaf/40">
      <blockquote lang={LOCALE_TAG[lang]} className="relative">
        <span aria-hidden className="absolute -left-1 -top-5 font-display text-7xl leading-none text-leaf/30">“</span>
        <p className="relative whitespace-pre-line text-[17px] leading-relaxed text-mist/85">{showing}</p>
      </blockquote>
      {translation && (
        <p className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[11px] text-mist/65">
          <Languages size={12} aria-hidden />
          {!original && <span>{t.translatedFrom(dict.lang[r.lang])} ·</span>}
          <button type="button" className="text-leaf underline-offset-2 hover:underline" aria-pressed={original} onClick={() => setOriginal((v) => !v)}>
            {original ? t.showTranslation : t.showOriginal}
          </button>
        </p>
      )}
      <figcaption className="mt-5 flex items-start gap-3 border-t border-mist/10 pt-4">
        <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-moss font-display text-lg font-extrabold text-leaf">
          {initials(r.name)}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{r.name}</span>
          <span className="line-clamp-2 block text-xs text-mist/65" title={r.headline}>{r.headline}</span>
          <span className="mt-1 block font-mono text-[11px] text-mist/65">
            {t.relation[r.relation]}{date && ` · ${date}`}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
