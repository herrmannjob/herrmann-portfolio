import Link from "next/link";
import { isReadonly } from "@/lib/store";
import { logout } from "../actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { ExternalLink, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const readonly = isReadonly();
  return (
    <div className="min-h-screen bg-ink lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-mist/10 bg-night lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 p-4 lg:flex-col lg:items-stretch lg:p-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-leaf font-display text-lg font-black text-ink">GH</span>
            <span className="font-display text-xl font-extrabold uppercase">Painel</span>
          </Link>
          <AdminNav />
          <div className="flex gap-2 lg:mt-auto lg:flex-col">
            <Link href="/" target="_blank" className="btn-ghost justify-start px-3 py-2 text-xs">
              <ExternalLink size={14} /> <span className="hidden sm:inline">Ver site</span>
            </Link>
            <form action={logout}>
              <button className="btn-ghost w-full justify-start px-3 py-2 text-xs" type="submit">
                <LogOut size={14} /> <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        {readonly && (
          <div className="border-b border-signal/30 bg-signal/10 px-6 py-3 text-sm text-signal">
            Modo somente leitura (ex.: Vercel). As alterações não podem ser salvas aqui — edite localmente e publique a pasta <code>storage/</code>, ou hospede num servidor com disco persistente.
          </div>
        )}
        <div className="mx-auto max-w-6xl p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
