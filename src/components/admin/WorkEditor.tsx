"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, ExternalLink, ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import type { Media, Work } from "@/lib/types";
import { WORK_KIND_LABEL_PT } from "@/lib/types";
import { slugify } from "@/lib/format";
import { deleteWork, saveWork } from "@/app/admin/actions";
import { MediaPicker } from "./MediaPicker";
import { Thumb } from "./Thumb";

type Draft = Work & { productsText: string; sectorsText: string; techText: string; highlightsText: string };

function toDraft(w: Work): Draft {
  return {
    ...w,
    productsText: w.products.join(", "),
    sectorsText: w.sectors.join(", "),
    techText: w.tech.join(", "),
    highlightsText: w.highlights.join("\n"),
  };
}
const split = (s: string, sep: RegExp) => s.split(sep).map((x) => x.trim()).filter(Boolean);

function fromDraft(d: Draft): Work {
  const { productsText, sectorsText, techText, highlightsText, ...w } = d;
  return {
    ...w,
    products: split(productsText, /,/),
    sectors: split(sectorsText, /,/),
    tech: split(techText, /,/),
    highlights: split(highlightsText, /\n/),
    metrics: w.metrics.filter((m) => m.value.trim() || m.label.trim()),
    links: w.links.filter((l) => l.label.trim() || l.url.trim()),
  };
}

type PickerTarget = "logo" | "cover" | "gallery" | null;

