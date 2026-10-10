import type { Settings, Work } from "@/lib/types";
import type { Locale } from "./config";

/**
 * The CMS document is authored in English; `i18n.pt` / `i18n.es` hold
 * per-field overrides. Missing fields (or a missing translation entirely)
 * fall back to English, so a freshly added work still renders everywhere.
 */

const filled = <T,>(v: T | undefined): v is T =>
  v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0);

function pick<T>(override: T | undefined, base: T): T {
  return filled(override) ? override : base;
}

export function localizeWork<W extends Work>(w: W, locale: Locale): W {
  if (locale === "en") return w;
  const t = w.i18n?.[locale];
  if (!t) return w;
  return {
    ...w,
    title: pick(t.title, w.title),
    via: pick(t.via, w.via),
    products: pick(t.products, w.products),
    summary: pick(t.summary, w.summary),
    description: pick(t.description, w.description),
    location: pick(t.location, w.location),
    sectors: pick(t.sectors, w.sectors),
    highlights: pick(t.highlights, w.highlights),
    metrics: pick(t.metrics, w.metrics),
  };
}

export function localizeSettings(s: Settings, locale: Locale): Settings {
  if (locale === "en") return s;
  const t = s.i18n?.[locale];
  if (!t) return s;
  return {
    ...s,
    headline: pick(t.headline, s.headline),
    roles: pick(t.roles, s.roles),
    intro: pick(t.intro, s.intro),
    bio: pick(t.bio, s.bio),
    location: pick(t.location, s.location),
    availability: { ...s.availability, text: pick(t.availabilityText, s.availability.text) },
    company: { ...s.company, tagline: pick(t.companyTagline, s.company.tagline) },
    stats: pick(t.stats, s.stats),
    skills: s.skills.map((g, i) => ({ ...g, group: pick(t.skillGroups?.[i], g.group) })),
    education: pick(t.education, s.education),
    languages: pick(t.languages, s.languages),
    seo: t.seo ? { title: pick(t.seo.title, s.seo.title), description: pick(t.seo.description, s.seo.description) } : s.seo,
  };
}
