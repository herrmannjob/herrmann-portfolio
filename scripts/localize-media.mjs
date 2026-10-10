#!/usr/bin/env node
/**
 * Downloads every `remote` image in storage/content.json into storage/uploads
 * and rewrites the media items to point at the local copy.
 *
 *   npm run media:localize
 *
 * Run it with the dev server stopped (it edits content.json directly).
 * Images whose host blocks the download simply stay remote.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const STORAGE = path.resolve(process.env.STORAGE_DIR || "storage");
const FILE = path.join(STORAGE, "content.json");
const UPLOADS = path.join(STORAGE, "uploads");
const MAX = 15 * 1024 * 1024;

function sniff(b) {
  if (b[0] === 0x89 && b.toString("ascii", 1, 4) === "PNG") return ["png", "image/png"];
  if (b[0] === 0xff && b[1] === 0xd8) return ["jpg", "image/jpeg"];
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") return ["webp", "image/webp"];
  if (b.toString("ascii", 0, 3) === "GIF") return ["gif", "image/gif"];
  if (b.toString("ascii", 4, 8) === "ftyp") return ["avif", "image/avif"];
  if (b.subarray(0, 1024).toString("utf8").toLowerCase().includes("<svg")) return ["svg", "image/svg+xml"];
  return null;
}

let raw;
try {
  raw = await fs.readFile(FILE, "utf8");
} catch {
  console.error(`Não encontrei ${FILE}. Rode o site uma vez (npm run dev) para criar o conteúdo inicial.`);
  process.exit(1);
}
const content = JSON.parse(raw);
await fs.mkdir(UPLOADS, { recursive: true });

let ok = 0;
let failed = 0;
for (const m of content.media) {
  if (m.kind !== "remote") continue;
  process.stdout.write(`↓ ${m.src.slice(0, 90)} … `);
  try {
    const res = await fetch(m.src, { headers: { "User-Agent": "Mozilla/5.0 (portfolio media localizer)" }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX) throw new Error("maior que 15 MB");
    const t = sniff(buf);
    if (!t) throw new Error("não é uma imagem reconhecida");
    const name = `${Date.now().toString(36)}-${crypto.randomBytes(6).toString("hex")}.${t[0]}`;
    await fs.writeFile(path.join(UPLOADS, name), buf);
    m.credit ||= m.src;
    m.kind = "upload";
    m.src = `/media/uploads/${name}`;
    m.mime = t[1];
    m.bytes = buf.length;
    ok++;
    console.log("ok");
  } catch (e) {
    failed++;
    console.log(`falhou (${e.message})`);
  }
}

const tmp = `${FILE}.tmp`;
await fs.writeFile(tmp, JSON.stringify(content, null, 2));
await fs.rename(tmp, FILE);
console.log(`\n${ok} baixadas · ${failed} continuam remotas.`);
