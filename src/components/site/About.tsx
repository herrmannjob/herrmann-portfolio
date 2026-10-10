import type { Media, Settings } from "@/lib/types";
import { Img } from "@/components/media/Img";
import { Reveal } from "./Reveal";
import { ExternalLink } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function About({ settings, photo, locale }: { settings: Settings; photo?: Media; locale: Locale }) {
  const t = getDictionary(locale).about;
  return (
    <section id="about" className="relative scroll-mt-16 border-t border-mist/10 py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
        </Reveal>
        <div className="mt-6 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative">
                <Img media={photo} fallbackLabel={`${settings.displayName} — ${settings.name}`} className="aspect-[4/5] rounded-lg border border-mist/10" imgClassName="object-[50%_20%]" />
                <div className="absolute -bottom-5 left-5 right-5 rounded-md border border-mist/15 bg-ink/90 p-4 font-mono text-xs backdrop-blur">
                  <p className="text-mist">
                    <span className="text-mist/65">{t.fullName}: </span>
                    {settings.name}
                  </p>
                  <p className="mt-2 text-mint">{settings.company.name}</p>
                  <p className="mt-1 text-mist/70">{settings.company.tagline}</p>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="display text-5xl sm:text-7xl">
                {t.titleA} <span className="text-leaf">{t.titleB}</span> {t.titleC}
              </h2>
            </Reveal>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-mist/75">
              {settings.bio.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <ul className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-mist/10 bg-mist/10 lg:grid-cols-4">
          {settings.stats.map((s, i) => (
            <li key={s.label} className="bg-ink">
              <Reveal delay={i * 0.06} className="h-full p-5 sm:p-8">
                <p className="display text-[clamp(2.75rem,7vw,6.5rem)] text-leaf">{s.value}</p>
                <p className="mt-2 text-sm text-mist/70">{s.label}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-24 grid gap-14 lg:grid-cols-2">
          <Reveal>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-mint">{t.education}</h3>
            <ul className="mt-6">
              {settings.education.map((e) => (
                <li key={e.title} className="grid grid-cols-[110px_1fr] gap-4 border-t border-mist/10 py-4">
                  <span className="font-mono text-xs text-mist/65">{e.period}</span>
                  <span>
                    <span className="block font-semibold">{e.title}</span>
                    <span className="text-sm text-mist/60">{e.school}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-mint">{t.certifications}</h3>
            <ul className="mt-6">
              {settings.certifications.map((c) => (
                <li key={c.title} className="grid grid-cols-[110px_1fr] gap-4 border-t border-mist/10 py-4">
                  <span className="font-mono text-xs text-mist/65">{c.date}</span>
                  <span>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold hover:text-leaf">
                        {c.title} <ExternalLink size={13} />
                      </a>
                    ) : (
                      <span className="block font-semibold">{c.title}</span>
                    )}
                    <span className="block text-sm text-mist/60">{c.issuer}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
