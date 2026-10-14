"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Headphones, Menu, X } from "lucide-react";
import { useDictionary } from "@/lib/i18n/client";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { StudioTrigger } from "./studio/StudioTrigger";

const LINKS = [
  { href: "/#work", key: "work" },
  { href: "/#apps", key: "apps" },
  { href: "/#journey", key: "journey" },
  { href: "/#archive", key: "archive" },
  { href: "/#about", key: "about" },
  { href: "/#recommendations", key: "recommendations" },
  { href: "/#contact", key: "contact" },
] as const;

export function Nav({ displayName, fullName, open }: { displayName: string; fullName: string; open: boolean }) {
  const t = useDictionary().nav;
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menu ? "border-b border-mist/10 bg-ink/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between" aria-label={t.main}>
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${displayName} (${fullName}) — ${t.home}`}>
          <span className="grid h-8 w-8 place-items-center rounded-md bg-leaf font-display text-lg font-black text-ink transition-transform group-hover:-rotate-6">
            {displayName.slice(0, 1)}
          </span>
          <span className="hidden font-mono text-xs text-mist/70 sm:inline">~/herrmann</span>
        </Link>
        <ul className="hidden items-center gap-6 xl:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="font-mono text-xs uppercase tracking-[0.18em] text-mist/70 transition-colors hover:text-leaf">
                {t[l.key]}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 sm:gap-3">
          <StudioTrigger tab="summary" label={t.studio} className="grid h-10 w-10 place-items-center rounded-md border border-mist/15 text-mist/80 transition-colors hover:border-leaf hover:text-leaf">
            <Headphones size={17} aria-hidden />
          </StudioTrigger>
          <LanguageSwitcher />
          {open && (
            <Link href="/#contact" className="hidden items-center gap-2 rounded-full border border-leaf/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-leaf lg:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
              </span>
              {t.openToWork}
            </Link>
          )}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md border border-mist/15 xl:hidden"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? t.closeMenu : t.openMenu}
          >
            {menu ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </div>
      </nav>
      {menu && (
        <div id="mobile-menu" className="container-x h-[calc(100dvh-4rem)] overflow-y-auto border-t border-mist/10 bg-ink pb-10 pt-8 xl:hidden">
          <ul className="flex flex-col gap-2">
            {LINKS.map((l, i) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setMenu(false)} className="flex items-baseline gap-4 py-2">
                  <span className="font-mono text-xs text-mint">0{i + 1}</span>
                  <span className="display text-5xl text-mist sm:text-6xl">{t[l.key]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
