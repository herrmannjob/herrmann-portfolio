"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import type { Media, Recommendation, Settings } from "@/lib/types";
import { resetToSeed, saveSettings } from "@/app/admin/actions";
import { MediaPicker } from "./MediaPicker";
import { Thumb } from "./Thumb";

/* Plain-text representations so lists stay easy to edit by hand. */
const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const cells = (l: string) => l.split("|").map((c) => c.trim());

function toText(s: Settings) {
  return {
    roles: s.roles.join("\n"),
    bio: s.bio.join("\n\n"),
    stats: s.stats.map((x) => `${x.value} | ${x.label}`).join("\n"),
    skills: s.skills.map((g) => `${g.group}: ${g.items.join(", ")}`).join("\n"),
    education: s.education.map((e) => `${e.period} | ${e.title} | ${e.school}`).join("\n"),
    certifications: s.certifications.map((c) => `${c.date} | ${c.title} | ${c.issuer} | ${c.url}`).join("\n"),
    languages: s.languages.map((l) => `${l.name} | ${l.level}`).join("\n"),
  };
}

function fromText(base: Settings, t: ReturnType<typeof toText>): Settings {
  return {
    ...base,
    roles: lines(t.roles),
    bio: t.bio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    stats: lines(t.stats).map((l) => {
      const [value = "", label = ""] = cells(l);
      return { value, label };
    }),
    skills: lines(t.skills).map((l) => {
      const i = l.indexOf(":");
      return { group: (i > -1 ? l.slice(0, i) : l).trim(), items: i > -1 ? l.slice(i + 1).split(",").map((x) => x.trim()).filter(Boolean) : [] };
    }),
    education: lines(t.education).map((l) => {
      const [period = "", title = "", school = ""] = cells(l);
      return { period, title, school };
    }),
    certifications: lines(t.certifications).map((l) => {
      const [date = "", title = "", issuer = "", url = ""] = cells(l);
      return { date, title, issuer, url };
    }),
    languages: lines(t.languages).map((l) => {
      const [name = "", level = ""] = cells(l);
      return { name, level };
    }),
  };
}

