import "server-only";
import { getContent } from "./store";
import type { Media, Work } from "./types";
import { DEFAULT_LOCALE, type Locale } from "./i18n/config";
import { localizeSettings, localizeWork } from "./i18n/content";

export type ResolvedApp = { name: string; icon?: Media; shots: Media[]; links: Work["apps"][number]["links"] };

export type ResolvedWork = Work & {
  logo?: Media;
  cover?: Media;
  images: Media[];
  /** Store apps with their icon and screenshots resolved */
  storeApps: ResolvedApp[];
};

function sortWorks(a: Work, b: Work) {
  return a.order - b.order;
}

export async function getSite(locale: Locale = DEFAULT_LOCALE) {
  const content = await getContent();
  const byId = new Map(content.media.map((m) => [m.id, m]));
  const resolve = (w: Work): ResolvedWork => ({
    ...localizeWork(w, locale),
    logo: w.logoId ? byId.get(w.logoId) : undefined,
    cover: w.coverId ? byId.get(w.coverId) : undefined,
    images: w.gallery.map((id) => byId.get(id)).filter((m): m is Media => Boolean(m)),
    storeApps: w.apps.map((a) => ({
      name: a.name,
      icon: a.iconId ? byId.get(a.iconId) : undefined,
      shots: a.shots.map((id) => byId.get(id)).filter((m): m is Media => Boolean(m)),
      links: a.links,
    })),
  });
  const published = content.works.filter((w) => w.published).sort(sortWorks).map(resolve);
  return {
    settings: localizeSettings(content.settings, locale),
    photo: content.settings.photoId ? byId.get(content.settings.photoId) : undefined,
    works: published,
    featured: published.filter((w) => w.featured),
    media: byId,
  };
}

export async function getWorkBySlug(slug: string, locale: Locale = DEFAULT_LOCALE) {
  const site = await getSite(locale);
  const idx = site.works.findIndex((w) => w.slug === slug);
  if (idx === -1) return null;
  // Case pages exist for roles and projects, plus any client with real content.
  const casePages = site.works.filter(hasCasePage);
  const ci = casePages.findIndex((w) => w.slug === slug);
  return {
    site,
    work: site.works[idx]!,
    prev: ci > 0 ? casePages[ci - 1] : casePages[casePages.length - 1],
    next: ci >= 0 && ci < casePages.length - 1 ? casePages[ci + 1] : casePages[0],
  };
}

export function hasCasePage(w: Pick<Work, "kind" | "description" | "highlights" | "gallery" | "coverId">): boolean {
  if (w.kind !== "client") return true;
  return Boolean(w.description || w.highlights.length || w.gallery.length || w.coverId);
}
