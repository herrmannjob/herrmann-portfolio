import crypto from "node:crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { MAX_UPLOAD_BYTES, storeImage } from "@/lib/media-server";
import { isReadonly, updateContent } from "@/lib/store";
import { MediaSchema } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const jar = await cookies();
  if (!(await verifySessionToken(jar.get(SESSION_COOKIE)?.value))) {
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (isReadonly()) return Response.json({ error: "Ambiente somente leitura: uploads desativados." }, { status: 409 });
  const len = Number(req.headers.get("content-length") || 0);
  if (len > MAX_UPLOAD_BYTES + 64 * 1024) return Response.json({ error: "Arquivo maior que 15 MB." }, { status: 413 });

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    const alt = String(form.get("alt") ?? file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ")).slice(0, 300);
    const stored = await storeImage(Buffer.from(await file.arrayBuffer()));
    const item = MediaSchema.parse({
      id: crypto.randomUUID(),
      kind: "upload",
      alt,
      credit: "",
      createdAt: new Date().toISOString(),
      ...stored,
    });
    await updateContent((c) => void c.media.unshift(item));
    return Response.json({ media: item });
  } catch (e) {
    return Response.json({ error: (e as Error).message || "Falha no upload." }, { status: 400 });
  }
}
