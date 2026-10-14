"use client";

import { useId, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Media } from "@/lib/types";
import { Logo } from "@/components/media/Logo";
import { PhoneFan } from "@/components/media/PhoneFan";
import { useDictionary } from "@/lib/i18n/client";

export type ShowcaseApp = {
  slug: string;
  name: string;
  company: string;
  role: string;
  summary: string;
  accent: string;
  icon?: Media;
  shots: Media[];
  stores: Array<{ label: string; url: string }>;
};

/**
 * Apps in production: one stage, the real store screenshots of the selected
 * app fanned out on its brand color. Switching apps is the only motion.
 */
export function AppShowcase({ apps }: { apps: ShowcaseApp[] }) {
  const t = useDictionary().apps;
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const base = useId();
  if (!apps.length) return null;
  const app = apps[active]!;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next = e.key === "Home" ? 0 : e.key === "End" ? apps.length - 1 : (i + d + apps.length) % apps.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="apps" aria-labelledby={`${base}-title`} className="relative scroll-mt-16 border-t border-mist/10 py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-mist/10 pb-8">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 id={`${base}-title`} className="display mt-3 text-6xl sm:text-8xl">
              {t.title}
            </h2>
          </div>
          <p className="max-w-sm text-mist/60">{t.lead}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-10">
          <div role="tablist" aria-label={t.choose} aria-orientation="vertical" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {apps.map((a, i) => (
              <button
                key={a.name}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`${base}-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-controls={`${base}-panel`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={`flex shrink-0 items-center gap-3 rounded-xl border p-2.5 pr-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf lg:pr-3 ${
                  i === active ? "border-mist/25 bg-panel" : "border-transparent hover:bg-panel/60"
                }`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[22%] bg-panel ring-1 ring-mist/10">
                  {a.icon ? <Logo media={a.icon} name={a.name} tone="color" className="h-11 w-11" /> : <span className="font-display text-lg">{a.name[0]}</span>}
                </span>
                <span className="min-w-0">
                  <span className={`block truncate font-semibold ${i === active ? "text-mist" : "text-mist/70"}`}>{a.name}</span>
                  <span className="block truncate text-xs text-mist/65">{a.company === a.name ? "iOS · Android" : a.company}</span>
                </span>
              </button>
            ))}
          </div>

          <div
            id={`${base}-panel`}
            role="tabpanel"
            aria-labelledby={`${base}-tab-${active}`}
            className="relative grid overflow-hidden rounded-2xl border border-mist/10 lg:grid-cols-[1fr_minmax(0,0.9fr)]"
            style={{ background: `radial-gradient(90% 120% at 70% 100%, ${app.accent}55 0%, #0B1611 62%)` }}
          >
            <div className="relative z-10 flex flex-col justify-between gap-8 p-6 sm:p-10">
              <div key={app.name} className="animate-fadeIn motion-reduce:animate-none">
                {app.company !== app.name && <p className="text-sm text-mist/65">{app.company}</p>}
                <h3 className="display mt-2 text-5xl sm:text-7xl">{app.name}</h3>
                <p className="mt-3 font-mono text-sm text-leaf">{app.role}</p>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-mist/80">{app.summary}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {app.stores.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="btn-ghost bg-ink/40 backdrop-blur">
                    {s.label} <ArrowUpRight size={14} aria-hidden />
                  </a>
                ))}
                <Link href={`/work/${app.slug}`} className="btn-primary">
                  {t.openCase}
                </Link>
              </div>
            </div>

            <PhoneFan key={app.name} shots={app.shots} className="min-h-[420px] px-4 pt-10 sm:min-h-[560px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
