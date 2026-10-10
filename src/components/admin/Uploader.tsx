"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import type { Media } from "@/lib/types";
import { ACCEPT, uploadFile, validateFile } from "./upload";

type Job = { key: string; name: string; pct: number; error?: string };

export function Uploader({ onUploaded, compact }: { onUploaded: (m: Media) => void; compact?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  async function handle(files: FileList | File[]) {
    for (const f of Array.from(files)) {
      const key = `${f.name}-${f.size}-${Math.random()}`;
      const err = validateFile(f);
      if (err) {
        setJobs((j) => [...j, { key, name: f.name, pct: 0, error: err }]);
        continue;
      }
      setJobs((j) => [...j, { key, name: f.name, pct: 0 }]);
      try {
        const m = await uploadFile(f, (pct) => setJobs((j) => j.map((x) => (x.key === key ? { ...x, pct } : x))));
        setJobs((j) => j.filter((x) => x.key !== key));
        onUploaded(m);
      } catch (e) {
        setJobs((j) => j.map((x) => (x.key === key ? { ...x, error: (e as Error).message } : x)));
      }
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void handle(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center transition-colors ${
          compact ? "p-4" : "p-8"
        } ${drag ? "border-leaf bg-leaf/5" : "border-mist/20"}`}
      >
        <Upload size={compact ? 18 : 22} className="text-mint" />
        <p className="text-sm text-mist/70">
          Arraste imagens aqui ou{" "}
          <button type="button" onClick={() => input.current?.click()} className="font-semibold text-leaf underline-offset-2 hover:underline">
            escolha arquivos
          </button>
        </p>
        <p className="font-mono text-[11px] text-mist/40">PNG · JPG · WEBP · GIF · AVIF · SVG — até 15 MB</p>
        <input
          ref={input}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          data-testid="file-input"
          onChange={(e) => {
            if (e.target.files) void handle(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {jobs.length > 0 && (
        <ul className="mt-3 space-y-2" aria-live="polite">
          {jobs.map((j) => (
            <li key={j.key} className="rounded-md border border-mist/10 p-2 text-xs">
              <div className="flex justify-between gap-2">
                <span className="truncate">{j.name}</span>
                <span className={j.error ? "text-red-300" : "text-mint"}>{j.error ? "erro" : `${j.pct}%`}</span>
              </div>
              {j.error ? (
                <p className="mt-1 text-red-300">{j.error}</p>
              ) : (
                <div className="mt-1.5 h-1 overflow-hidden rounded bg-mist/10">
                  <div className="h-full bg-leaf transition-[width]" style={{ width: `${j.pct}%` }} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
