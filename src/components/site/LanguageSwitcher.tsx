"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, LOCALE_NAME, LOCALES, type Locale } from "@/lib/i18n/config";
import { useDictionary, useLocale } from "@/lib/i18n/client";

/** One flag per language; the choice is stored in a cookie and overrides the browser language. */
export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useDictionary().nav;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div role="group" aria-label={t.language} className={`flex items-center gap-1 transition-opacity ${pending ? "opacity-60" : ""}`}>
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            lang={l}
            onClick={() => choose(l)}
            aria-pressed={active}
            aria-label={LOCALE_NAME[l]}
            title={LOCALE_NAME[l]}
            className={`grid h-8 w-7 place-items-center sm:w-8 rounded-md transition ${
              active ? "bg-mist/10 ring-1 ring-leaf/60" : "opacity-50 grayscale-[40%] hover:opacity-100 hover:grayscale-0"
            }`}
          >
            <Flag locale={l} />
          </button>
        );
      })}
    </div>
  );
}

function Flag({ locale }: { locale: Locale }) {
  const cls = "h-[14px] w-5 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.15)]";
  if (locale === "pt") {
    // Brazil
    return (
      <svg viewBox="0 0 20 14" className={cls} aria-hidden>
        <rect width="20" height="14" fill="#009C3B" />
        <path d="M10 1.6 18.2 7 10 12.4 1.8 7z" fill="#FFDF00" />
        <circle cx="10" cy="7" r="3.1" fill="#002776" />
        <path d="M7 6.3c2-.6 4.2-.3 6 .9" stroke="#fff" strokeWidth=".6" fill="none" />
      </svg>
    );
  }
  if (locale === "zh") {
    // China
    const star = "M0,-1 L0.2245,-0.309 L0.9511,-0.309 L0.3633,0.118 L0.5878,0.809 L0,0.382 L-0.5878,0.809 L-0.3633,0.118 L-0.9511,-0.309 L-0.2245,-0.309Z";
    return (
      <svg viewBox="0 0 20 14" className={cls} aria-hidden>
        <rect width="20" height="14" fill="#DE2910" />
        <path d={star} transform="translate(3.6 3.6) scale(2.1)" fill="#FFDE00" />
        {[
          [7, 1.4, 23],
          [8.4, 2.8, 45],
          [8.4, 4.8, 70],
          [7, 6.2, 20],
        ].map(([x, y, r]) => (
          <path key={`${x}-${y}`} d={star} transform={`translate(${x} ${y}) rotate(${r}) scale(0.7)`} fill="#FFDE00" />
        ))}
      </svg>
    );
  }
  if (locale === "es") {
    // Spain
    return (
      <svg viewBox="0 0 20 14" className={cls} aria-hidden>
        <rect width="20" height="14" fill="#AA151B" />
        <rect y="3.5" width="20" height="7" fill="#F1BF00" />
      </svg>
    );
  }
  // United States
  return (
    <svg viewBox="0 0 20 14" className={cls} aria-hidden>
      <rect width="20" height="14" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={i * (14 / 13)} width="20" height={14 / 13} fill="#B22234" />
      ))}
      <rect width="9" height={(14 / 13) * 7} fill="#3C3B6E" />
      {[1.5, 4.5, 7.5].map((x) =>
        [1.6, 3.8, 6].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r=".55" fill="#fff" />),
      )}
    </svg>
  );
}