export function SettingsEditor({ settings, library: initialLibrary }: { settings: Settings; library: Media[] }) {
  const router = useRouter();
  const [s, setS] = useState(settings);
  const [t, setT] = useState(() => toText(settings));
  const [library, setLibrary] = useState(initialLibrary);
  const [picker, setPicker] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const photo = useMemo(() => library.find((m) => m.id === s.photoId), [library, s.photoId]);

  const up = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((c) => ({ ...c, [k]: v }));
  const upT = (k: keyof ReturnType<typeof toText>, v: string) => setT((c) => ({ ...c, [k]: v }));

  return (
    <form
      className="pb-28"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await saveSettings(fromText(s, t));
          setMsg(r.ok ? { type: "ok", text: "Configurações salvas." } : { type: "err", text: r.error });
          if (r.ok) router.refresh();
        });
      }}
    >
      <p className="eyebrow">Site</p>
      <h1 className="display mt-2 text-5xl sm:text-6xl">Configurações</h1>

      <Box title="Identidade">
        <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
          <div>
            <span className="label">Foto</span>
            <button type="button" onClick={() => setPicker(true)} className="block w-full overflow-hidden rounded-md border border-mist/15" aria-label="Trocar foto">
              <Thumb media={photo} className="aspect-[4/5] w-full" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Nome completo"><input className="field" value={s.name} onChange={(e) => up("name", e.target.value)} required /></F>
            <F label="Título (headline)"><input className="field" value={s.headline} onChange={(e) => up("headline", e.target.value)} /></F>
            <F label="Nome de apresentação" hint="como o site te apresenta primeiro (hero, menu, títulos)"><input className="field" value={s.displayName} onChange={(e) => up("displayName", e.target.value)} required maxLength={40} /></F>
            <F label="Cargos que digitam no hero" hint="um por linha" wide>
              <textarea className="field min-h-[96px]" value={t.roles} onChange={(e) => upT("roles", e.target.value)} />
            </F>
            <F label="Introdução" hint={`${s.intro.length}/400`} wide>
              <textarea className="field min-h-[80px]" maxLength={400} value={s.intro} onChange={(e) => up("intro", e.target.value)} />
            </F>
          </div>
        </div>
      </Box>

      <Box title="Disponibilidade & contato">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" className="h-4 w-4 accent-[#A8D965]" checked={s.availability.open} onChange={(e) => up("availability", { ...s.availability, open: e.target.checked })} />
            Mostrar selo &quot;Open to work&quot;
          </label>
          <F label="Texto de disponibilidade" wide><input className="field" value={s.availability.text} onChange={(e) => up("availability", { ...s.availability, text: e.target.value })} /></F>
          <F label="E-mail"><input className="field" type="email" value={s.email} onChange={(e) => up("email", e.target.value)} /></F>
          <F label="Telefone / WhatsApp" hint="vazio = não aparece no site"><input className="field" value={s.phone} onChange={(e) => up("phone", e.target.value)} /></F>
          <F label="Localização"><input className="field" value={s.location} onChange={(e) => up("location", e.target.value)} /></F>
          <F label="Fuso horário (relógio)" hint="ex.: America/Sao_Paulo"><input className="field" value={s.timezone} onChange={(e) => up("timezone", e.target.value)} /></F>
          {(["linkedin", "github", "twitch", "website"] as const).map((k) => (
            <F key={k} label={k}><input className="field" type="url" value={s.links[k]} onChange={(e) => up("links", { ...s.links, [k]: e.target.value })} /></F>
          ))}
        </div>
      </Box>

      <Box title="Sobre">
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Empresa / consultoria"><input className="field" value={s.company.name} onChange={(e) => up("company", { ...s.company, name: e.target.value })} /></F>
          <F label="Slogan da empresa"><input className="field" value={s.company.tagline} onChange={(e) => up("company", { ...s.company, tagline: e.target.value })} /></F>
          <F label="Bio" hint="parágrafos separados por linha em branco" wide>
            <textarea className="field min-h-[220px]" value={t.bio} onChange={(e) => upT("bio", e.target.value)} />
          </F>
          <F label="Números" hint="valor | descrição — um por linha (até 6)" wide>
            <textarea className="field min-h-[110px] font-mono text-xs" value={t.stats} onChange={(e) => upT("stats", e.target.value)} />
          </F>
          <F label="Stack" hint="Grupo: item, item, item — um grupo por linha" wide>
            <textarea className="field min-h-[140px] font-mono text-xs" value={t.skills} onChange={(e) => upT("skills", e.target.value)} />
          </F>
          <F label="Formação" hint="período | curso | instituição" wide>
            <textarea className="field min-h-[140px] font-mono text-xs" value={t.education} onChange={(e) => upT("education", e.target.value)} />
          </F>
          <F label="Certificações" hint="data | título | emissor | link (opcional)" wide>
            <textarea className="field min-h-[100px] font-mono text-xs" value={t.certifications} onChange={(e) => upT("certifications", e.target.value)} />
          </F>
          <F label="Idiomas" hint="idioma | nível" wide>
            <textarea className="field min-h-[80px] font-mono text-xs" value={t.languages} onChange={(e) => upT("languages", e.target.value)} />
          </F>
        </div>
      </Box>

      <Box title="Recomendações (LinkedIn)">
        <p className="mb-4 text-sm text-mist/60">Mostradas no idioma original; as traduções aparecem rotuladas, com botão para ver o original.</p>
        <ul className="space-y-4">
          {s.recommendations.map((r, i) => (
            <RecEditor
              key={r.id}
              r={r}
              onChange={(next) => up("recommendations", s.recommendations.map((x, j) => (j === i ? next : x)))}
              onRemove={() => up("recommendations", s.recommendations.filter((_, j) => j !== i))}
            />
          ))}
        </ul>
        {s.recommendations.length < 20 && (
          <button
            type="button"
            className="btn-ghost mt-4 px-3 py-1.5 text-xs"
            onClick={() =>
              up("recommendations", [
                ...s.recommendations,
                { id: crypto.randomUUID(), name: "", headline: "", relation: "same-team", date: "", text: "", lang: "pt", url: "", translations: {} },
              ])
            }
          >
            <Plus size={14} /> Adicionar recomendação
          </button>
        )}
      </Box>

      <Box title="SEO">
        <div className="grid gap-4">
          <F label="Título da página"><input className="field" value={s.seo.title} onChange={(e) => up("seo", { ...s.seo, title: e.target.value })} /></F>
          <F label="Descrição"><textarea className="field" value={s.seo.description} onChange={(e) => up("seo", { ...s.seo, description: e.target.value })} /></F>
        </div>
      </Box>

      <Box title="Restaurar conteúdo inicial">
        <p className="text-sm text-mist/60">Volta textos, oportunidades e imagens ao conteúdo original pesquisado. Seus uploads continuam na biblioteca.</p>
        <button
          type="button"
          className="btn-danger mt-4"
          onClick={() => {
            if (!confirm("Restaurar o conteúdo inicial? Isso substitui todas as oportunidades, projetos e configurações.")) return;
            start(async () => {
              const r = await resetToSeed();
              setMsg(r.ok ? { type: "ok", text: "Conteúdo inicial restaurado." } : { type: "err", text: r.error });
              if (r.ok) location.reload();
            });
          }}
        >
          <RotateCcw size={14} /> Restaurar
        </button>
      </Box>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-mist/10 bg-night/95 backdrop-blur lg:left-[240px]">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-8">
          <button type="submit" className="btn-primary" disabled={pending}>
            <Save size={15} /> {pending ? "Salvando…" : "Salvar"}
          </button>
          {msg && <span role="status" className={`text-sm ${msg.type === "ok" ? "text-leaf" : "text-red-300"}`}>{msg.text}</span>}
        </div>
      </div>

      {picker && (
        <MediaPicker
          library={library}
          onLibraryChange={setLibrary}
          title="Escolher foto"
          initial={s.photoId ? [s.photoId] : []}
          onClose={() => setPicker(false)}
          onConfirm={(ids) => {
            up("photoId", ids[0] ?? "");
            setPicker(false);
          }}
        />
      )}
    </form>
  );
}

