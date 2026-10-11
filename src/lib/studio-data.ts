import type { Content, Media, Work } from "./types";
import type { Locale } from "./i18n/config";
import { formatPeriod } from "./format";
import { localizeSettings, localizeWork } from "./i18n/content";
import type { StudioData } from "./summary";

/**
 * Minimal, already-localized payload for the Listen & watch dialog.
 * Pure (no server-only imports) so the offline audio/video pipeline in
 * scripts/studio can build exactly the same narration as the site.
 */
export function buildStudioData(content: Content, locale: Locale): StudioData {
  const byId = new Map<string, Media>(content.media.map((m) => [m.id, m]));
  const s = localizeSettings(content.settings, locale);
  const works = content.works
    .filter((w) => w.published)
    .sort((a, b) => a.order - b.order)
    .map((w) => localizeWork(w, locale));
  const featured = works.filter((w) => w.featured);
  const featuredIds = new Set(featured.map((w) => w.id));
  const photo = s.photoId ? byId.get(s.photoId) : undefined;
  const src = (id: string) => (id ? byId.get(id)?.src : undefined);

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
    photoSrc: photo && !/^https?:/.test(photo.src) ? photo.src : undefined,
    stats: s.stats,
    skills: s.skills,
    featured: featured.map((w: Work) => ({
      slug: w.slug,
      company: w.company,
      title: w.title,
      period: formatPeriod(w, locale),
      summary: w.summary,
      highlights: w.highlights,
      metrics: w.metrics,
      accent: w.accent,
      logo: src(w.logoId),
      cover: src(w.coverId),
      images: w.gallery.map((id) => byId.get(id)?.src).filter((x): x is string => Boolean(x)),
    })),
    others: works.filter((w) => !featuredIds.has(w.id) && w.kind === "client").map((w) => w.company),
    recommendations: s.recommendations.map((r) => ({
      name: r.name,
      text: (locale !== r.lang && r.translations[locale]) || r.text,
    })),
  };
}
