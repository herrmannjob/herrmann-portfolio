/**
 * Stateless admin session: a signed cookie `v1.<expires>.<hmac>`.
 * Uses Web Crypto so it runs in both the Edge middleware and Node.
 */
export const SESSION_COOKIE = "hz_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12h

const enc = new TextEncoder();

function getSecret(): string | null {
  const s = process.env.SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

export function adminConfigured(): { ok: true } | { ok: false; reason: string } {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || pw.length < 12) return { ok: false, reason: "ADMIN_PASSWORD não definido (mínimo 12 caracteres)." };
  if (!getSecret()) return { ok: false, reason: "SESSION_SECRET não definido (mínimo 32 caracteres)." };
  return { ok: true };
}

async function hmac(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(now = Date.now()): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("SESSION_SECRET ausente");
  const exp = Math.floor(now / 1000) + SESSION_TTL_SECONDS;
  const payload = `v1.${exp}`;
  return `${payload}.${await hmac(payload, secret)}`;
}

export async function verifySessionToken(token: string | undefined, now = Date.now()): Promise<boolean> {
  const secret = getSecret();
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || exp * 1000 < now) return false;
  const expected = await hmac(`${parts[0]}.${parts[1]}`, secret);
  return safeEqual(expected, parts[2]!);
}

/** Constant-time password comparison via HMAC digests (length-independent). */
export async function checkPassword(input: string): Promise<boolean> {
  const pw = process.env.ADMIN_PASSWORD;
  const secret = getSecret();
  if (!pw || !secret) return false;
  const [a, b] = await Promise.all([hmac(input, secret), hmac(pw, secret)]);
  return safeEqual(a, b);
}
