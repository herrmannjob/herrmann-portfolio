"use client";

export type StudioTab = "summary" | "video";
export const STUDIO_EVENT = "studio:open";

/** Opens the Listen & watch dialog (mounted once in the site layout). */
export function openStudio(tab: StudioTab, opener?: HTMLElement | null) {
  window.dispatchEvent(new CustomEvent(STUDIO_EVENT, { detail: { tab, opener } }));
}

export function StudioTrigger({
  tab,
  className = "",
  label,
  children,
}: {
  tab: StudioTab;
  className?: string;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={className} aria-label={label} aria-haspopup="dialog" onClick={(e) => openStudio(tab, e.currentTarget)}>
      {children}
    </button>
  );
}
