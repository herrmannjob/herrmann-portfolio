import type { Milestone } from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "./Reveal";

/** Career timeline — a real sequence, so the years carry the layout. */
export function Journey({ items, locale }: { items: Milestone[]; locale: Locale }) {
  if (!items.length) return null;
  const t = getDictionary(locale).journey;
  const last = items.length - 1;
  return (
    <section id="journey" aria-labelledby="journey-title" className="relative scroll-mt-16 border-t border-mist/10 bg-night py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">{t.eyebrow}</p>
              <h2 id="journey-title" className="display mt-3 text-6xl sm:text-8xl">
                {t.title}
              </h2>
              <p className="mt-6 max-w-sm text-mist/65">{t.lead}</p>
            </div>
          </div>

          <ol className="relative lg:col-span-8">
            {/* the line runs from the first year to "now" */}
            <span aria-hidden className="absolute bottom-8 left-[7px] top-3 w-px bg-gradient-to-b from-mint/60 via-mist/15 to-leaf sm:left-[9px]" />
            {items.map((m, i) => (
              <li key={`${m.year}-${m.title}`} className="relative grid grid-cols-[24px_1fr] gap-x-5 pb-12 last:pb-0 sm:grid-cols-[28px_1fr] sm:gap-x-8">
                <span
                  aria-hidden
                  className={`relative mt-2.5 h-[15px] w-[15px] rounded-full border-2 sm:h-[19px] sm:w-[19px] ${
                    i === last ? "border-leaf bg-leaf shadow-[0_0_0_6px_rgba(168,217,101,.15)]" : "border-mint bg-night"
                  }`}
                />
                <Reveal>
                  <p className={`display text-5xl sm:text-7xl ${i === last ? "text-leaf" : "text-mist/90"}`}>{m.year}</p>
                  <h3 className="mt-2 text-xl font-semibold sm:text-2xl">{m.title}</h3>
                  {m.text && <p className="mt-2 max-w-2xl leading-relaxed text-mist/65">{m.text}</p>}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
