#!/usr/bin/env node
/**
 * Downloads the researched project media (scripts/media/sources.json) into
 * public/work/<slug>/ as optimized WebP and writes their dimensions to
 * src/lib/media-manifest.json, which the seed reads.
 *
 *   npm run media:fetch            # only missing files
 *   npm run media:fetch -- --force # re-download everything
 *
 * Why local copies: third-party hosts rename files, block hotlinking or sit
 * behind bot checks — a portfolio should not break when they do.
 * SVGs are rasterized on purpose: a third-party SVG served from our own
 * origin could carry script; a WebP cannot.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const SOURCES = path.join(root, "scripts", "media", "sources.json");
const OUT_DIR = path.join(root, "public", "work");
const MANIFEST = path.join(root, "src", "lib", "media-manifest.json");
const MAX_BYTES = 20 * 1024 * 1024;
const force = process.argv.includes("--force");

/** Longest edge per role: logos stay small, covers get room for 2× screens. */
const LIMITS = { logo: 640, icon: 512, cover: 2000, shot: 1000, image: 1600 };

const sources = JSON.parse(await fs.readFile(SOURCES, "utf8"));
let manifest = {};
try {
  manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
} catch {
  /* first run */
}

function isImage(buf) {
  const head = buf.subarray(0, 512).toString("latin1");
  return (
    (buf[0] === 0x89 && head.slice(1, 4) === "PNG") ||
    (buf[0] === 0xff && buf[1] === 0xd8) ||
    (head.startsWith("RIFF") && head.slice(8, 12) === "WEBP") ||
    head.startsWith("GIF") ||
    head.slice(4, 8) === "ftyp" ||
    /<svg[\s>]/i.test(buf.subarray(0, 4096).toString("utf8"))
  );
}

/**
 * Logos drawn as dark ink on an opaque plate (e.g. navy text on a yellow
 * block) turn into a solid slab under the site's white monochrome filter.
 * This keeps the ink: dark pixels become opaque white, light ones vanish.
 */
async function lumaToWhite(img) {
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const l = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
    out[i] = out[i + 1] = out[i + 2] = 255;
    out[i + 3] = Math.round(Math.max(0, Math.min(1, (0.75 - l) / 0.5)) * data[i + 3]);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
}

let ok = 0;
let skipped = 0;
const failed = [];
for (const s of sources) {
  const rel = `/work/${s.slug}/${s.name}.webp`;
  const file = path.join(OUT_DIR, s.slug, `${s.name}.webp`);
  if (!force && manifest[s.id] && (await fs.stat(file).catch(() => null))) {
    skipped++;
    continue;
  }
  try {
    const res = await fetch(s.url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36" },
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_BYTES) throw new Error("larger than 20 MB");
    if (!isImage(buf)) throw new Error(`not an image (${res.headers.get("content-type")})`);

    const limit = LIMITS[s.role] ?? LIMITS.image;
    // SVGs render at a density that gives the logo enough pixels before the resize.
    let img = sharp(buf, { density: s.role === "logo" ? 300 : 144, limitInputPixels: 80_000_000 });
    if (s.trim) img = img.trim();
    img = img.resize({ width: limit, height: limit, fit: "inside", withoutEnlargement: true });
    if (s.flatten) img = img.flatten({ background: s.flatten });
    if (s.mono === "luma") img = await lumaToWhite(img);
    const out = await img.webp({ quality: s.role === "shot" || s.role === "cover" ? 84 : 90, effort: 6 }).toBuffer({ resolveWithObject: true });

    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, out.data);
    manifest[s.id] = { src: rel, width: out.info.width, height: out.info.height, credit: s.credit ?? s.url };
    ok++;
    console.log(`✓ ${s.id.padEnd(28)} ${out.info.width}×${out.info.height} ${(out.data.length / 1024).toFixed(0)} KB`);
  } catch (e) {
    failed.push(s.id);
    console.log(`✗ ${s.id.padEnd(28)} ${e.message} — ${s.url}`);
  }
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 1) + "\n");
console.log(`\n${ok} fetched · ${skipped} already local · ${failed.length} failed${failed.length ? `: ${failed.join(", ")}` : ""}`);
if (failed.length) process.exitCode = 1;
