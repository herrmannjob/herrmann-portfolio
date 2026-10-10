import type { Media, Settings } from "@/lib/types";
import { Img } from "@/components/media/Img";
import { MaskLine, Reveal } from "./Reveal";
import { Clock } from "./Clock";
import { ArrowDownRight, Clapperboard, Headphones } from "lucide-react";
import { StudioTrigger } from "./studio/StudioTrigger";
import { Github, Linkedin } from "./BrandIcons";
import { RoleTicker } from "./RoleTicker";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function Hero({ settings, photo, commit, locale }: { settings: Settings; photo?: Media; commit: string; locale: Locale }) {
  const since = 2014;
  const t = getDictionary(locale).hero;
  return (
    <section id="top" className="grain relative isolate min-h-[100svh] overflow-hidden pt-16">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_30%_40%,black_20%,transparent_75%)]" />
      <div
        aria-hidden
        className="absolute -right-40 -top-40 -z-10 h-[46rem] w-[46rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #0A7C15 0%, transparent 65%)" }}
      />

      <div className="container-x grid min-h-[calc(100svh-4rem)] grid-cols-12 items-end gap-x-6 gap-y-10 pb-24 pt-10 lg:items-center lg:pb-28">
        {/* Left: type */}
        <div className="col-span-12 lg:col-span-8">
          <Reveal>
            <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-leaf">●</span>
              <span>commit {commit}</span>
              <span className="text-mist/30">/</span>
              <span>main</span>
              <span className="text-mist/30">/</span>
              <span>
                {settings.location.split("—")[0]?.trim()} <Clock timeZone={settings.timezone} className="text-mist/80" />
              </span>
            </p>
          </Reveal>

          <h1 className="display mt-6 text-[21vw] sm:text-[17vw] lg:text-[clamp(6rem,11.5vw,13.5rem)]">
            <MaskLine delay={0.05} className="text-leaf">
              {settings.displayName}
              <span aria-hidden className="ml-[0.04em] inline-block h-[0.72em] w-[0.09em] translate-y-[0.02em] animate-blink bg-signal align-baseline" />
            </MaskLine>
          </h1>
          <Reveal delay={0.25}>
            <p className="mt-3 font-mono text-sm text-mist/70">
              <span className="text-mist/65">{t.fullName}: </span>
              <span className="text-mist">{settings.name}</span>
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div className="max-w-xl">
                <p className="font-mono text-sm text-leaf">
                  <span className="text-mist/65">$ whoami → </span>
                  <RoleTicker key={locale} roles={settings.roles} />
                </p>
                <p className="mt-4 text-lg leading-relaxed text-mist/80 sm:text-xl">{settings.intro}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#work" className="btn-primary">
                {t.seeWork} <ArrowDownRight size={16} />
              </a>
              <StudioTrigger tab="summary" className="btn-ghost">
                <Headphones size={16} aria-hidden /> {t.listen}
              </StudioTrigger>
              <StudioTrigger tab="video" className="btn-ghost">
                <Clapperboard size={16} aria-hidden /> {t.watch}
              </StudioTrigger>
              {settings.links.linkedin && (
                <a href={settings.links.linkedin} target="_blank" rel="noreferrer" className="btn-ghost">
                  <Linkedin size={16} /> LinkedIn
                </a>
              )}
              {settings.links.github && (
                <a href={settings.links.github} target="_blank" rel="noreferrer" className="btn-ghost">
                  <Github size={16} /> GitHub
                </a>
              )}
            </div>
          </Reveal>
        </div>

        {/* Right: portrait in an editor window */}
        <div className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-4 lg:col-start-9">
          <Reveal delay={0.25} y={40}>
            <figure className="relative overflow-hidden rounded-lg border border-mist/15 bg-panel shadow-[0_40px_120px_-40px_rgba(10,124,21,0.6)]">
              <figcaption className="flex items-center gap-2 border-b border-mist/10 px-3 py-2 font-mono text-[11px] text-mist/60">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 truncate">~/portrait/{settings.displayName.toLowerCase()}.jpg</span>
              </figcaption>
              <div className="relative aspect-[4/5]">
                <Img media={photo} fallbackLabel={settings.name} className="absolute inset-0" eager imgClassName="object-[50%_20%]" />
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div aria-hidden className="pointer-events-none absolute inset-x-0 h-24 animate-scan bg-gradient-to-b from-transparent via-leaf/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 font-mono text-[11px] text-mist/80">
                  <span>{settings.company.name}</span>
                  <span className="text-leaf">{t.since} {since}</span>
                </div>
              </div>
            </figure>
          </Reveal>
        </div>
      </div>

      {/* Editor status bar */}
      <div className="absolute inset-x-0 bottom-0 border-t border-mist/10 bg-ink/70 backdrop-blur">
        <div className="container-x flex h-9 items-center gap-5 overflow-hidden whitespace-nowrap font-mono text-[11px] text-mist/65">
          <span className="text-leaf">⎇ main</span>
          <span>✓ {t.buildPassing}</span>
          <span className="hidden sm:inline">{settings.headline}</span>
          <span className="ml-auto hidden md:inline">TypeScript · UTF-8 · LF</span>
          <a href="#work" className="text-mist/80 hover:text-leaf">{t.scroll}</a>
        </div>
      </div>
    </section>
  );
}
