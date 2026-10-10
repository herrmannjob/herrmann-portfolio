import { initials } from "@/lib/format";

/** Generated cover: used when a work has no image (or the remote one fails). */
export function BrandCover({ label, accent = "#A8D965", className = "" }: { label: string; accent?: string; className?: string }) {
  return (
    <div
      className={`relative isolate flex items-end overflow-hidden bg-night ${className}`}
      style={{ ["--a" as string]: accent }}
      role="img"
      aria-label={label}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-90"
        style={{
          background: `radial-gradient(120% 90% at 85% 0%, ${accent}55 0%, transparent 55%), radial-gradient(90% 80% at 0% 100%, #0A7C1566 0%, transparent 60%)`,
        }}
      />
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-60" />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[0.06em] top-1/2 -translate-y-1/2 select-none font-display text-[min(38vw,22rem)] font-black leading-none"
        style={{ color: "transparent", WebkitTextStroke: `1.5px ${accent}` , opacity: 0.55 }}
      >
        {initials(label)}
      </span>
      <span className="relative m-4 font-mono text-[11px] uppercase tracking-[0.2em] text-mist/70">{label}</span>
    </div>
  );
}
