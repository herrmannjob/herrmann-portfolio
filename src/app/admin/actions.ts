"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { z } from "zod";
import { getContent, ReadonlyError, updateContent } from "@/lib/store";
import { MediaSchema, SettingsSchema, WorkKind, WorkSchema, type Media, type Work } from "@/lib/types";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, adminConfigured, checkPassword, createSessionToken, verifySessionToken } from "@/lib/session";
import { deleteStoredFile, fetchRemoteImage, storeImage } from "@/lib/media-server";
import { slugify } from "@/lib/format";
import { mediaUsage } from "@/lib/usage";

export type Result<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

async function requireAdmin() {
  const jar = await cookies();
  if (!(await verifySessionToken(jar.get(SESSION_COOKIE)?.value))) throw new Error("Sessão expirada. Entre novamente.");
}

function fail(e: unknown): { ok: false; error: string } {
  if (e instanceof z.ZodError) {
    const first = e.issues[0];
    return { ok: false, error: first ? `${first.path.join(".") || "campo"}: ${first.message}` : "Dados inválidos." };
  }
  if (e instanceof ReadonlyError) return { ok: false, error: e.message };
  return { ok: false, error: (e as Error)?.message || "Erro inesperado." };
}

async function guarded<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    await requireAdmin();
    return { ok: true, data: await fn() };
  } catch (e) {
    return fail(e);
  }
}

/* ------------------------------------------------------------------ */
/* Auth                                                               */
/* ------------------------------------------------------------------ */

const attempts = new Map<string, { n: number; until: number }>();

