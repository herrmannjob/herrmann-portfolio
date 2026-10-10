import type { Scene } from "@/lib/summary";

/**
 * Draws one frame of the video presentation on a 1280×720 canvas.
 * Only same-origin images are drawn (the portrait), so the canvas stays
 * exportable with MediaRecorder; logos are replaced by typographic badges.
 */

export const W = 1280;
export const H = 720;

const C = {
  ink: "#07100C",
  night: "#0B1611",
  panel: "#101D17",
  forest: "#0A7C15",
  leaf: "#A8D965",
  mint: "#58AE8D",
  mist: "#E8FEF6",
  signal: "#EACE43",
};
const DISPLAY = `"Big Shoulders Display", Impact, "Microsoft YaHei", "PingFang SC", sans-serif`;
const SANS = `"Inter Tight Variable", system-ui, "Microsoft YaHei", "PingFang SC", sans-serif`;
const MONO = `"JetBrains Mono Variable", ui-monospace, "Microsoft YaHei", monospace`;

export type FrameOpts = {
  /** 0..1 progress inside the current scene */
  p: number;
  /** Seconds since the scene started (drives entrance animations) */
  t: number;
  index: number;
  total: number;
  caption?: string;
  photo?: HTMLImageElement | null;
  reduced?: boolean;
};

const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

/** Word wrap that also breaks CJK text between characters. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines = 99): string[] {
  const tokens = text.match(/[　-鿿＀-￯]|[^\s　-鿿＀-￯]+|\s+/g) ?? [];
  const lines: string[] = [];
  let line = "";
  for (const tok of tokens) {
    if (tok === "\n") continue;
    const test = line + tok;
    if (ctx.measureText(test.trimEnd()).width > maxW && line.trim()) {
      lines.push(line.trim());
      line = /^\s+$/.test(tok) ? "" : tok;
    } else line = test;
  }
  if (line.trim()) lines.push(line.trim());
  if (lines.length > maxLines) {
    const cut = lines.slice(0, maxLines);
    cut[maxLines - 1] = cut[maxLines - 1]!.replace(/.{0,2}$/, "…");
    return cut;
  }
  return lines;
}

function text(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, font: string, color: string, align: CanvasTextAlign = "left") {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(s, x, y);
}

function paragraph(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, maxW: number, size: number, color: string, lh = 1.35, maxLines = 8) {
  ctx.font = `400 ${size}px ${SANS}`;
  const lines = wrap(ctx, s, maxW, maxLines);
  lines.forEach((l, i) => text(ctx, l, x, y + i * size * lh, `400 ${size}px ${SANS}`, color));
  return y + lines.length * size * lh;
}

/** Fits a display headline into maxW by shrinking the font. */
function headline(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, maxW: number, size: number, color: string) {
  let fs = size;
  ctx.font = `900 ${fs}px ${DISPLAY}`;
  while (ctx.measureText(s.toUpperCase()).width > maxW && fs > 36) {
    fs -= 4;
    ctx.font = `900 ${fs}px ${DISPLAY}`;
  }
  text(ctx, s.toUpperCase(), x, y, `900 ${fs}px ${DISPLAY}`, color);
  return fs;
}

function background(ctx: CanvasRenderingContext2D, accent: string, t: number, reduced?: boolean) {
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, 0, W, H);
  const drift = reduced ? 0 : Math.sin(t * 0.4) * 40;
  const g = ctx.createRadialGradient(W * 0.85 + drift, -60, 40, W * 0.85 + drift, -60, 760);
  g.addColorStop(0, `${accent}55`);
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(0, H, 20, 0, H, 620);
  g2.addColorStop(0, `${C.forest}55`);
  g2.addColorStop(1, "transparent");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);
  // grid
  ctx.strokeStyle = "rgba(232,254,246,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
    ctx.stroke();
  }
}

function chrome(ctx: CanvasRenderingContext2D, o: FrameOpts, kicker: string) {
  // top bar
  ctx.fillStyle = C.leaf;
  ctx.beginPath();
  ctx.roundRect(64, 44, 40, 40, 8);
  ctx.fill();
  text(ctx, "H", 84, 74, `900 26px ${DISPLAY}`, C.ink, "center");
  text(ctx, "~/herrmann", 118, 70, `500 16px ${MONO}`, "rgba(232,254,246,0.6)");
  text(ctx, kicker.toUpperCase().slice(0, 60), W - 64, 70, `500 15px ${MONO}`, C.mint, "right");
  // progress
  const seg = (W - 128) / o.total;
  for (let i = 0; i < o.total; i++) {
    ctx.fillStyle = "rgba(232,254,246,0.12)";
    ctx.fillRect(64 + i * seg + 2, H - 30, seg - 4, 3);
    const fill = i < o.index ? 1 : i === o.index ? o.p : 0;
    if (fill > 0) {
      ctx.fillStyle = C.leaf;
      ctx.fillRect(64 + i * seg + 2, H - 30, (seg - 4) * fill, 3);
    }
  }
}

function captionBar(ctx: CanvasRenderingContext2D, caption: string) {
  ctx.font = `500 24px ${SANS}`;
  const lines = wrap(ctx, caption, W - 260, 2);
  const h = lines.length * 32 + 24;
  const y = H - 52 - h;
  ctx.fillStyle = "rgba(7,16,12,0.82)";
  ctx.beginPath();
  ctx.roundRect(110, y, W - 220, h, 10);
  ctx.fill();
  lines.forEach((l, i) => text(ctx, l, W / 2, y + 38 + i * 32, `500 24px ${SANS}`, C.mist, "center"));
}

