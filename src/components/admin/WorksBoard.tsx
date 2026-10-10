"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, ImageIcon, Pencil, Plus, Star, Trash2 } from "lucide-react";
import type { Media, WorkKind } from "@/lib/types";
import { WORK_KIND_LABEL_PT } from "@/lib/types";
import { yearSpan } from "@/lib/format";
import { createWork, deleteWork, reorderWorks, toggleWork } from "@/app/admin/actions";
import { Thumb } from "./Thumb";

type Row = {
  id: string;
  slug: string;
  kind: WorkKind;
  company: string;
  title: string;
  start: string;
  end: string;
  published: boolean;
  featured: boolean;
  images: number;
  thumb?: Media;
};

const TABS: Array<{ id: "all" | WorkKind; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "role", label: "Experiências" },
  { id: "client", label: "Clientes" },
  { id: "project", label: "Projetos" },
];

export function WorksBoard({ rows: initial }: { rows: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [tab, setTab] = useState<"all" | WorkKind>("all");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();
  useEffect(() => setRows(initial), [initial]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const visible = useMemo(() => (tab === "all" ? rows : rows.filter((r) => r.kind === tab)), [rows, tab]);

  function report(r: { ok: boolean; error?: string }, ok?: string) {
    if (!r.ok) setMsg({ type: "err", text: r.error ?? "Erro" });
    else if (ok) setMsg({ type: "ok", text: ok });
    router.refresh();
  }

  function onDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const from = rows.findIndex((r) => r.id === e.active.id);
    const to = rows.findIndex((r) => r.id === e.over!.id);
    const next = arrayMove(rows, from, to);
    setRows(next);
    start(async () => report(await reorderWorks(next.map((r) => r.id)), "Ordem salva."));
  }

  const counts = rows.reduce<Record<string, number>>((acc, r) => ((acc[r.kind] = (acc[r.kind] ?? 0) + 1), acc), {});
  const featured = rows.filter((r) => r.featured && r.published).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Conteúdo</p>
          <h1 className="display mt-2 text-5xl sm:text-6xl">Oportunidades & projetos</h1>
          <p className="mt-2 max-w-2xl text-sm text-mist/60">
            Arraste para reordenar — a ordem vale para o site inteiro. Itens com <Star size={12} className="inline text-signal" /> aparecem em
            &quot;Selected work&quot; ({featured} agora). O olho controla se o item aparece no site.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["role", "client", "project"] as WorkKind[]).map((k) => (
            <button
              key={k}
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const r = await createWork(k);
                  if (r.ok) router.push(`/admin/works/${r.data.id}`);
                  else setMsg({ type: "err", text: r.error });
                })
              }
              className={k === "role" ? "btn-primary" : "btn-ghost"}
            >
              <Plus size={14} /> {k === "role" ? "Nova oportunidade" : k === "client" ? "Novo cliente" : "Novo projeto"}
            </button>
          ))}
        </div>
      </div>

      {msg && (
        <p role="status" className={`mt-6 rounded-md border px-3 py-2 text-sm ${msg.type === "ok" ? "border-leaf/30 bg-leaf/10 text-leaf" : "border-red-400/30 bg-red-500/10 text-red-200"}`}>
          {msg.text}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-2 border-b border-mist/10 pb-3" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-3 py-1.5 font-mono text-xs ${tab === t.id ? "bg-mist text-ink" : "text-mist/60 hover:text-mist"}`}
          >
            {t.label} <span className="opacity-50">{t.id === "all" ? rows.length : counts[t.id] ?? 0}</span>
          </button>
        ))}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={visible.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <ul className="mt-3 divide-y divide-mist/10">
            {visible.map((r) => (
              <SortableRow
                key={r.id}
                row={r}
                onToggle={(field) => {
                  setRows((all) => all.map((x) => (x.id === r.id ? { ...x, [field]: !x[field] } : x)));
                  start(async () => report(await toggleWork(r.id, field)));
                }}
                onDelete={() => {
                  if (!confirm(`Excluir "${r.company}"? As imagens continuam na biblioteca.`)) return;
                  setRows((all) => all.filter((x) => x.id !== r.id));
                  start(async () => report(await deleteWork(r.id), `"${r.company}" excluído.`));
                }}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableRow({ row: r, onToggle, onDelete }: { row: Row; onToggle: (f: "published" | "featured") => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: r.id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 py-3 ${isDragging ? "relative z-10 rounded-md bg-panel shadow-xl" : ""} ${r.published ? "" : "opacity-55"}`}
      data-testid={`row-${r.slug}`}
    >
      <button type="button" className="cursor-grab touch-none rounded p-1 text-mist/40 hover:text-mist" aria-label={`Reordenar ${r.company}`} {...attributes} {...listeners}>
        <GripVertical size={16} />
      </button>
      <Thumb media={r.thumb} className="h-12 w-16 shrink-0 rounded" />
      <Link href={`/admin/works/${r.id}`} className="min-w-0 flex-1">
        <p className="truncate font-semibold hover:text-leaf">{r.company}</p>
        <p className="truncate text-xs text-mist/50">
          {WORK_KIND_LABEL_PT[r.kind]} · {yearSpan(r, "pt")} {r.title && `· ${r.title}`}
        </p>
      </Link>
      <span className="hidden items-center gap-1 font-mono text-[11px] text-mist/40 sm:flex" title="Imagens (capa + galeria)">
        <ImageIcon size={12} /> {r.images}
      </span>
      <div className="flex items-center gap-1">
        <IconBtn label={r.featured ? "Remover dos destaques" : "Destacar"} onClick={() => onToggle("featured")} active={r.featured}>
          <Star size={15} className={r.featured ? "fill-signal text-signal" : ""} />
        </IconBtn>
        <IconBtn label={r.published ? "Ocultar do site" : "Publicar no site"} onClick={() => onToggle("published")} active={r.published}>
          {r.published ? <Eye size={15} /> : <EyeOff size={15} />}
        </IconBtn>
        <Link href={`/admin/works/${r.id}`} className="grid h-8 w-8 place-items-center rounded-md text-mist/60 hover:bg-mist/10 hover:text-mist" aria-label={`Editar ${r.company}`}>
          <Pencil size={15} />
        </Link>
        <IconBtn label={`Excluir ${r.company}`} onClick={onDelete} danger>
          <Trash2 size={15} />
        </IconBtn>
      </div>
    </li>
  );
}

function IconBtn({ children, label, onClick, active, danger }: { children: React.ReactNode; label: string; onClick: () => void; active?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`grid h-8 w-8 place-items-center rounded-md transition-colors ${danger ? "text-mist/50 hover:bg-red-500/10 hover:text-red-300" : "text-mist/60 hover:bg-mist/10 hover:text-mist"}`}
    >
      {children}
    </button>
  );
}
