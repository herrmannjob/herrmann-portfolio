import type { Media } from "@/lib/types";

/**
 * Up to three real store screenshots fanned out like phones on a table.
 * Pure layout (no state), so server and client components can both use it.
 */
export function PhoneFan({ shots, className = "", eager = false }: { shots: Media[]; className?: string; eager?: boolean }) {
  const list = shots.slice(0, 3);
  return (
    <div className={`relative flex items-end justify-center overflow-hidden ${className}`}>
      {list.map((m, i) => {
        const pos = list.length === 1 ? 0 : i - (list.length - 1) / 2;
        return (
          <figure
            key={m.id}
            className="absolute bottom-[-8%] w-[38%] max-w-[230px] overflow-hidden rounded-[1.6rem] border border-mist/20 bg-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] ring-[6px] ring-ink/80 transition-transform duration-700 ease-out motion-reduce:transition-none"
            style={{
              transform: `translateX(${pos * 66}%) translateY(${Math.abs(pos) * 8}%) rotate(${pos * 5}deg)`,
              zIndex: 10 - Math.abs(pos),
            }}
          >
            <img src={m.src} alt={m.alt} width={m.width} height={m.height} loading={eager ? "eager" : "lazy"} decoding="async" className="block h-auto w-full" />
          </figure>
        );
      })}
    </div>
  );
}
