import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { ContentSchema, type Content } from "./types";
import { buildSeed } from "./seed";

/**
 * File-backed content store.
 *
 * Everything the admin edits lives in one JSON document (storage/content.json)
 * plus uploaded files in storage/uploads/. Writes are serialized through a
 * promise chain and land atomically (write temp file → rename), so a crash
 * mid-write never leaves a half-written document behind.
 */

export const STORAGE_DIR = path.resolve(process.env.STORAGE_DIR || path.join(process.cwd(), "storage"));
export const UPLOADS_DIR = path.join(STORAGE_DIR, "uploads");
const CONTENT_FILE = path.join(STORAGE_DIR, "content.json");

export function isReadonly(): boolean {
  if (process.env.CONTENT_READONLY === "1") return true;
  if (process.env.CONTENT_READONLY === "0") return false;
  // Vercel's filesystem is ephemeral: writes would vanish on the next request.
  return Boolean(process.env.VERCEL);
}

export class ReadonlyError extends Error {
  constructor() {
    super(
      "Este ambiente é somente leitura (ex.: Vercel). Edite localmente e faça push da pasta storage/, ou hospede num servidor com disco persistente.",
    );
  }
}

let cache: { mtimeMs: number; data: Content } | null = null;
let memorySeed: Content | null = null;
let chain: Promise<unknown> = Promise.resolve();

async function readFromDisk(): Promise<Content | null> {
  try {
    const stat = await fs.stat(CONTENT_FILE);
    if (cache && cache.mtimeMs === stat.mtimeMs) return cache.data;
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    const parsed = ContentSchema.parse(JSON.parse(raw));
    cache = { mtimeMs: stat.mtimeMs, data: parsed };
    return parsed;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw new Error(`storage/content.json está inválido: ${(err as Error).message}`);
  }
}

async function writeToDisk(data: Content): Promise<void> {
  const valid = ContentSchema.parse(data);
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  const tmp = `${CONTENT_FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(valid, null, 2), "utf8");
  await fs.rename(tmp, CONTENT_FILE);
  const stat = await fs.stat(CONTENT_FILE);
  cache = { mtimeMs: stat.mtimeMs, data: valid };
}

export async function getContent(): Promise<Content> {
  const fromDisk = await readFromDisk();
  if (fromDisk) return fromDisk;
  if (!isReadonly()) {
    // First run: materialize the seed so the admin has something to edit.
    await enqueue(async () => {
      if (!(await readFromDisk())) await writeToDisk(buildSeed());
    });
    return (await readFromDisk()) ?? buildSeed();
  }
  memorySeed ??= buildSeed();
  return memorySeed;
}

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.catch(() => undefined);
  return run;
}

/** Read-modify-write under a lock. The mutator receives a deep copy. */
export async function updateContent(mutator: (draft: Content) => void | Promise<void>): Promise<Content> {
  if (isReadonly()) throw new ReadonlyError();
  return enqueue(async () => {
    const current = (await readFromDisk()) ?? buildSeed();
    const draft = structuredClone(current);
    await mutator(draft);
    await writeToDisk(draft);
    return draft;
  });
}
