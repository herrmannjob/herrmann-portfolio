"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Image as ImageIcon, Settings } from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "Oportunidades & projetos", Icon: Briefcase, match: (p: string) => p === "/admin" || p.startsWith("/admin/works") },
  { href: "/admin/media", label: "Imagens", Icon: ImageIcon, match: (p: string) => p.startsWith("/admin/media") },
  { href: "/admin/settings", label: "Configurações", Icon: Settings, match: (p: string) => p.startsWith("/admin/settings") },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:mt-8 lg:flex-col">
      {ITEMS.map(({ href, label, Icon, match }) => {
        const active = match(path);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
              active ? "bg-leaf/10 text-leaf" : "text-mist/70 hover:bg-mist/5 hover:text-mist"
            }`}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
