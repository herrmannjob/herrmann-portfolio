/**
 * Step 1 of the studio pipeline: writes .studio/script.json with every
 * narration (4 locales × 3 lengths) split into sentences, plus the
 * localized data the Remotion video needs.
 *
 * Run: npm run studio:script
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { buildSeed } from "../../src/lib/seed";
import { LOCALES } from "../../src/lib/i18n/config";
import { buildStudioData } from "../../src/lib/studio-data";
import { buildScenes, narrationHash, splitSentences, type ScriptCut } from "../../src/lib/summary";

const LENGTHS: ScriptCut[] = ["short", "medium", "full", "video"];
const out = path.join(process.cwd(), ".studio");
mkdirSync(out, { recursive: true });

const content = buildSeed();
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
const video = Object.fromEntries(LOCALES.map((l) => [l, buildStudioData(content, l)]));

writeFileSync(path.join(out, "script.json"), JSON.stringify({ tracks, video }, null, 2));
const sentences = tracks.reduce((n, t) => n + t.scenes.reduce((m, s) => m + s.sentences.length, 0), 0);
console.log(`script.json: ${tracks.length} tracks, ${sentences} sentences`);
