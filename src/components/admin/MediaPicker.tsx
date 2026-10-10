"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import type { Media } from "@/lib/types";
import { Thumb } from "./Thumb";
import { Uploader } from "./Uploader";
import { UrlAdder } from "./UrlAdder";

type Props = {
  library: Media[];
  onLibraryChange: (m: Media[]) => void;
  multiple?: boolean;
  initial?: string[];
  title: string;
  onClose: () => void;
  onConfirm: (ids: string[]) => void;
};

export function MediaPicker({ library, onLibraryChange, multiple, initial = [], title, onClose, onConfirm }: Props) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [q, setQ] = useState("");
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    dialog.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? library.filter((m) => `${m.alt} ${m.src} ${m.credit}`.toLowerCase().includes(s)) : library;
  }, [library, q]);

  function toggle(id: string) {
    setSelected((cur) => (multiple ? (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]) : [id]));
  }
  function added(m: Media) {
    onLibraryChange([m, ...library]);
    setSelected((cur) => (multiple ? [...cur, m.id] : [m.id]));
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-xl border border-mist/15 bg-night outline-none sm:rounded-xl">
        <div className="flex items-center justify-between border-b border-mist/10 p-4">
          <h2 className="font-display text-2xl font-extrabold uppercase">{title}</h2>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md border border-mist/15" aria-label="Fechar">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4 overflow-y-auto p-4">
          <Uploader compact onUploaded={added} />
          <UrlAdder onAdded={added} />
          <input className="field" placeholder="Buscar na biblioteca…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar" />
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {filtered.map((m) => {
              const on = selected.includes(m.id);
              const n = selected.indexOf(m.id) + 1;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => toggle(m.id)}
                    aria-pressed={on}
                    className={`relative block w-full overflow-hidden rounded-md border-2 ${on ? "border-leaf" : "border-transparent hover:border-mist/30"}`}
                    title={m.alt || m.src}
                  >
                    <Thumb media={m} className="aspect-square w-full" contain />
                    {on && (
                      <span className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-leaf text-xs font-bold text-ink">
                        {multiple ? n : <Check size={14} />}
                      </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 truncate bg-ink/80 px-1.5 py-1 text-left font-mono text-[10px] text-mist/70">{m.alt || "sem descrição"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-mist/10 p-4">
          <span className="font-mono text-xs text-mist/50">{selected.length} selecionada(s)</span>
          <div className="flex gap-2">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn-primary" onClick={() => onConfirm(selected)} disabled={!multiple && selected.length === 0}>
              Usar {multiple ? "selecionadas" : "imagem"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
