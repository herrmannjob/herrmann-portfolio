import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getWorkBySlug } from "@/lib/queries";
import { durationLabel, formatPeriod } from "@/lib/format";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Img } from "@/components/media/Img";
import { Logo } from "@/components/media/Logo";
import { Gallery } from "@/components/media/Gallery";
import { VideoEmbed } from "@/components/media/VideoEmbed";
import { MaskLine, Reveal } from "@/components/site/Reveal";
import { iconFor } from "@/components/site/Stack";
import { PhoneFan } from "@/components/media/PhoneFan";
import type { Media } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const data = await getWorkBySlug(slug, locale);
  if (!data) return { title: getDictionary(locale).work.notFound };
  const { work } = data;
  return {
    title: `${work.company}${work.title ? ` — ${work.title}` : ""}`,
    description: work.summary,
    openGraph: work.cover?.src.startsWith("http") ? { images: [work.cover.src] } : undefined,
  };
}

/** Phone screenshots fanned on the brand color — used when an app has no wide cover. */
function PhoneStage({ images, accent }: { images: Media[]; accent: string }) {
  return (
    <div
      className="overflow-hidden rounded-lg border border-mist/10"
      style={{ background: `radial-gradient(90% 120% at 50% 100%, ${accent}66 0%, #0B1611 65%)` }}
    >
      <PhoneFan shots={images} eager className="h-[440px] sm:h-[600px]" />
    </div>
  );
}

