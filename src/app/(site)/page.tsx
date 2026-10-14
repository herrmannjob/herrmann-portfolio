import { getSite, hasCasePage } from "@/lib/queries";
import { shortHash } from "@/lib/format";
import { getLocale } from "@/lib/i18n/server";
import { Hero } from "@/components/site/Hero";
import { LogoMarquee } from "@/components/site/LogoMarquee";
import { SelectedWork } from "@/components/site/SelectedWork";
import { Archive } from "@/components/site/Archive";
import { Stack } from "@/components/site/Stack";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Recommendations } from "@/components/site/Recommendations";
import { AppShowcase, type ShowcaseApp } from "@/components/site/AppShowcase";
import { Journey } from "@/components/site/Journey";

export const dynamic = "force-dynamic";

const SHOWCASE_ORDER = ["grupo-madero", "pacto-solucoes", "lojas-lebes", "taqtaq"];

export default async function Home() {
  const locale = await getLocale();
  const site = await getSite(locale);
  const commit = shortHash(site.works.map((w) => w.updatedAt).join("|") + site.settings.name);
  const rows = site.works.map((w) => ({ ...w, hasCase: hasCasePage(w) }));
  const apps: ShowcaseApp[] = site.works.flatMap((w) =>
    w.storeApps.map((a) => ({
      slug: w.slug,
      name: a.name,
      company: [w.company, w.via].filter(Boolean).join(" · "),
      role: w.title,
      summary: w.summary,
      accent: w.accent,
      icon: a.icon,
      shots: a.shots,
      stores: a.links,
    })),
  )
    // Most-used apps first: the ones with the largest public audiences lead the showcase
    .sort((a, b) => SHOWCASE_ORDER.indexOf(a.slug) - SHOWCASE_ORDER.indexOf(b.slug));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.settings.name,
    alternateName: site.settings.displayName,
    jobTitle: site.settings.headline,
    email: site.settings.email ? `mailto:${site.settings.email}` : undefined,
    address: { "@type": "PostalAddress", addressLocality: site.settings.location },
    sameAs: Object.values(site.settings.links).filter(Boolean),
    worksFor: { "@type": "Organization", name: site.settings.company.name },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero settings={site.settings} photo={site.photo} commit={commit} locale={locale} />
      <LogoMarquee works={site.works} locale={locale} />
      <SelectedWork works={site.featured} locale={locale} />
      <AppShowcase apps={apps} />
      {/* keyed: sector filters are localized strings, so reset them on language change */}
      <Archive key={locale} rows={rows} />
      <Stack settings={site.settings} locale={locale} />
      <Journey items={site.settings.journey} locale={locale} />
      <About settings={site.settings} photo={site.photo} locale={locale} />
      <Recommendations
        items={site.settings.recommendations}
        profileUrl={site.settings.links.linkedin ? `${site.settings.links.linkedin.replace(/\/$/, "")}/details/recommendations/` : "https://www.linkedin.com/"}
      />
      <Contact settings={site.settings} commit={commit} locale={locale} />
    </>
  );
}
