import { Nav } from "@/components/site/Nav";
import { Studio } from "@/components/site/studio/Studio";
import { getSite } from "@/lib/queries";
import { buildStudioData } from "@/lib/studio-data";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const site = await getSite(locale);
  const t = getDictionary(locale);
  return (
    <>
      <a href="#main" className="sr-only z-[60] rounded bg-leaf px-3 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t.skip}
      </a>
      <Nav displayName={site.settings.displayName} fullName={site.settings.name} open={site.settings.availability.open} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Studio key={locale} data={buildStudioData(site, locale)} />
    </>
  );
}
