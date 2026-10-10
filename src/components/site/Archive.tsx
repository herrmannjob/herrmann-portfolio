"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { ResolvedWork } from "@/lib/queries";
import type { WorkKind } from "@/lib/types";
import { useDictionary, useLocale } from "@/lib/i18n/client";
import { yearSpan } from "@/lib/format";

type Row = ResolvedWork & { hasCase: boolean };
type Sort = "recent" | "oldest" | "az";

const FILTERS = [
  { id: "all", label: "all" },
  { id: "role", label: "roles" },
  { id: "client", label: "clients" },
  { id: "project", label: "projects" },
] as const satisfies ReadonlyArray<{ id: "all" | WorkKind; label: string }>;

export function Archive({ rows }: { rows: Row[] }) {
  const reduce = useReducedMotion();
  const locale = useLocale();
  const dict = useDictionary();
  const t = dict.archive;
  const [kind, setKind] = useState<"all" | WorkKind>("all");
  const [sector, setSector] = useState("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [hover, setHover] = useState<Row | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const listRef = useRef<HTMLDivElement>(null);

  const sectors = useMemo(() => Array.from(new Set(rows.flatMap((r) => r.sectors))).sort(), [rows]);

  const visible = useMemo(() => {
    const out = rows.filter((r) => (kind === "all" || r.kind === kind) && (sector === "all" || r.sectors.includes(sector)));
    const key = (r: Row) => r.start || "0000";
    if (sort === "az") out.sort((a, b) => a.company.localeCompare(b.company, locale));
    else if (sort === "oldest") out.sort((a, b) => key(a).localeCompare(key(b)) || a.order - b.order);
    else out.sort((a, b) => a.order - b.order);
    return out;
  }, [rows, kind, sector, sort, locale]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    rows.forEach((r) => (c[r.kind] = (c[r.kind] ?? 0) + 1));
    return c;
  }, [rows]);

  return (
    <section id="archive" className="relative scroll-mt-16 bg-paper py-24 text-ink sm:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-forest">{t.eyebrow}</p>
            <h2 className="display mt-3 text-6xl sm:text-8xl">git log --all</h2>
          </div>
          <p className="max-w-md text-ink/60">
            {t.lead(rows.length)}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-y border-ink/15 py-4">
          <div role="group" aria-label={t.filterByType} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setKind(f.id)}
                aria-pressed={kind === f.id}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
                  kind === f.id ? "border-ink bg-ink text-paper" : "border-ink/20 text-ink/70 hover:border-ink"
                }`}
              >
                {t[f.label]} <span className="tabular-nums">{counts[f.id] ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="archive-sector">{t.sector}</label>
            <select
              id="archive-sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="rounded-md border border-ink/20 bg-transparent px-3 py-1.5 font-mono text-xs"
            >
              <option value="all">{t.allSectors}</option>
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="archive-sort">{t.sort}</label>
            <select
              id="archive-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-md border border-ink/20 bg-transparent px-3 py-1.5 font-mono text-xs"
            >
              <option value="recent">{t.recent}</option>
              <option value="oldest">{t.oldest}</option>
              <option value="az">{t.az}</option>
            </select>
          </div>
        </div>

        <div
          ref={listRef}
          className="relative"
          onMouseMove={(e) => {
            const r = listRef.current?.getBoundingClientRect();
            if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
          }}
          onMouseLeave={() => setHover(null)}
        >
          <div className="hidden grid-cols-[90px_1.2fr_1fr_1.3fr_90px_32px] gap-4 border-b border-ink/15 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/65 lg:grid">
            <span>{t.years}</span>
            <span>{t.company}</span>
            <span>{t.role}</span>
            <span>{t.productsStack}</span>
            <span>{t.type}</span>
            <span />
          </div>
          <motion.ul layout={!reduce}>
            <AnimatePresence initial={false}>
              {visible.map((r) => {
                const inner = (
                  <>
                    <span className="font-mono text-xs text-ink/60 lg:text-sm">{yearSpan(r, locale)}</span>
                    <span className="min-w-0">
                      <span className="display block text-3xl lg:truncate sm:text-4xl">{r.company}</span>
                      {r.via && <span className="font-mono text-[11px] text-ink/65">{r.via}</span>}
                    </span>
                    <span className="col-start-2 text-sm text-ink/75 lg:col-start-auto">{r.title}</span>
                    <span className="col-start-2 flex flex-wrap gap-1.5 lg:col-start-auto">
                      {r.products.slice(0, 3).map((p) => (
                        <span key={p} className="rounded-full bg-ink/[0.06] px-2 py-0.5 text-xs">{p}</span>
                      ))}
                      {r.tech.slice(0, 3).map((t) => (
                        <span key={t} className="rounded-full border border-ink/15 px-2 py-0.5 font-mono text-[11px] text-ink/60">{t}</span>
                      ))}
                    </span>
                    <span className="col-start-2 font-mono text-[11px] uppercase tracking-[0.14em] text-forest lg:col-start-auto">{dict.kind[r.kind]}</span>
                    <span className="hidden justify-self-end lg:block">
                      {r.hasCase && <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />}
                    </span>
                  </>
                );
                const cls =
                  "group grid grid-cols-[70px_1fr] gap-x-4 gap-y-2 border-b border-ink/15 py-5 transition-colors lg:grid-cols-[90px_1.2fr_1fr_1.3fr_90px_32px] lg:items-center lg:gap-4";
                return (
                  <motion.li
                    key={r.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onMouseEnter={() => setHover(r)}
                  >
                    {r.hasCase ? (
                      <Link href={`/work/${r.slug}`} className={`${cls} hover:bg-ink/[0.03]`}>
                        {inner}
                      </Link>
                    ) : (
                      <div className={cls}>{inner}</div>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
          {visible.length === 0 && <p className="py-10 font-mono text-sm text-ink/65">{t.empty}</p>}

          {/* Cursor-following preview (desktop, pointer devices only) */}
          <AnimatePresence>
            {hover?.cover && !reduce && (
              <motion.div
                key={hover.id}
                className="pointer-events-none absolute z-10 hidden w-72 overflow-hidden rounded-md border border-ink/10 shadow-2xl [@media(hover:hover)]:lg:block"
                style={{ left: pos.x + 24, top: pos.y - 90 }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.18 }}
              >
                <img src={hover.cover.src} alt="" referrerPolicy="no-referrer" className="aspect-[16/10] w-full object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
