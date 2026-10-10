import type { Metadata, Viewport } from "next";
import "@fontsource/big-shoulders-display/700";
import "@fontsource/big-shoulders-display/800";
import "@fontsource/big-shoulders-display/900";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { getContent } from "@/lib/store";
import { getLocale } from "@/lib/i18n/server";
import { LOCALE_TAG } from "@/lib/i18n/config";
import { localizeSettings } from "@/lib/i18n/content";
import { LocaleProvider } from "@/lib/i18n/client";

export const viewport: Viewport = { themeColor: "#07100C", colorScheme: "dark" };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const settings = localizeSettings((await getContent()).settings, locale);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(base),
    title: { default: settings.seo.title, template: `%s — ${settings.displayName}` },
    authors: [{ name: `${settings.displayName} (${settings.name})` }],    description: settings.seo.description,
    openGraph: {
      type: "website",
      title: settings.seo.title,
      description: settings.seo.description,
      siteName: settings.displayName,
      locale: LOCALE_TAG[locale].replace("-", "_"),
    },
    twitter: { card: "summary_large_image", title: settings.seo.title, description: settings.seo.description },
    icons: { icon: "/icon.svg" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={LOCALE_TAG[locale]}>
      <body className="min-h-screen font-sans">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
