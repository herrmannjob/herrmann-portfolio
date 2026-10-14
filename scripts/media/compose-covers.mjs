#!/usr/bin/env node
/**
 * Generated key visuals for works whose official imagery is only stock
 * photography (or nothing at all). Abstract, on-brand, no people and no
 * invented UI: a motif that says what the product is, plus the real logo.
 *
 *   npm run media:covers
 *
 * Writes public/work/<slug>/cover.webp and registers it in
 * src/lib/media-manifest.json (credit: "generated").
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const MANIFEST = path.join(root, "src", "lib", "media-manifest.json");
const W = 2400;
const H = 1029; // 21:9

/** Deterministic PRNG so every run draws the same picture. */
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/** Hub and spokes: industries → distributors → pharmacies, all through one hub. */
function hub({ bg, colors, cx = 0.68, seed = 7 }) {
  const r = rng(seed);
  const X = W * cx;
  const Y = H * 0.5;
  const rings = [
    { n: 10, rad: 170, size: 9 },
    { n: 26, rad: 330, size: 6 },
    { n: 54, rad: 520, size: 4 },
    { n: 90, rad: 760, size: 3 },
  ];
  const nodes = [];
  rings.forEach((ring, ri) => {
    for (let i = 0; i < ring.n; i++) {
      const a = (i / ring.n) * Math.PI * 2 + r() * 0.3 + ri;
      const d = ring.rad * (0.85 + r() * 0.3);
      nodes.push({ x: X + Math.cos(a) * d * 1.25, y: Y + Math.sin(a) * d * 0.78, s: ring.size, ri, c: colors[Math.floor(r() * colors.length)] });
    }
  });
  const lines = nodes
    .map((n) => {
      // each node links inward: to the hub (inner ring) or to a node of the previous ring
      const inner = nodes.filter((m) => m.ri === n.ri - 1);
      const t = inner.length ? inner.reduce((best, m) => ((m.x - n.x) ** 2 + (m.y - n.y) ** 2 < (best.x - n.x) ** 2 + (best.y - n.y) ** 2 ? m : best)) : { x: X, y: Y };
      return `<line x1="${n.x.toFixed(1)}" y1="${n.y.toFixed(1)}" x2="${t.x.toFixed(1)}" y2="${t.y.toFixed(1)}" stroke="${n.c}" stroke-opacity="${(0.5 - n.ri * 0.09).toFixed(2)}" stroke-width="${(2.2 - n.ri * 0.4).toFixed(1)}"/>`;
    })
    .join("");
  const dots = nodes.map((n) => `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.s}" fill="${n.c}" fill-opacity="${(1 - n.ri * 0.18).toFixed(2)}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="g" cx="${cx}" cy="0.5" r="0.75"><stop offset="0" stop-color="${bg[1]}"/><stop offset="1" stop-color="${bg[0]}"/></radialGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity=".28"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  ${lines}${dots}
  <circle cx="${X}" cy="${Y}" r="210" fill="url(#glow)"/>
  <circle cx="${X}" cy="${Y}" r="92" fill="${bg[0]}" stroke="#ffffff" stroke-opacity=".35" stroke-width="2"/>
</svg>`;
}

/** Layered planes: a consultancy that plugs into many stacks. */
function strata({ bg, accent, seed = 3 }) {
  const r = rng(seed);
  const planes = Array.from({ length: 14 }, (_, i) => {
    const y = 160 + i * 52;
    const x = 980 + Math.sin(i * 0.7) * 120 + r() * 40;
    const w = 1100 - i * 18;
    return `<g transform="translate(${x.toFixed(0)} ${y}) skewX(-28)"><rect width="${w}" height="34" rx="6" fill="${accent}" fill-opacity="${(0.02 + (i % 4) * 0.015).toFixed(3)}" stroke="${accent}" stroke-opacity="${(0.08 + (i % 3) * 0.05).toFixed(2)}"/></g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><radialGradient id="g" cx="0.75" cy="0.35" r="0.8"><stop offset="0" stop-color="${bg[1]}"/><stop offset="1" stop-color="${bg[0]}"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>${planes}
</svg>`;
}

const COVERS = [
  {
    id: "pharmalink-cover",
    slug: "pharmalink-ecs",
    svg: hub({ bg: ["#071a3a", "#123a7a"], colors: ["#3ddc84", "#42a5f5", "#f29e38", "#ffffff"] }),
    logo: { file: "public/work/pharmalink-ecs/app-icon.webp", size: 150, at: [0.68, 0.5], round: true },
  },
  {
    id: "herrmann-it-cover",
    slug: "herrmann-it-consultoria",
    svg: strata({ bg: ["#07100c", "#173d22"], accent: "#a8d965" }),
    // The consultancy's real client list, as a wall of their own logos
    wall: [
      "picpay/logo", "pacto-solucoes/logo", "grupo-madero/logo", "lojas-lebes/logo", "uplexis/logo",
      "pernambucanas/logo", "milvus/logo", "facepass/logo", "maxxidata/logo", "uds-broadcast/logo",
      "inform-ekantika/logo", "pacto-solucoes/engenharia-do-corpo-logo", "pacto-solucoes/usina-do-corpo-logo", "relevo-lab/acsp-logo", "dollar-donation-club/logo",
    ],
  },
];

const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8").catch(() => "{}"));
for (const c of COVERS) {
  const layers = [];
  if (c.logo) {
    const size = c.logo.size;
    let icon = sharp(path.join(root, c.logo.file)).resize(size, size);
    if (c.logo.round) {
      const mask = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.22}"/></svg>`);
      icon = icon.composite([{ input: mask, blend: "dest-in" }]);
    }
    layers.push({ input: await icon.png().toBuffer(), left: Math.round(W * c.logo.at[0] - size / 2), top: Math.round(H * c.logo.at[1] - size / 2) });
  }
  if (c.wall) {
    // 5 × 3 grid on the right two thirds; logos made white so they read as one system
    const cols = 5, cellW = 300, cellH = 230, x0 = W - cols * cellW - 80, y0 = (H - 3 * cellH) / 2;
    for (const [i, rel] of c.wall.entries()) {
      const file = path.join(root, "public", "work", `${rel}.webp`);
      const { data, info } = await sharp(file).resize(190, 96, { fit: "inside" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      for (let p = 0; p < data.length; p += 4) data[p] = data[p + 1] = data[p + 2] = 255;
      const logo = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
      const col = i % cols, row = Math.floor(i / cols);
      layers.push({ input: logo, left: Math.round(x0 + col * cellW + (cellW - info.width) / 2), top: Math.round(y0 + row * cellH + (cellH - info.height) / 2) });
    }
  }
  const out = path.join(root, "public", "work", c.slug, "cover.webp");
  await fs.mkdir(path.dirname(out), { recursive: true });
  const info = await sharp(Buffer.from(c.svg)).composite(layers).webp({ quality: 86, effort: 6 }).toFile(out);
  manifest[c.id] = { src: `/work/${c.slug}/cover.webp`, width: info.width, height: info.height, credit: "generated" };
  console.log(`✓ ${c.id} ${info.width}×${info.height} ${(info.size / 1024).toFixed(0)} KB`);
}
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 1) + "\n");
