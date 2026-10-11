/**
 * Step 3 of the studio pipeline: renders the Remotion commercial
 * (remotion/Commercial.tsx) once per locale with its narration and score.
 *
 *   public/studio/<locale>/commercial.mp4   1080p H.264 + AAC
 *   public/studio/<locale>/commercial.jpg   poster (the name reveal)
 *
 * Run: npm run studio:render [-- pt en]
 * (Also runs on GitHub Actions — see .github/workflows/studio-render.yml.)
 */
import { readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { LOCALES, type Locale } from "../../src/lib/i18n/config";

const root = process.cwd();
const script = JSON.parse(readFileSync(path.join(root, ".studio", "script.json"), "utf8"));
const manifestPath = path.join(root, "public", "studio", "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://herrmann-portfolio.vercel.app";
// Own port, so a running `next dev` on :3000 does not get in the way.
const RENDER_PORT = 3123;
const only = process.argv.slice(2).filter((a): a is Locale => (LOCALES as readonly string[]).includes(a));
const targets = only.length ? only : [...LOCALES];

async function main() {
  const serveUrl = await bundle({ entryPoint: path.join(root, "remotion", "index.ts"), publicDir: path.join(root, "public") });

  for (const locale of targets) {
    const timing = manifest.commercial?.[locale];
    if (!timing) {
      console.warn(`skip ${locale}: no commercial audio (run npm run studio:audio)`);
      continue;
    }
    const inputProps = { data: script.commercial[locale], timing, siteUrl };
    const composition = await selectComposition({ serveUrl, id: "Commercial", inputProps, port: RENDER_PORT });
    const dir = path.join(root, "public", "studio", locale);
    const out = path.join(dir, "commercial.mp4");
    const t0 = Date.now();
    await renderMedia({
      serveUrl,
      port: RENDER_PORT,
      composition,
      inputProps,
      codec: "h264",
      crf: 22,
      x264Preset: "slow",
      audioBitrate: "192k",
      pixelFormat: "yuv420p",
      outputLocation: out,
      concurrency: Math.max(2, Math.floor(os.cpus().length / 2)),
      timeoutInMilliseconds: 180_000,
      onProgress: ({ progress }) => process.stdout.write(`\r${locale}: ${(progress * 100).toFixed(0).padStart(3)}%`),
    });
    const reveal = timing.beats.find((b: { id: string }) => b.id === "reveal");
    await renderStill({
      serveUrl,
      port: RENDER_PORT,
      composition,
      inputProps,
      frame: Math.round(((reveal?.start ?? 4) + 2.6) * composition.fps),
      output: path.join(dir, "commercial.jpg"),
      imageFormat: "jpeg",
      jpegQuality: 84,
      timeoutInMilliseconds: 180_000,
    });
    const mb = (statSync(out).size / 1e6).toFixed(1);
    console.log(`\r${locale}: commercial.mp4 ${mb} MB in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    manifest.commercial[locale] = { ...timing, video: `/studio/${locale}/commercial.mp4`, poster: `/studio/${locale}/commercial.jpg` };
  }

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  console.log("manifest.json updated");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
