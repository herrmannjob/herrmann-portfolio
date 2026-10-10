import type { Settings } from "@/lib/types";
import { ArrowUpRight, Mail } from "lucide-react";
import { Github, Linkedin, Twitch } from "./BrandIcons";
import { Clock } from "./Clock";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function Contact({ settings, commit, locale }: { settings: Settings; commit: string; locale: Locale }) {
  const t = getDictionary(locale).contact;
  const links = [
    settings.links.linkedin && { href: settings.links.linkedin, label: "LinkedIn", Icon: Linkedin },
    settings.links.github && { href: settings.links.github, label: "GitHub", Icon: Github },
    settings.links.twitch && { href: settings.links.twitch, label: "Twitch", Icon: Twitch },
    settings.links.website && { href: settings.links.website, label: t.website, Icon: ArrowUpRight },
  ].filter(Boolean) as Array<{ href: string; label: string; Icon: (p: { size?: number }) => React.ReactElement }>;

  return (
    <section id="contact" className="relative isolate scroll-mt-16 overflow-hidden bg-leaf text-ink">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(to_right,rgb(7_16_12/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(7_16_12/0.12)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="container-x py-24 sm:py-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/70">{t.eyebrow}</p>
        {settings.availability.open && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-leaf">
            <span className="h-2 w-2 rounded-full bg-leaf" /> {settings.availability.text}
          </p>
        )}
        <h2 className="display mt-8 text-[18vw] sm:text-[15vw] lg:text-[11rem]">
          {t.titleA}
          <br />
          {t.titleB}
        </h2>
        <div className="mt-14 grid gap-10 border-t border-ink/20 pt-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="group inline-flex items-center gap-3 break-all font-display text-4xl font-extrabold sm:text-6xl">
                <Mail className="h-8 w-8 shrink-0 sm:h-12 sm:w-12" />
                <span className="border-b-4 border-ink/0 transition-colors group-hover:border-ink">{settings.email}</span>
              </a>
            )}
            {settings.phone && <p className="mt-3 font-mono text-sm text-ink/70">{settings.phone}</p>}
          </div>
          <ul className="flex flex-wrap gap-3">
            {links.map(({ href, label, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border-2 border-ink px-4 py-2.5 font-semibold transition-colors hover:bg-ink hover:text-leaf">
                  <Icon size={16} /> {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <footer className="border-t border-ink/20">
        <div className="container-x flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 font-mono text-[11px] text-ink/70">
          <span>© {new Date().getFullYear()} {settings.displayName} ({settings.name}) · {settings.company.name}</span>
          <span>
            {settings.location} · <Clock timeZone={settings.timezone} />
          </span>
          <span>build {commit} · {t.deployed}</span>
        </div>
      </footer>
    </section>
  );
}
