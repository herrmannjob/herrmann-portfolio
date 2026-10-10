"use client";

import { useState, useTransition } from "react";
import { Link2 } from "lucide-react";
import type { Media } from "@/lib/types";
import { addMediaByUrl } from "@/app/admin/actions";

export function UrlAdder({ onAdded }: { onAdded: (m: Media) => void }) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  return (
    <form
      className="grid gap-2 sm:grid-cols-[1fr_200px_auto]"
      onSubmit={(e) => {
        e.preventDefault();
        setError("");
        start(async () => {
          const r = await addMediaByUrl(url, alt);
          if (r.ok) {
            onAdded(r.data);
            setUrl("");
            setAlt("");
          } else setError(r.error);
        });
      }}
    >
      <input className="field" type="url" required placeholder="https://… link da imagem" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="URL da imagem" />
      <input className="field" placeholder="Texto alternativo" value={alt} onChange={(e) => setAlt(e.target.value)} aria-label="Texto alternativo" />
      <button className="btn-ghost" disabled={pending} type="submit">
        <Link2 size={14} /> {pending ? "Adicionando…" : "Adicionar por link"}
      </button>
      {error && <p className="text-sm text-red-300 sm:col-span-3">{error}</p>}
    </form>
  );
}
