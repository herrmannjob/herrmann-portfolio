"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { LogIn } from "lucide-react";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="password" className="label">Senha</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus className="field" />
      </div>
      {state?.error && (
        <p role="alert" className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        <LogIn size={16} /> {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