function badge(ctx: CanvasRenderingContext2D, label: string, x: number, y: number, size: number, accent: string) {
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, size * 0.18);
  ctx.fill();
  const initials = label
    .replace(/[^\p{L}\p{N}\s&]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
  text(ctx, initials, x + size / 2, y + size * 0.68, `900 ${size * 0.5}px ${DISPLAY}`, C.ink, "center");
}

export function drawFrame(ctx: CanvasRenderingContext2D, scene: Scene, o: FrameOpts) {
  const a = o.reduced ? 1 : ease(o.t / 0.9);
  const slide = (1 - a) * 40;
  const accent = scene.kind === "work" ? scene.work.accent : C.leaf;
  background(ctx, accent, o.t, o.reduced);
  chrome(ctx, o, scene.kicker);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(0, slide);

  switch (scene.kind) {
    case "intro": {
      if (o.photo?.complete && o.photo.naturalWidth) {
        const pw = 380;
        const ph = 475;
        const px = W - 64 - pw;
        const py = 130;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(px, py, pw, ph, 14);
        ctx.clip();
        const img = o.photo;
        const s = Math.max(pw / img.naturalWidth, ph / img.naturalHeight);
        const iw = img.naturalWidth * s;
        const ih = img.naturalHeight * s;
        ctx.drawImage(img, px + (pw - iw) / 2, py + (ph - ih) * 0.2, iw, ih);
        ctx.restore();
        ctx.strokeStyle = "rgba(232,254,246,0.15)";
        ctx.strokeRect(px + 0.5, py + 0.5, pw, ph);
      }
      text(ctx, "$ whoami", 64, 230, `500 22px ${MONO}`, "rgba(232,254,246,0.5)");
      headline(ctx, scene.title, 60, 400, 700, 200, C.leaf);
      text(ctx, scene.sub, 64, 460, `500 26px ${MONO}`, C.mist);
      ctx.font = `600 30px ${SANS}`;
      wrap(ctx, scene.kicker, 680, 2).forEach((l, i) => text(ctx, l, 64, 530 + i * 40, `600 30px ${SANS}`, "rgba(232,254,246,0.8)"));
      break;
    }
    case "work": {
      const w = scene.work;
      badge(ctx, w.company, 64, 140, 84, w.accent);
      text(ctx, `${String(scene.index + 1).padStart(3, "0")}  ·  ${w.period}`, 168, 172, `500 18px ${MONO}`, C.mint);
      text(ctx, w.title.slice(0, 70), 168, 206, `600 24px ${SANS}`, "rgba(232,254,246,0.85)");
      headline(ctx, w.company, 60, 360, W - 128, 150, C.mist);
      paragraph(ctx, w.summary, 64, 420, w.metrics[0] ? 760 : W - 128, 28, "rgba(232,254,246,0.78)", 1.35, 5);
      if (w.metrics[0]) {
        const m = w.metrics[0];
        text(ctx, m.value, W - 64, 520, `900 150px ${DISPLAY}`, C.leaf, "right");
        ctx.font = `400 20px ${SANS}`;
        wrap(ctx, m.label, 300, 3).forEach((l, i) => text(ctx, l, W - 64, 560 + i * 26, `400 20px ${SANS}`, "rgba(232,254,246,0.65)", "right"));
      }
      break;
    }
    case "stats": {
      headline(ctx, scene.title, 60, 220, W - 128, 110, C.mist);
      const cols = Math.min(scene.stats.length, 4);
      const cw = (W - 128) / cols;
      scene.stats.slice(0, 4).forEach((s, i) => {
        const x = 64 + i * cw;
        const appear = o.reduced ? 1 : ease((o.t - 0.3 - i * 0.25) / 0.6);
        ctx.globalAlpha = a * appear;
        text(ctx, s.value, x, 420, `900 120px ${DISPLAY}`, C.leaf);
        ctx.font = `400 22px ${SANS}`;
        wrap(ctx, s.label, cw - 30, 3).forEach((l, j) => text(ctx, l, x, 470 + j * 30, `400 22px ${SANS}`, "rgba(232,254,246,0.7)"));
      });
      ctx.globalAlpha = a;
      break;
    }
    case "stack": {
      headline(ctx, scene.title, 60, 210, W - 128, 110, C.mist);
      let y = 280;
      scene.skills.slice(0, 5).forEach((g) => {
        text(ctx, g.group.toUpperCase(), 64, y, `800 26px ${DISPLAY}`, C.leaf);
        text(ctx, g.items.slice(0, 7).join(" · "), 300, y, `400 22px ${SANS}`, "rgba(232,254,246,0.8)");
        y += 56;
      });
      break;
    }
    case "quote": {
      text(ctx, "“", 58, 380, `900 220px ${DISPLAY}`, C.leaf);
      const y = paragraph(ctx, scene.quote, 190, 230, W - 320, 36, C.mist, 1.35, 6);
      text(ctx, `— ${scene.author}`, 190, y + 30, `500 22px ${MONO}`, C.mint);
      break;
    }
    case "text":
    case "outro": {
      headline(ctx, scene.title, 60, 240, W - 128, 130, scene.kind === "outro" ? C.leaf : C.mist);
      paragraph(ctx, scene.body, 64, 320, W - 128, 30, "rgba(232,254,246,0.8)", 1.4, 7);
      break;
    }
  }
  ctx.restore();
  if (o.caption) captionBar(ctx, o.caption);
}
