export const LOCALES = ["en", "pt", "es", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

/** BCP 47 tag for <html lang>, Intl, speech synthesis and Open Graph */
export const LOCALE_TAG: Record<Locale, string> = { en: "en-US", pt: "pt-BR", es: "es-ES", zh: "zh-CN" };

/** Each language's name written in itself */
export const LOCALE_NAME: Record<Locale, string> = { en: "English", pt: "Português", es: "Español", zh: "中文" };

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}

/** Best supported locale from an Accept-Language header, honoring q-weights. */
export function matchAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag!.trim().toLowerCase(), q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter((x) => x.tag && x.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}
