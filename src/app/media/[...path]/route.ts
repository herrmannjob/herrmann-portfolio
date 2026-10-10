import { promises as fs } from "node:fs";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/store";
import { MIME_BY_EXT } from "@/lib/media-server";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  if (parts.length !== 2 || parts[0] !== "uploads") return new Response("Not found", { status: 404 });
  const name = parts[1]!;
  if (!/^[a-z0-9-]+\.(png|jpg|webp|gif|avif|svg)$/.test(name)) return new Response("Not found", { status: 404 });
  const file = path.join(UPLOADS_DIR, name);
  try {
    const buf = await fs.readFile(file);
    const ext = name.split(".").pop()!;
    const headers: Record<string, string> = {
      "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    };
    // An SVG opened directly must not be able to run script on this origin.
    if (ext === "svg") headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'; sandbox";
    return new Response(new Uint8Array(buf), { headers });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
