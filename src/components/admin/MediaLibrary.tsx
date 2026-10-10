"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { CloudDownload, Copy, ExternalLink, Trash2 } from "lucide-react";
import type { Media } from "@/lib/types";
import { deleteMedia, localizeMedia, updateMedia } from "@/app/admin/actions";
import { Thumb } from "./Thumb";
import { Uploader } from "./Uploader";
import { UrlAdder } from "./UrlAdder";

type Filter = "all" | "upload" | "remote" | "unused";

export function MediaLibrary({ media: initial, usage }: { media: Media[]; usage: Record<string, string[]> }) {
  const router = useRouter();
  const [media, setMedia] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [bulk, setBulk] = useState<{ done: number; total: number; failed: number } | null>(null);
  const [, start] = useTransition();
  useEffect(() => setMedia(initial), [initial]);

  const shown = useMemo(
    () =>
      media.filter((m) =>
        filter === "all" ? true : filter === "unused" ? !(usage[m.id]?.length) : filter === "upload" ? m.kind !== "remote" : m.kind === "remote",
      ),
    [media, filter, usage],
  );
  const remoteCount = media.filter((m) => m.kind === "remote").length;

  function added(m: Media) {
    setMedia((cur) => [m, ...cur]);
    setMsg({ type: "ok", text: "Imagem adicionada à biblioteca." });
    router.refresh();
  }

  async function localize(id: string) {
    setBusy(id);
    const r = await localizeMedia(id);
    setBusy(null);
    if (r.ok) setMedia((cur) => cur.map((m) => (m.id === id ? r.data : m)));
    return r;
  }

  async function localizeAll() {
    const targets = media.filter((m) => m.kind === "remote");
    setBulk({ done: 0, total: targets.length, failed: 0 });
    let failed = 0;
    for (let i = 0; i < targets.length; i++) {
      const r = await localize(targets[i]!.id);
      if (!r.ok) failed++;
      setBulk({ done: i + 1, total: targets.length, failed });
    }
    setMsg({ type: failed ? "err" : "ok", text: failed ? `${targets.length - failed} baixadas, ${failed} falharam (o site bloqueou ou saiu do ar). As que falharam continuam como link remoto.` : "Todas as imagens remotas foram baixadas para o servidor." });
    router.refresh();
  }

  const FILTERS: Array<{ id: Filter; label: string }> = [
    { id: "all", label: `Todas ${media.length}` },
    { id: "upload", label: "No servidor" },
    { id: "remote", label: `Remotas ${remoteCount}` },
    { id: "unused", label: "Não usadas" },
  ];

  return (
    <div>
      <p className="eyebrow">Biblioteca</p>
      <h1 className="display mt-2 text-5xl sm:text-6xl">Imagens</h1>
      <p className="mt-2 max-w-2xl text-sm text-mist/60">
        As imagens <b>remotas</b> vieram dos sites das empresas (pesquisadas). Elas funcionam como link, mas podem sair do ar —
        use <b>Baixar para o servidor</b> para guardar uma cópia local.
      </p>

      <div className="mt-8 grid gap-4">
        <Uploader onUploaded={added} />
        <UrlAdder onAdded={added} />
      </div>

      {msg && (
        <p role="status" className={`mt-6 rounded-md border px-3 py-2 text-sm ${msg.type === "ok" ? "border-leaf/30 bg-leaf/10 text-leaf" : "border-red-400/30 bg-red-500/10 text-red-200"}`}>
          {msg.text}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-mist/10 pb-3">
        {FILTERS.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id} className={`rounded-full px-3 py-1.5 font-mono text-xs ${filter === f.id ? "bg-mist text-ink" : "text-mist/60 hover:text-mist"}`}>
            {f.label}
          </button>
        ))}
        {remoteCount > 0 && (
          <button type="button" className="btn-ghost ml-auto px-3 py-1.5 text-xs" disabled={!!bulk && bulk.done < bulk.total} onClick={() => void localizeAll()}>
            <CloudDownload size={14} />
            {bulk && bulk.done < bulk.total ? `Baixando ${bulk.done}/${bulk.total}…` : "Baixar todas as remotas"}
          </button>
        )}
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((m) => {
          const used = usage[m.id] ?? [];
          return (
            <li key={m.id} className="overflow-hidden rounded-lg border border-mist/10 bg-night/60" data-testid="media-card">
              <a href={m.src} target="_blank" rel="noreferrer" className="block">
                <Thumb media={m} className="aspect-[16/10] w-full" contain />
              </a>
              <div className="space-y-3 p-3">
                <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                  <span className={m.kind === "remote" ? "text-signal" : "text-leaf"}>{m.kind === "remote" ? "↗ remota" : m.kind === "static" ? "● arquivo do site" : "● no servidor"}</span>
                  <span className="text-mist/40">{m.width && m.height ? `${m.width}×${m.height}` : ""}{m.bytes ? ` · ${(m.bytes / 1024).toFixed(0)} KB` : ""}</span>
                </div>
                <input
                  className="field py-1.5 text-xs"
                  defaultValue={m.alt}
                  placeholder="Texto alternativo (acessibilidade)"
                  aria-label="Texto alternativo"
                  onBlur={(e) => {
                    const alt = e.target.value;
                    if (alt === m.alt) return;
                    start(async () => {
                      const r = await updateMedia(m.id, { alt });
                      if (r.ok) setMedia((cur) => cur.map((x) => (x.id === m.id ? { ...x, alt } : x)));
                      else setMsg({ type: "err", text: r.error });
                    });
                  }}
                />
                <p className="min-h-[1.25rem] text-[11px] text-mist/50">{used.length ? `Em uso: ${used.join(" · ")}` : "Não usada"}</p>
                {m.credit && (
                  <a href={m.credit} target="_blank" rel="noreferrer" className="flex items-center gap-1 truncate text-[11px] text-mint hover:underline">
                    <ExternalLink size={11} /> fonte: {m.credit.replace(/^https?:\/\//, "")}
                  </a>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {m.kind === "remote" && (
                    <button
                      type="button"
                      className="btn-ghost px-2.5 py-1.5 text-xs"
                      disabled={busy === m.id}
                      onClick={async () => {
                        const r = await localize(m.id);
                        setMsg(r.ok ? { type: "ok", text: "Cópia local salva." } : { type: "err", text: `Não foi possível baixar: ${r.error}` });
                        router.refresh();
                      }}
                    >
                      <CloudDownload size={13} /> {busy === m.id ? "Baixando…" : "Baixar para o servidor"}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-ghost px-2.5 py-1.5 text-xs"
                    onClick={() => {
                      void navigator.clipboard?.writeText(m.src.startsWith("/") ? location.origin + m.src : m.src);
                      setMsg({ type: "ok", text: "Link copiado." });
                    }}
                  >
                    <Copy size={13} /> Link
                  </button>
                  <button
                    type="button"
                    className="btn-danger ml-auto px-2.5 py-1.5 text-xs"
                    disabled={used.length > 0}
                    title={used.length ? "Remova dos projetos antes de excluir" : "Excluir"}
                    onClick={() => {
                      if (!confirm("Excluir esta imagem da biblioteca?")) return;
                      start(async () => {
                        const r = await deleteMedia(m.id);
                        if (r.ok) {
                          setMedia((cur) => cur.filter((x) => x.id !== m.id));
                          router.refresh();
                        } else setMsg({ type: "err", text: r.error });
                      });
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