export function WorkEditor({ work, library: initialLibrary }: { work: Work; library: Media[] }) {
  const router = useRouter();
  const [d, setD] = useState<Draft>(() => toDraft(work));
  const [library, setLibrary] = useState(initialLibrary);
  const [picker, setPicker] = useState<PickerTarget>(null);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const byId = useMemo(() => new Map(library.map((m) => [m.id, m])), [library]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function set<K extends keyof Draft>(k: K, v: Draft[K]) {
    setD((cur) => ({ ...cur, [k]: v }));
    setDirty(true);
    setMsg(null);
  }

  function save() {
    start(async () => {
      const r = await saveWork(fromDraft(d));
      if (r.ok) {
        setD(toDraft(r.data));
        setDirty(false);
        setMsg({ type: "ok", text: "Salvo. O site já mostra a nova versão." });
        router.refresh();
      } else setMsg({ type: "err", text: r.error });
    });
  }

  function onGalleryDrag(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const from = d.gallery.indexOf(String(e.active.id));
    const to = d.gallery.indexOf(String(e.over.id));
    set("gallery", arrayMove(d.gallery, from, to));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="pb-28"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-mist/60 hover:text-leaf">
          <ArrowLeft size={14} /> Voltar
        </Link>
        {work.published && (
          <a href={`/work/${work.slug}`} target="_blank" className="inline-flex items-center gap-1.5 font-mono text-xs text-mint hover:underline">
            /work/{work.slug} <ExternalLink size={12} />
          </a>
        )}
      </div>
      <h1 className="display mt-4 text-5xl sm:text-6xl">{d.company || "Sem nome"}</h1>
      <p className="mt-1 font-mono text-xs text-mist/50">{WORK_KIND_LABEL_PT[d.kind]}</p>

      {/* Básico */}
      <Section title="Básico">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo">
            <select className="field" value={d.kind} onChange={(e) => set("kind", e.target.value as Work["kind"])}>
              <option value="role">Experiência / oportunidade</option>
              <option value="client">Cliente (consultoria)</option>
              <option value="project">Projeto</option>
            </select>
          </Field>
          <Field label="Empresa / nome *">
            <input
              className="field"
              required
              value={d.company}
              onChange={(e) => {
                const company = e.target.value;
                setD((cur) => ({ ...cur, company, slug: cur.slug === slugify(cur.company) || !cur.slug ? slugify(company) : cur.slug }));
                setDirty(true);
              }}
            />
          </Field>
          <Field label={d.kind === "project" ? "Subtítulo" : "Cargo"}>
            <input className="field" value={d.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Via / para (opcional)" hint='ex.: "via Sciensa", "for InterPlayers"'>
            <input className="field" value={d.via} onChange={(e) => set("via", e.target.value)} />
          </Field>
          <Field label="Início" hint="AAAA-MM ou AAAA">
            <input className="field" placeholder="2024-08" value={d.start} onChange={(e) => set("start", e.target.value.trim())} pattern="\d{4}(-\d{2})?" />
          </Field>
          <Field label="Fim" hint="vazio = atual">
            <input className="field" placeholder="atual" value={d.end} onChange={(e) => set("end", e.target.value.trim())} pattern="\d{4}(-\d{2})?" />
          </Field>
          <Field label="Local">
            <input className="field" value={d.location} onChange={(e) => set("location", e.target.value)} />
          </Field>
          <Field label="Slug (URL)" hint={`/work/${d.slug || "…"}`}>
            <input className="field font-mono" value={d.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
          </Field>
          <Field label="Vídeo (opcional)" hint="link do YouTube/Vimeo ou arquivo .mp4/.webm — aparece no case">
            <input className="field" type="url" placeholder="https://www.youtube.com/watch?v=…" value={d.video} onChange={(e) => set("video", e.target.value.trim())} />
          </Field>
          <Field label="Cor de destaque" hint="usada na capa gerada quando não há imagem">
            <div className="flex gap-2">
              <input type="color" className="h-10 w-12 cursor-pointer rounded border border-mist/15 bg-transparent" value={d.accent} onChange={(e) => set("accent", e.target.value.toUpperCase())} aria-label="Cor" />
              <input className="field font-mono" value={d.accent} onChange={(e) => set("accent", e.target.value)} />
            </div>
          </Field>
          <div className="flex flex-wrap items-end gap-6 pb-2">
            <Check label="Publicado no site" checked={d.published} onChange={(v) => set("published", v)} />
            <Check label="Destaque (Selected work)" checked={d.featured} onChange={(v) => set("featured", v)} />
          </div>
        </div>
      </Section>

      {/* Imagens */}
      <Section title="Imagens" desc="Logo e capa aparecem no site e no arquivo; a galeria aparece na página do case. Arraste para reordenar a galeria.">
        <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
          <Slot label="Logo" media={byId.get(d.logoId)} onPick={() => setPicker("logo")} onClear={() => set("logoId", "")} contain />
          <Slot label="Capa" media={byId.get(d.coverId)} onPick={() => setPicker("cover")} onClear={() => set("coverId", "")} wide />
        </div>
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="label mb-0">Galeria ({d.gallery.length})</span>
            <button type="button" className="btn-ghost px-3 py-1.5 text-xs" onClick={() => setPicker("gallery")}>
              <ImagePlus size={14} /> Adicionar imagens
            </button>
          </div>
          {d.gallery.length === 0 ? (
            <button type="button" onClick={() => setPicker("gallery")} className="w-full rounded-md border border-dashed border-mist/20 p-8 text-sm text-mist/50 hover:border-leaf hover:text-leaf">
              Nenhuma imagem na galeria — clique para adicionar (upload, link ou biblioteca)
            </button>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onGalleryDrag}>
              <SortableContext items={d.gallery} strategy={rectSortingStrategy}>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-testid="gallery">
                  {d.gallery.map((id, i) => (
                    <GalleryItem key={id} id={id} index={i} media={byId.get(id)} onRemove={() => set("gallery", d.gallery.filter((x) => x !== id))} />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </Section>

      {/* Textos */}
      <Section title="Textos">
        <div className="grid gap-4">
          <Field label="Resumo" hint={`${d.summary.length}/400 — aparece nos cards e no topo do case`}>
            <textarea className="field min-h-[90px]" maxLength={400} value={d.summary} onChange={(e) => set("summary", e.target.value)} />
          </Field>
          <Field label="Descrição" hint="Separe parágrafos com uma linha em branco">
            <textarea className="field min-h-[200px]" value={d.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
          <Field label="Destaques" hint="Um por linha">
            <textarea className="field min-h-[140px]" value={d.highlightsText} onChange={(e) => set("highlightsText", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Produtos" hint="separados por vírgula">
              <input className="field" value={d.productsText} onChange={(e) => set("productsText", e.target.value)} />
            </Field>
            <Field label="Setores" hint="separados por vírgula">
              <input className="field" value={d.sectorsText} onChange={(e) => set("sectorsText", e.target.value)} />
            </Field>
            <Field label="Tecnologias" hint="separadas por vírgula">
              <input className="field" value={d.techText} onChange={(e) => set("techText", e.target.value)} />
            </Field>
          </div>
        </div>
      </Section>

      {/* Métricas */}
      <Section title="Resultados" desc="Só números que você consegue defender numa entrevista. Até 6.">
        <ul className="space-y-2">
          {d.metrics.map((m, i) => (
            <li key={i} className="grid grid-cols-[120px_1fr_auto] gap-2">
              <input className="field font-mono" placeholder="−50%" value={m.value} aria-label="Valor" onChange={(e) => set("metrics", d.metrics.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
              <input className="field" placeholder="tempo de carregamento" value={m.label} aria-label="Descrição" onChange={(e) => set("metrics", d.metrics.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
              <button type="button" className="btn-ghost px-3" onClick={() => set("metrics", d.metrics.filter((_, j) => j !== i))} aria-label="Remover métrica">
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
        {d.metrics.length < 6 && (
          <button type="button" className="btn-ghost mt-3 px-3 py-1.5 text-xs" onClick={() => set("metrics", [...d.metrics, { value: "", label: "" }])}>
            <Plus size={14} /> Métrica
          </button>
        )}
      </Section>

      {/* Links */}
      <Section title="Links">
        <ul className="space-y-2">
          {d.links.map((l, i) => (
            <li key={i} className="grid grid-cols-[160px_1fr_auto] gap-2">
              <input className="field" placeholder="Rótulo" value={l.label} aria-label="Rótulo" onChange={(e) => set("links", d.links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
              <input className="field" type="url" placeholder="https://" value={l.url} aria-label="URL" onChange={(e) => set("links", d.links.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
              <button type="button" className="btn-ghost px-3" onClick={() => set("links", d.links.filter((_, j) => j !== i))} aria-label="Remover link">
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
        {d.links.length < 8 && (
          <button type="button" className="btn-ghost mt-3 px-3 py-1.5 text-xs" onClick={() => set("links", [...d.links, { label: "", url: "" }])}>
            <Plus size={14} /> Link
          </button>
        )}
      </Section>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-mist/10 bg-night/95 backdrop-blur lg:left-[240px]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-8">
          <button type="submit" className="btn-primary" disabled={pending}>
            <Save size={15} /> {pending ? "Salvando…" : "Salvar"}
          </button>
          <span role="status" className={`text-sm ${msg?.type === "err" ? "text-red-300" : msg ? "text-leaf" : "text-mist/50"}`}>
            {msg?.text ?? (dirty ? "Alterações não salvas" : "Tudo salvo")}
          </span>
          <button
            type="button"
            className="btn-danger ml-auto"
            disabled={pending}
            onClick={() => {
              if (!confirm(`Excluir "${work.company}"? As imagens continuam na biblioteca.`)) return;
              start(async () => {
                const r = await deleteWork(work.id);
                if (r.ok) {
                  setDirty(false);
                  router.push("/admin");
                  router.refresh();
                } else setMsg({ type: "err", text: r.error });
              });
            }}
          >
            <Trash2 size={15} /> Excluir
          </button>
        </div>
      </div>

      {picker && (
        <MediaPicker
          library={library}
          onLibraryChange={setLibrary}
          multiple={picker === "gallery"}
          initial={picker === "gallery" ? [] : [picker === "logo" ? d.logoId : d.coverId].filter(Boolean)}
          title={picker === "logo" ? "Escolher logo" : picker === "cover" ? "Escolher capa" : "Adicionar à galeria"}
          onClose={() => setPicker(null)}
          onConfirm={(ids) => {
            if (picker === "logo") set("logoId", ids[0] ?? "");
            else if (picker === "cover") set("coverId", ids[0] ?? "");
            else set("gallery", Array.from(new Set([...d.gallery, ...ids])));
            setPicker(null);
          }}
        />
      )}
    </form>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 rounded-lg border border-mist/10 bg-night/50 p-5 sm:p-6">
      <h2 className="font-display text-2xl font-extrabold uppercase">{title}</h2>
      {desc && <p className="mt-1 text-sm text-mist/50">{desc}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block font-mono text-[11px] text-mist/40">{hint}</span>}
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" className="h-4 w-4 accent-[#A8D965]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function Slot({ label, media, onPick, onClear, wide, contain }: { label: string; media?: Media; onPick: () => void; onClear: () => void; wide?: boolean; contain?: boolean }) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="group relative overflow-hidden rounded-md border border-mist/15">
        <button type="button" onClick={onPick} className="block w-full" aria-label={`${media ? "Trocar" : "Escolher"} ${label.toLowerCase()}`}>
          {media ? (
            <Thumb media={media} className={`w-full ${wide ? "aspect-[21/9]" : "aspect-square"}`} contain={contain} />
          ) : (
            <span className={`grid w-full place-items-center text-sm text-mist/40 hover:text-leaf ${wide ? "aspect-[21/9]" : "aspect-square"}`}>
              <ImagePlus size={20} />
            </span>
          )}
        </button>
        {media && (
          <button type="button" onClick={onClear} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-ink/80 text-mist/80 hover:text-red-300" aria-label={`Remover ${label.toLowerCase()}`}>
            <X size={14} />
          </button>
        )}
      </div>
      {media && <p className="mt-1 truncate font-mono text-[10px] text-mist/40" title={media.src}>{media.kind === "remote" ? "↗ remota" : "● no servidor"} · {media.alt || "sem alt"}</p>}
    </div>
  );
}

function GalleryItem({ id, index, media, onRemove }: { id: string; index: number; media?: Media; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`relative overflow-hidden rounded-md border border-mist/15 ${isDragging ? "z-10 shadow-2xl" : ""}`}>
      <div className="cursor-grab touch-none" {...attributes} {...listeners} aria-label={`Reordenar imagem ${index + 1}`}>
        <Thumb media={media} className="aspect-[4/3] w-full" />
      </div>
      <span className="absolute left-2 top-2 rounded bg-ink/80 px-1.5 font-mono text-[10px]">{index + 1}</span>
      <button type="button" onClick={onRemove} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-ink/80 text-mist/80 hover:text-red-300" aria-label={`Remover imagem ${index + 1} da galeria`}>
        <X size={14} />
      </button>
      <p className="truncate px-2 py-1 font-mono text-[10px] text-mist/50">{media?.alt || "sem descrição"}</p>
    </li>
  );
}
