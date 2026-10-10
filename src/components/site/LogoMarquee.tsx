import type { ResolvedWork } from "@/lib/queries";
import { Logo } from "@/components/media/Logo";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function LogoMarquee({ works, locale }: { works: ResolvedWork[]; locale: Locale }) {
  const items = works.filter((w) => w.kind !== "project");
  if (!items.length) return null;
  const row = [...items, ...items];
  return (
    <section aria-label={getDictionary(locale).marquee} className="relative border-y border-mist/10 bg-night py-7">
      <p className="sr-only">{items.map((w) => w.company).join(", ")}</p>
      <div aria-hidden className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <ul className="flex shrink-0 animate-marquee items-center gap-14 pr-14 hover:[animation-play-state:paused]">
          {row.map((w, idx) => (
            <li key={`${w.id}-${idx}`} className="flex h-10 shrink-0 items-center opacity-60 transition-opacity hover:opacity-100">
              {w.logo ? (
                <Logo media={w.logo} name={w.company} className="h-7 w-auto max-w-[140px]" />
              ) : (
                <span className="font-display text-2xl font-extrabold uppercase tracking-tight text-mist">{w.company}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
