import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResolvedWork } from "@/lib/queries";
import { durationLabel, formatPeriod, slugify, yearSpan } from "@/lib/format";
import { Img } from "@/components/media/Img";
import { Logo } from "@/components/media/Logo";
import { Reveal } from "./Reveal";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Layout = "bleed" | "split" | "terminal" | "split-rev";
const CYCLE: Layout[] = ["bleed", "split", "terminal", "split-rev"];

export function SelectedWork({ works, locale }: { works: ResolvedWork[]; locale: Locale }) {
  const t = getDictionary(locale).selected;
  return (
    <section id="work" className="relative scroll-mt-16 py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-mist/10 pb-8">
            <div>
              <p className="eyebrow">{t.eyebrow}</p>
              <h2 className="display mt-3 text-6xl sm:text-8xl">
                {t.titleA} <span className="text-outline">{t.titleB}</span>
              </h2>
            </div>
            <p className="max-w-sm text-mist/60">
              {t.lead}
            </p>
          </div>
        </Reveal>

        <ol className="mt-16 space-y-24 sm:space-y-32">
          {works.map((w, i) => {
            const layout = CYCLE[i % CYCLE.length]!;
            const n = String(i + 1).padStart(3, "0");
            return (
              <li key={w.id}>
                <Reveal>
                  {layout === "bleed" && <Bleed w={w} n={n} l={locale} />}
                  {(layout === "split" || layout === "split-rev") && <Split w={w} n={n} l={locale} reverse={layout === "split-rev"} />}
                  {layout === "terminal" && <Terminal w={w} n={n} l={locale} />}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Meta({ w, n, l }: { w: ResolvedWork; n: string; l: Locale }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-mist/60">
      <span className="text-leaf">{n}</span>
      <span>{formatPeriod(w, l)}</span>
      {durationLabel(w, l) && <span className="text-mist/65">{durationLabel(w, l)}</span>}
      {w.sectors.slice(0, 2).map((s) => (
        <span key={s}>#{slugify(s)}</span>
      ))}
    </div>
  );
}

function Metrics({ w, dark = true }: { w: ResolvedWork; dark?: boolean }) {
  if (!w.metrics.length) return null;
  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-4">
      {w.metrics.map((m) => (
        <div key={m.label}>
          <dt className="sr-only">{m.label}</dt>
          <dd className={`display text-6xl ${dark ? "text-leaf" : "text-ink"}`}>{m.value}</dd>
          <dd className={`mt-1 max-w-[16rem] text-sm ${dark ? "text-mist/60" : "text-ink/70"}`}>{m.label}</dd>
        </div>
      ))}
    </dl>
  );
}

function CaseLink({ w, l, className = "" }: { w: ResolvedWork; l: Locale; className?: string }) {
  return (
    <Link href={`/work/${w.slug}`} className={`group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] ${className}`}>
      {getDictionary(l).selected.openCase}
      <span className="grid h-8 w-8 place-items-center rounded-full border border-current transition-transform group-hover:rotate-45">
        <ArrowUpRight size={14} />
      </span>
    </Link>
  );
}

/* Full-bleed 21:9 cover with title overlay */
function Bleed({ w, n, l }: { w: ResolvedWork; n: string; l: Locale }) {
  const openCase = getDictionary(l).selected.openCase;
  return (
    <article className="group">
      <Link href={`/work/${w.slug}`} className="relative block overflow-hidden rounded-lg border border-mist/10" aria-label={`${w.company} — ${openCase}`}>
        <Img
          media={w.cover}
          fallbackLabel={w.company}
          accent={w.accent}
          className="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]"
          imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
          <div>
            <Meta w={w} n={n} l={l} />
            <h3 className="display mt-3 text-[15vw] sm:text-8xl lg:text-[9rem]">{w.company}</h3>
            <p className="mt-2 text-lg text-mist/80">{w.title}</p>
          </div>
          <div className="flex flex-col items-start gap-5 lg:items-end">
            {w.products.length > 0 && (
              <ul className="flex flex-wrap gap-2 lg:justify-end">
                {w.products.map((p) => (
                  <li key={p} className="chip border-mist/30 bg-ink/40 backdrop-blur">{p}</li>
                ))}
              </ul>
            )}
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-leaf">
              {openCase} <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </Link>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-mist/70">{w.summary}</p>
    </article>
  );
}

/* Image + accent panel */
function Split({ w, n, l, reverse }: { w: ResolvedWork; n: string; l: Locale; reverse?: boolean }) {
  const openCase = getDictionary(l).selected.openCase;
  return (
    <article className={`grid gap-0 overflow-hidden rounded-lg border border-mist/10 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <Link href={`/work/${w.slug}`} className="group relative block min-h-0 min-w-0" aria-label={`${w.company} — ${openCase}`}>
        <Img
          media={w.cover}
          fallbackLabel={w.company}
          accent={w.accent}
          className="aspect-[4/3] w-full lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
          imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
        />
        {w.logo && (
          <div className="absolute left-4 top-4 rounded-md bg-ink/70 px-3 py-2 backdrop-blur">
            <Logo media={w.logo} name={w.company} className="h-6 w-auto max-w-[120px]" />
          </div>
        )}
      </Link>
      <div className="flex flex-col justify-between gap-10 bg-leaf p-6 text-ink sm:p-10">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/70">
            <span className="font-bold">{n}</span>
            <span>{formatPeriod(w, l)}</span>
            {w.via && <span>{w.via}</span>}
          </div>
          <h3 className="display mt-4 text-7xl sm:text-8xl">{w.company}</h3>
          <p className="mt-2 font-semibold">{w.title}</p>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80">{w.summary}</p>
        </div>
        <div className="space-y-8">
          <Metrics w={w} dark={false} />
          {!w.metrics.length && w.highlights.length > 0 && (
            <ul className="space-y-2 border-t border-ink/15 pt-5">
              {w.highlights.slice(0, 3).map((h) => (
                <li key={h} className="flex gap-3 text-ink/80">
                  <span className="font-mono text-ink/50">→</span>
                  {h}
                </li>
              ))}
            </ul>
          )}
          <CaseLink w={w} l={l} className="text-ink" />
        </div>
      </div>
    </article>
  );
}

/* Code-editor card */
function Terminal({ w, n, l }: { w: ResolvedWork; n: string; l: Locale }) {
  const varName = slugify(w.company).replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase()).replace(/^\d/, "_$&") || "work";
  const imgs = [w.cover, ...w.images].filter(Boolean).slice(0, 3);
  return (
    <article className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-lg border border-mist/10 bg-panel">
        <div className="flex items-center justify-between border-b border-mist/10 px-4 py-2.5 font-mono text-[11px] text-mist/65">
          <span>{slugify(w.company)}.ts</span>
          <span className="text-leaf">{n}</span>
        </div>
        <pre tabIndex={0} aria-label={`${slugify(w.company)}.ts`} className="overflow-x-auto p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf font-mono text-[13px] leading-7 sm:p-7 sm:text-sm">
          <code>
            <span className="text-mint">export const</span> <span className="text-signal">{varName}</span> = {"{"}
            {"\n"}  role: <S>{w.title}</S>,
            {"\n"}  period: <S>{yearSpan(w, l)}</S>,
            {w.via ? (
              <>
                {"\n"}  via: <S>{w.via}</S>,
              </>
            ) : null}
            {w.products.length > 0 && (
              <>
                {"\n"}  products: [{w.products.map((p, i) => (
                  <span key={p}>
                    {i > 0 && ", "}
                    <S>{p}</S>
                  </span>
                ))}],
              </>
            )}
            {"\n"}  stack: [{w.tech.slice(0, 6).map((t, i) => (
              <span key={t}>
                {i > 0 && ", "}
                <S>{t}</S>
              </span>
            ))}],
            {w.metrics.map((m) => (
              <span key={m.label}>
                {"\n"}  <span className="text-mist/65">{"// "}{m.label}</span>
                {"\n"}  impact: <span className="text-leaf">{m.value}</span>,
              </span>
            ))}
            {"\n"}
            {"}"};
          </code>
        </pre>
        <div className="border-t border-mist/10 p-5 sm:p-7">
          <h3 className="display text-6xl sm:text-7xl">{w.company}</h3>
          <p className="mt-4 max-w-xl leading-relaxed text-mist/70">{w.summary}</p>
          <CaseLink w={w} l={l} className="mt-6 text-leaf" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {imgs.map((img, i) => (
          <Img
            key={img!.id}
            media={img}
            fallbackLabel={w.company}
            accent={w.accent}
            className={`rounded-lg border border-mist/10 ${i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"}`}
          />
        ))}
        {imgs.length === 0 && <Img fallbackLabel={w.company} accent={w.accent} className="col-span-2 aspect-[4/5] rounded-lg" />}
      </div>
    </article>
  );
}

function S({ children }: { children: React.ReactNode }) {
  return <span className="text-leaf">&quot;{children}&quot;</span>;
}
