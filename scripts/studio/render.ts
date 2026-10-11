/**
 * Step 3 of the studio pipeline: renders the Remotion presentation
 * (remotion/) once per locale with its Kokoro narration and the music bed.
 *
 *   public/studio/<locale>/presentation.mp4   1080p H.264 + AAC
 *   public/studio/<locale>/poster.jpg
 *
 * Run: npm run studio:render [-- pt en]
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
    const track = manifest.tracks?.[locale]?.video;
    if (!track) {
      console.warn(`skip ${locale}: no narration (run npm run studio:audio)`);
      continue;
    }
    const inputProps = { data: script.video[locale], track, siteUrl };
    const composition = await selectComposition({ serveUrl, id: "Presentation", inputProps, port: RENDER_PORT });
    const dir = path.join(root, "public", "studio", locale);
    const out = path.join(dir, "presentation.mp4");
    const t0 = Date.now();
    await renderMedia({
      serveUrl,
      port: RENDER_PORT,
      composition,
      inputProps,
      codec: "h264",
      crf: 25,
      x264Preset: "slow",
      audioBitrate: "160k",
      pixelFormat: "yuv420p",
      outputLocation: out,
      concurrency: Math.max(2, Math.floor(os.cpus().length / 2)),
      timeoutInMilliseconds: 180_000,
      onProgress: ({ progress }) => process.stdout.write(`\r${locale}: ${(progress * 100).toFixed(0).padStart(3)}%`),
    });
    await renderStill({
      serveUrl,
      port: RENDER_PORT,
      composition,
      inputProps,
      frame: Math.round(4.2 * composition.fps),
      output: path.join(dir, "poster.jpg"),
      imageFormat: "jpeg",
      jpegQuality: 82,
      timeoutInMilliseconds: 180_000,
    });
    const mb = (statSync(out).size / 1e6).toFixed(1);
    console.log(`\r${locale}: presentation.mp4 ${mb} MB in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    manifest.tracks[locale].video = { ...track, video: `/studio/${locale}/presentation.mp4`, poster: `/studio/${locale}/poster.jpg` };
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
console.log("manifest.json updated");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
