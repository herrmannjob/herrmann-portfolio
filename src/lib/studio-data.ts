import "server-only";
import type { Locale } from "./i18n/config";
import { formatPeriod } from "./format";
import type { getSite } from "./queries";
import type { StudioData } from "./summary";

type Site = Awaited<ReturnType<typeof getSite>>;

/** Minimal, already-localized payload for the Listen & watch dialog. */
export function buildStudioData(site: Site, locale: Locale): StudioData {
  const s = site.settings;
  const featuredIds = new Set(site.featured.map((w) => w.id));
  return {
    locale,
    displayName: s.displayName,
    fullName: s.name,
    headline: s.headline,
    roles: s.roles,
    intro: s.intro,
    bio: s.bio,
    location: s.location,
    email: s.email,
    availability: s.availability.open ? s.availability.text : "",
    // Only a same-origin portrait can be drawn into an exportable canvas.
    photoSrc: site.photo && !/^https?:/.test(site.photo.src) ? site.photo.src : undefined,
    stats: s.stats,
    skills: s.skills,
    featured: site.featured.map((w) => ({
      slug: w.slug,
      company: w.company,
      title: w.title,
      period: formatPeriod(w, locale),
      summary: w.summary,
      highlights: w.highlights,
      metrics: w.metrics,
      accent: w.accent,
    })),
    others: site.works.filter((w) => !featuredIds.has(w.id) && w.kind === "client").map((w) => w.company),
    recommendations: s.recommendations.map((r) => ({
      name: r.name,
      text: (locale !== r.lang && r.translations[locale]) || r.text,
    })),
  };
}