export async function login(_prev: { error?: string } | undefined, formData: FormData): Promise<{ error?: string }> {
  const cfg = adminConfigured();
  if (!cfg.ok) return { error: cfg.reason };
  // Small global throttle against brute force (single-user admin).
  const key = "admin";
  const a = attempts.get(key);
  if (a && a.until > Date.now()) return { error: "Muitas tentativas. Aguarde um minuto." };
  const password = String(formData.get("password") ?? "");
  if (!(await checkPassword(password))) {
    const n = (a?.n ?? 0) + 1;
    attempts.set(key, { n, until: n >= 5 ? Date.now() + 60_000 : 0 });
    await new Promise((r) => setTimeout(r, 400));
    return { error: "Senha incorreta." };
  }
  attempts.delete(key);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production" && !process.env.ALLOW_INSECURE_COOKIE,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect("/admin");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ */
/* Works                                                              */
/* ------------------------------------------------------------------ */

function uniqueSlug(base: string, works: Work[], selfId?: string): string {
  const root = slugify(base) || "item";
  let slug = root;
  let i = 2;
  while (works.some((w) => w.slug === slug && w.id !== selfId)) slug = `${root}-${i++}`;
  return slug;
}

export async function createWork(kind: string): Promise<Result<{ id: string }>> {
  return guarded(async () => {
    const k = WorkKind.parse(kind);
    const id = crypto.randomUUID();
    await updateContent((c) => {
      const label = k === "role" ? "Nova oportunidade" : k === "client" ? "Novo cliente" : "Novo projeto";
      const w = WorkSchema.parse({
        id,
        slug: uniqueSlug(label, c.works),
        kind: k,
        company: label,
        published: false,
        order: -1,
        updatedAt: new Date().toISOString(),
      });
      c.works.unshift(w);
      c.works.forEach((x, i) => (x.order = i));
    });
    return { id };
  });
}

export async function saveWork(input: unknown): Promise<Result<Work>> {
  return guarded(async () => {
    const parsed = WorkSchema.parse(input);
    let saved!: Work;
    await updateContent((c) => {
      const idx = c.works.findIndex((w) => w.id === parsed.id);
      if (idx === -1) throw new Error("Item não encontrado (foi excluído?).");
      const mediaIds = new Set(c.media.map((m) => m.id));
      const clean = (id: string) => (id && mediaIds.has(id) ? id : "");
      saved = {
        ...parsed,
        slug: uniqueSlug(parsed.slug || parsed.company, c.works, parsed.id),
        logoId: clean(parsed.logoId),
        coverId: clean(parsed.coverId),
        gallery: Array.from(new Set(parsed.gallery.filter((id) => mediaIds.has(id)))),
        highlights: parsed.highlights.map((s) => s.trim()).filter(Boolean),
        products: parsed.products.map((s) => s.trim()).filter(Boolean),
        sectors: parsed.sectors.map((s) => s.trim()).filter(Boolean),
        tech: parsed.tech.map((s) => s.trim()).filter(Boolean),
        order: c.works[idx]!.order,
        updatedAt: new Date().toISOString(),
        // The editor doesn't edit translations yet — keep the stored ones.
        i18n: parsed.i18n ?? c.works[idx]!.i18n,
      };
      c.works[idx] = saved;
    });
    return saved;
  });
}

export async function deleteWork(id: string): Promise<Result> {
  return guarded(async () => {
    await updateContent((c) => {
      c.works = c.works.filter((w) => w.id !== id);
      c.works.forEach((x, i) => (x.order = i));
    });
    return undefined;
  });
}

export async function reorderWorks(ids: string[]): Promise<Result> {
  return guarded(async () => {
    z.array(z.string()).parse(ids);
    await updateContent((c) => {
      const pos = new Map(ids.map((id, i) => [id, i]));
      c.works.sort((a, b) => (pos.get(a.id) ?? 1e6) - (pos.get(b.id) ?? 1e6));
      c.works.forEach((x, i) => (x.order = i));
    });
    return undefined;
  });
}

export async function toggleWork(id: string, field: "published" | "featured"): Promise<Result> {
  return guarded(async () => {
    if (field !== "published" && field !== "featured") throw new Error("Campo inválido.");
    await updateContent((c) => {
      const w = c.works.find((x) => x.id === id);
      if (!w) throw new Error("Item não encontrado.");
      w[field] = !w[field];
      w.updatedAt = new Date().toISOString();
    });
    return undefined;
  });
}

/* ------------------------------------------------------------------ */
/* Media                                                              */
/* ------------------------------------------------------------------ */

export async function getMediaLibrary(): Promise<Result<Media[]>> {
  return guarded(async () => (await getContent()).media);
}

export async function addMediaByUrl(url: string, alt: string): Promise<Result<Media>> {
  return guarded(async () => {
    const u = new URL(url.trim());
    if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("Use um link http(s).");
    const item = MediaSchema.parse({
      id: crypto.randomUUID(),
      src: u.toString(),
      kind: "remote",
      alt: alt.trim(),
      credit: u.origin,
      createdAt: new Date().toISOString(),
    });
    await updateContent((c) => void c.media.unshift(item));
    return item;
  });
}

export async function updateMedia(id: string, patch: { alt?: string; credit?: string }): Promise<Result> {
  return guarded(async () => {
    await updateContent((c) => {
      const m = c.media.find((x) => x.id === id);
      if (!m) throw new Error("Imagem não encontrada.");
      if (typeof patch.alt === "string") m.alt = patch.alt.slice(0, 300);
      if (typeof patch.credit === "string") m.credit = patch.credit.slice(0, 300);
    });
    return undefined;
  });
}

export async function deleteMedia(id: string): Promise<Result> {
  return guarded(async () => {
    let src = "";
    await updateContent((c) => {
      const used = mediaUsage(c, id);
      if (used.length) throw new Error(`Em uso: ${used.join(", ")}. Remova dos projetos antes de excluir.`);
      const m = c.media.find((x) => x.id === id);
      src = m?.src ?? "";
      c.media = c.media.filter((x) => x.id !== id);
    });
    await deleteStoredFile(src);
    return undefined;
  });
}

/** Download a remote image into storage/uploads and point the media item at the local copy. */
export async function localizeMedia(id: string): Promise<Result<Media>> {
  return guarded(async () => {
    const c = await getContent();
    const m = c.media.find((x) => x.id === id);
    if (!m) throw new Error("Imagem não encontrada.");
    if (m.kind !== "remote") throw new Error("Esta imagem já está no servidor.");
    const buf = await fetchRemoteImage(m.src);
    const stored = await storeImage(buf);
    let out!: Media;
    await updateContent((d) => {
      const x = d.media.find((y) => y.id === id);
      if (!x) throw new Error("Imagem não encontrada.");
      if (!x.credit) x.credit = m.src;
      Object.assign(x, { kind: "upload", src: stored.src, bytes: stored.bytes, mime: stored.mime, width: stored.width, height: stored.height });
      out = x;
    });
    return out;
  });
}

/* ------------------------------------------------------------------ */
/* Settings                                                           */
/* ------------------------------------------------------------------ */

export async function saveSettings(input: unknown): Promise<Result> {
  return guarded(async () => {
    const parsed = SettingsSchema.parse(input);
    await updateContent((c) => {
      if (parsed.photoId && !c.media.some((m) => m.id === parsed.photoId)) parsed.photoId = "";
      c.settings = { ...parsed, i18n: parsed.i18n ?? c.settings.i18n };
    });
    return undefined;
  });
}

/** Restore the original seed content (keeps uploaded media items). */
export async function resetToSeed(): Promise<Result> {
  return guarded(async () => {
    const { buildSeed } = await import("@/lib/seed");
    await updateContent((c) => {
      const seed = buildSeed();
      const byId = new Map(c.media.map((m) => [m.id, m]));
      // Keep seed images that were already downloaded to the server.
      const seedMedia = seed.media.map((s) => (byId.get(s.id)?.kind === "upload" ? byId.get(s.id)! : s));
      const uploads = c.media.filter((m) => m.kind === "upload" && !seed.media.some((s) => s.id === m.id));
      c.settings = seed.settings;
      c.works = seed.works;
      c.media = [...seedMedia, ...uploads];
    });
    return undefined;
  });
}
