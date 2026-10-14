/**
 * Step 1 of the studio pipeline: writes .studio/script.json with
 *  - every summary narration (4 locales × 3 lengths), split into sentences
 *  - the commercial's voice lines and on-screen data per locale
 *
 * Run: npm run studio:script
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { buildSeed } from "../../src/lib/seed";
import { LOCALES } from "../../src/lib/i18n/config";
import { buildStudioData } from "../../src/lib/studio-data";
import { buildCommercial } from "../../src/lib/commercial";
import { buildScenes, narrationHash, splitSentences, type SummaryLength } from "../../src/lib/summary";

const LENGTHS: SummaryLength[] = ["short", "medium", "full"];
const out = path.join(process.cwd(), ".studio");
mkdirSync(out, { recursive: true });

const content = buildSeed();
const src = new Map(content.media.map((m) => [m.id, m.src]));
const works = content.works
  .filter((w) => w.published)
  .sort((a, b) => a.order - b.order)
  .map((w) => ({
    slug: w.slug,
    company: w.company,
    logo: src.get(w.logoId),
    cover: src.get(w.coverId),
    images: w.gallery.map((id) => src.get(id)).filter((x): x is string => Boolean(x)),
    apps: w.apps.map((a) => ({
      name: a.name,
      icon: src.get(a.iconId),
      shots: a.shots.map((id) => src.get(id)).filter((x): x is string => Boolean(x)),
    })),
  }));

const tracks = LOCALES.flatMap((locale) => {
  const data = buildStudioData(content, locale);
  return LENGTHS.map((length) => {
    const scenes = buildScenes(data, length);
    return {
      locale,
      length,
      hash: narrationHash(scenes),
      scenes: scenes.map((s) => ({ kind: s.kind, sentences: splitSentences(s.narration) })),
    };
  });
});
const commercial = Object.fromEntries(LOCALES.map((l) => [l, buildCommercial(buildStudioData(content, l), works)]));

writeFileSync(path.join(out, "script.json"), JSON.stringify({ tracks, commercial }, null, 2));
const sentences = tracks.reduce((n, t) => n + t.scenes.reduce((m, s) => m + s.sentences.length, 0), 0);
console.log(`script.json: ${tracks.length} summary tracks (${sentences} sentences), ${LOCALES.length} commercials`);
