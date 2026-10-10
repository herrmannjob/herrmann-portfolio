import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { UPLOADS_DIR } from "./store";

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export const ALLOWED: Record<string, { ext: string; mime: string }> = {
  png: { ext: "png", mime: "image/png" },
  jpg: { ext: "jpg", mime: "image/jpeg" },
  webp: { ext: "webp", mime: "image/webp" },
  gif: { ext: "gif", mime: "image/gif" },
  avif: { ext: "avif", mime: "image/avif" },
  svg: { ext: "svg", mime: "image/svg+xml" },
};

export const MIME_BY_EXT: Record<string, string> = Object.fromEntries(
  Object.values(ALLOWED).map((a) => [a.ext, a.mime]),
);

/** Identify an image by its magic bytes — never trust the filename or Content-Type. */
export function sniffImage(buf: Buffer): keyof typeof ALLOWED | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG") return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (buf.toString("ascii", 0, 3) === "GIF") return "gif";
  if (buf.toString("ascii", 4, 8) === "ftyp" && /avi[fs]/.test(buf.toString("ascii", 8, 12))) return "avif";
  const head = buf.subarray(0, 1024).toString("utf8").trimStart().toLowerCase();
  if ((head.startsWith("<?xml") || head.startsWith("<svg") || head.startsWith("<!--")) && head.includes("<svg")) return "svg";
  return null;
}

/** Best-effort dimensions for raster formats (no native deps). */
export function imageSize(buf: Buffer, type: string): { width: number; height: number } | null {
  try {
    if (type === "png") return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    if (type === "gif") return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
    if (type === "webp") {
      const chunk = buf.toString("ascii", 12, 16);
      if (chunk === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
      if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
      if (chunk === "VP8L") {
        const b = buf.readUInt32LE(21);
        return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
      }
    }
    if (type === "jpg") {
      let i = 2;
      while (i < buf.length) {
        if (buf[i] !== 0xff) return null;
        const marker = buf[i + 1]!;
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        }
        i += 2 + len;
      }
    }
    if (type === "svg") {
      const s = buf.subarray(0, 4096).toString("utf8");
      const vb = s.match(/viewBox=["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
      if (vb) return { width: Math.round(Number(vb[1])), height: Math.round(Number(vb[2])) };
    }
  } catch {
    /* fall through */
  }
  return null;
}

export type StoredFile = {
  src: string;
  bytes: number;
  mime: string;
  width?: number;
  height?: number;
};

export async function storeImage(buf: Buffer): Promise<StoredFile> {
  if (buf.length > MAX_UPLOAD_BYTES) throw new Error(`Arquivo maior que ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`);
  const type = sniffImage(buf);
  if (!type) throw new Error("Formato não suportado. Use PNG, JPG, WEBP, GIF, AVIF ou SVG.");
  const { ext, mime } = ALLOWED[type]!;
  const name = `${Date.now().toString(36)}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, name), buf);
  const size = imageSize(buf, type);
  return { src: `/media/uploads/${name}`, bytes: buf.length, mime, ...(size ?? {}) };
}

/** Download a remote image (used by "Baixar para o servidor"). */
export async function fetchRemoteImage(url: string): Promise<Buffer> {
  const u = new URL(url);
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("URL inválida.");
  // Avoid turning the admin into an SSRF proxy for the local network.
  if (/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.0\.0\.0|\[?::1\]?)/i.test(u.hostname)) {
    throw new Error("Endereço local não permitido.");
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20_000);
  try {
    const res = await fetch(u, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (portfolio media localizer)", Accept: "image/*,*/*;q=0.5" },
    });
    if (!res.ok) throw new Error(`O servidor respondeu ${res.status}.`);
    const len = Number(res.headers.get("content-length") || 0);
    if (len > MAX_UPLOAD_BYTES) throw new Error("Imagem grande demais.");
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_UPLOAD_BYTES) throw new Error("Imagem grande demais.");
    return buf;
  } catch (e) {
    if ((e as Error).name === "AbortError") throw new Error("Tempo esgotado ao baixar a imagem.");
    if (e instanceof TypeError) throw new Error("Não foi possível conectar ao site de origem (fora do ar ou bloqueando downloads).");
    throw e;
  } finally {
    clearTimeout(t);
  }
}

export async function deleteStoredFile(src: string): Promise<void> {
  if (!src.startsWith("/media/uploads/")) return;
  const name = path.basename(src);
  await fs.rm(path.join(UPLOADS_DIR, name), { force: true });
}