const RELATIONS: Array<[Recommendation["relation"], string]> = [
  ["same-team", "Mesma equipe"],
  ["different-teams", "Equipes diferentes"],
  ["managed-directly", "Supervisionou diretamente"],
  ["other", "Outro"],
];
const LANGS = ["pt", "en", "es", "zh"] as const;

function RecEditor({ r, onChange, onRemove }: { r: Recommendation; onChange: (r: Recommendation) => void; onRemove: () => void }) {
  const set = <K extends keyof Recommendation>(k: K, v: Recommendation[K]) => onChange({ ...r, [k]: v });
  return (
    <li className="rounded-md border border-mist/10 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <F label="Nome *"><input className="field" value={r.name} onChange={(e) => set("name", e.target.value)} required /></F>
        <F label="Título / headline"><input className="field" value={r.headline} onChange={(e) => set("headline", e.target.value)} /></F>
        <F label="Relação">
          <select className="field" value={r.relation} onChange={(e) => set("relation", e.target.value as Recommendation["relation"])}>
            {RELATIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </F>
        <div className="grid grid-cols-2 gap-3">
          <F label="Data" hint="AAAA-MM-DD"><input className="field font-mono" value={r.date} onChange={(e) => set("date", e.target.value.trim())} pattern="\d{4}-\d{2}-\d{2}" /></F>
          <F label="Idioma original">
            <select className="field" value={r.lang} onChange={(e) => set("lang", e.target.value as Recommendation["lang"])}>
              {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </F>
        </div>
        <F label="Texto original *" wide><textarea className="field min-h-[90px]" value={r.text} onChange={(e) => set("text", e.target.value)} required /></F>
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer font-mono text-xs text-mist/60">Traduções</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {LANGS.filter((l) => l !== r.lang).map((l) => (
            <F key={l} label={l}>
              <textarea className="field min-h-[80px]" value={r.translations[l] ?? ""} onChange={(e) => set("translations", { ...r.translations, [l]: e.target.value || undefined })} />
            </F>
          ))}
        </div>
      </details>
      <button type="button" className="btn-ghost mt-3 px-3 py-1.5 text-xs" onClick={onRemove}>
        <Trash2 size={13} /> Remover
      </button>
    </li>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 rounded-lg border border-mist/10 bg-night/50 p-5 sm:p-6">
      <h2 className="mb-5 font-display text-2xl font-extrabold uppercase">{title}</h2>
      {children}
    </section>
  );
}

function F({ label, hint, wide, children }: { label: string; hint?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block font-mono text-[11px] text-mist/40">{hint}</span>}
    </label>
  );
}
