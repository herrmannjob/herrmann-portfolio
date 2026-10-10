import { adminConfigured } from "@/lib/session";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

export default function LoginPage() {
  const cfg = adminConfigured();
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-leaf font-display text-xl font-black text-ink">GH</span>
          <div>
            <p className="font-display text-2xl font-extrabold uppercase">Painel</p>
            <p className="font-mono text-[11px] text-mist/50">portfolio admin</p>
          </div>
        </div>
        {cfg.ok ? (
          <LoginForm />
        ) : (
          <div className="rounded-md border border-signal/40 bg-signal/10 p-4 text-sm text-signal">
            <p className="font-semibold">Painel desativado</p>
            <p className="mt-1 text-mist/80">{cfg.reason}</p>
            <p className="mt-2 font-mono text-xs text-mist/60">Defina as variáveis em .env.local e reinicie o servidor.</p>
          </div>
        )}
      </div>
    </main>
  );
}