export default async function WorkPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.work;
  const data = await getWorkBySlug(slug, locale);
  if (!data) notFound();
  const { work: w, prev, next } = data;
  const paragraphs = w.description.split(/\n{2,}/).filter(Boolean);
  // Store apps open on their own screens; other works fall back to portrait gallery shots
  const appShots = w.storeApps[0]?.shots ?? [];
  const phones = appShots.length >= 2 ? appShots : w.images.filter((m) => m.width && m.height && m.height > m.width * 1.3).slice(0, 4);
  const facts = [
    { k: t.type, v: dict.kind[w.kind] },
    { k: t.period, v: formatPeriod(w, locale) },
    { k: t.duration, v: durationLabel(w, locale) },
    { k: t.role, v: w.title },
    { k: t.via, v: w.via },
    { k: t.location, v: w.location },
    { k: t.sectors, v: w.sectors.join(" · ") },
  ].filter((f) => f.v);

  return (
    <article>
      {/* Header */}
      <header className="relative isolate overflow-hidden pt-28">
        <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="container-x">
          <Link href="/#work" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-mist/60 hover:text-leaf">
            <ArrowLeft size={14} /> {t.allWork}
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {w.logo && (
              <span className="rounded-md border border-mist/15 bg-panel px-3 py-2">
                <Logo media={w.logo} name={w.company} className="h-6 w-auto max-w-[140px]" />
              </span>
            )}
            <span className="eyebrow">{[dict.kind[w.kind], formatPeriod(w, locale)].filter(Boolean).join(" · ")}</span>
          </div>
          <h1 className="display mt-6 break-words text-[16vw] sm:text-[12vw] lg:text-[10rem]">
            <MaskLine>{w.company}</MaskLine>
          </h1>
          {w.title && <p className="mt-4 font-mono text-sm text-leaf sm:text-base">{w.title}</p>}
        </div>
        <div className="container-x mt-12">
          {(!w.cover || appShots.length >= 2) && phones.length >= 2 ? (
            <PhoneStage images={phones} accent={w.accent} />
          ) : (
            <Img
              media={w.cover}
              fallbackLabel={w.company}
              accent={w.accent}
              eager
              className="aspect-[4/3] rounded-lg border border-mist/10 sm:aspect-[16/9] lg:aspect-[21/9]"
            />
          )}
        </div>
      </header>

      {/* Body */}
      <div className="container-x grid gap-14 py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <dl className="sticky top-24 divide-y divide-mist/10 border-y border-mist/10">
            {facts.map((f) => (
              <div key={f.k} className="grid grid-cols-[96px_1fr] gap-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist/65">{f.k}</dt>
                <dd className="text-sm">{f.v}</dd>
              </div>
            ))}
            {w.products.length > 0 && (
              <div className="grid grid-cols-[96px_1fr] gap-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist/65">{t.products}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {w.products.map((p) => (
                    <span key={p} className="chip">{p}</span>
                  ))}
                </dd>
              </div>
            )}
            {w.links.length > 0 && (
              <div className="grid grid-cols-[96px_1fr] gap-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist/65">{t.links}</dt>
                <dd className="flex flex-col gap-1.5">
                  {w.links.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-leaf hover:underline">
                      {l.label} <ArrowUpRight size={13} />
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="lg:col-span-8">
          {w.summary && (
            <Reveal>
              <p className="text-2xl leading-snug text-mist sm:text-3xl">{w.summary}</p>
            </Reveal>
          )}

          {w.metrics.length > 0 && (
            <Reveal>
              <dl className={`mt-14 grid gap-px overflow-hidden rounded-lg border border-mist/10 bg-mist/10 ${w.metrics.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {w.metrics.map((m) => (
                  <div key={m.label} className="bg-ink p-6">
                    <dd className="display text-7xl text-leaf sm:text-8xl">{m.value}</dd>
                    <dt className="mt-2 text-mist/60">{m.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {paragraphs.length > 0 && (
            <div className="mt-14 space-y-5 text-lg leading-relaxed text-mist/75">
              {paragraphs.map((p, i) => (
                <Reveal key={i}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          )}

          {w.highlights.length > 0 && (
            <Reveal>
              <h2 className="mt-16 font-mono text-xs uppercase tracking-[0.2em] text-mint">{t.highlights}</h2>
              <ol className="mt-5">
                {w.highlights.map((h, i) => (
                  <li key={h} className="grid grid-cols-[48px_1fr] gap-3 border-t border-mist/10 py-4">
                    <span className="font-mono text-xs text-leaf">{String(i + 1).padStart(2, "0")}</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          )}

          {w.tech.length > 0 && (
            <Reveal>
              <h2 className="mt-16 font-mono text-xs uppercase tracking-[0.2em] text-mint">{t.stack}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {w.tech.map((t) => {
                  const icon = iconFor(t);
                  return (
                    <li key={t} className="chip gap-2 py-1.5 text-[12px]">
                      {icon && <img src={icon} alt="" className="h-3.5 w-3.5 invert opacity-80" />}
                      {t}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          )}
        </div>
      </div>

      {w.video && (
        <section aria-labelledby="case-video" className="container-x pb-16">
          <h2 id="case-video" className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-mint">{t.video}</h2>
          <VideoEmbed url={w.video} title={`${w.company} — ${t.video}`} />
        </section>
      )}

      {w.images.length > 0 && (
        <section aria-label={t.gallery} className="container-x pb-20">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-mint">{t.gallery}</h2>
          <Gallery images={w.images} label={w.company} accent={w.accent} />
        </section>
      )}

      {/* Prev / next */}
      <nav aria-label={t.more} className="border-t border-mist/10">
        <div className="container-x grid sm:grid-cols-2">
          {prev && prev.slug !== w.slug && (
            <Link href={`/work/${prev.slug}`} className="group border-mist/10 py-10 sm:border-r sm:pr-8">
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-mist/65">
                <ArrowLeft size={14} /> {t.previous}
              </span>
              <span className="display mt-3 block text-5xl transition-colors group-hover:text-leaf sm:text-6xl">{prev.company}</span>
            </Link>
          )}
          {next && next.slug !== w.slug && (
            <Link href={`/work/${next.slug}`} className="group py-10 text-right sm:col-start-2 sm:pl-8">
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-mist/65">
                {t.next} <ArrowRight size={14} />
              </span>
              <span className="display mt-3 block text-5xl transition-colors group-hover:text-leaf sm:text-6xl">{next.company}</span>
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
