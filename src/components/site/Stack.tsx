import type { Settings } from "@/lib/types";
import { Reveal } from "./Reveal";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Local SVGs from Simple Icons (CC0) in /public/icons. */
const ICONS: Record<string, string> = {
  angular: "angular",
  typescript: "typescript",
  react: "react",
  "vue.js": "vuedotjs",
  nuxt: "nuxt",
  python: "python",
  "c# / .net": "dotnet",
  ".net": "dotnet",
  "node.js": "nodedotjs",
  nestjs: "nestjs",
  fastapi: "fastapi",
  flutter: "flutter",
  kotlin: "kotlin",
  "tailwind css": "tailwindcss",
  docker: "docker",
  kubernetes: "kubernetes",
  "claude code": "claude",
};

export function iconFor(name: string): string | null {
  const k = ICONS[name.toLowerCase()];
  return k ? `/icons/${k}.svg` : null;
}

export function Stack({ settings, locale }: { settings: Settings; locale: Locale }) {
  const t = getDictionary(locale).stack;
  return (
    <section id="stack" className="relative scroll-mt-16 border-t border-mist/10 py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="display mt-3 text-6xl sm:text-8xl">
            package<span className="text-leaf">.json</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-mist/10 bg-mist/10 sm:grid-cols-2 lg:grid-cols-3">
          {settings.skills.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.05} className="bg-ink">
              <div className="h-full p-6 sm:p-8">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-3xl font-extrabold uppercase">{g.group}</h3>
                  <span className="font-mono text-[11px] text-mist/65">{String(g.items.length).padStart(2, "0")} {t.deps}</span>
                </div>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {g.items.map((item) => {
                    const icon = iconFor(item);
                    return (
                      <li key={item} className="chip gap-2 border-mist/15 py-1.5 text-[12px] text-mist/85">
                        {icon && <img src={icon} alt="" className="h-3.5 w-3.5 invert opacity-80" />}
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.3} className="bg-moss">
            <div className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-leaf">{t.languages}</p>
              <ul className="space-y-2">
                {settings.languages.map((l) => (
                  <li key={l.name} className="flex items-baseline justify-between border-b border-mist/20 pb-2">
                    <span className="font-display text-3xl font-extrabold uppercase">{l.name}</span>
                    <span className="font-mono text-xs text-mist/80">{l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
