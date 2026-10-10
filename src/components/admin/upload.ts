import type { Media } from "@/lib/types";

export const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml";
export const MAX_BYTES = 15 * 1024 * 1024;

export function validateFile(f: File): string | null {
  if (!ACCEPT.split(",").includes(f.type)) return `${f.name}: formato não suportado.`;
  if (f.size > MAX_BYTES) return `${f.name}: maior que 15 MB.`;
  return null;
}

/** Upload with progress (fetch has no upload progress, so XHR). */
export function uploadFile(file: File, onProgress: (pct: number) => void): Promise<Media> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    fd.append("file", file);
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let body: { media?: Media; error?: string } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        /* ignore */
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.media) resolve(body.media);
      else reject(new Error(body.error || `Falha no upload (${xhr.status}).`));
    };
    xhr.onerror = () => reject(new Error("Falha de rede no upload."));
    xhr.send(fd);
  });
}
