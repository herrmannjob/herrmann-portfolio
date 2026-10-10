import type { Media, Work } from "./types";
import { DEFAULT_LOCALE, type Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";

export function formatYM(ym: string, locale: Locale = DEFAULT_LOCALE): string {
  if (!ym) return "";
  const [y, mo] = ym.split("-");
  if (!mo) return locale === "zh" ? `${y}年` : y!;
  return locale === "zh" ? `${y}年${Number(mo)}月` : `${getDictionary(locale).date.months[Number(mo) - 1]} ${y}`;
}

export function formatPeriod(w: Pick<Work, "start" | "end">, locale: Locale = DEFAULT_LOCALE): string {
  if (!w.start && !w.end) return "";
  const end = w.end ? formatYM(w.end, locale) : getDictionary(locale).date.present;
  return w.start ? `${formatYM(w.start, locale)} — ${end}` : end;
}

export function yearSpan(w: Pick<Work, "start" | "end">, locale: Locale = DEFAULT_LOCALE): string {
  const s = w.start.slice(0, 4);
  const e = w.end ? w.end.slice(0, 4) : getDictionary(locale).date.now;
  if (!s) return w.end ? e : "—";
  return s === e ? s : `${s}—${e}`;
}

/** Months between start and end (or now). Used for "duration" labels. */
export function durationLabel(w: Pick<Work, "start" | "end">, locale: Locale = DEFAULT_LOCALE, now = new Date()): string {
  if (!w.start || w.start.length < 7) return "";
  const [sy, sm] = w.start.split("-").map(Number);
  const [ey, em] = w.end && w.end.length >= 7 ? w.end.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const months = (ey! - sy!) * 12 + (em! - sm!) + 1;
  return getDictionary(locale).date.duration(Math.floor(months / 12), months % 12);
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function initials(name: string): string {
  return name
    .replace(/[^\p{L}\p{N}\s&]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function mediaMap(media: Media[]): Map<string, Media> {
  return new Map(media.map((m) => [m.id, m]));
}

/** Short stable hash used as a fake "commit" id in the UI. */
export function shortHash(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}
