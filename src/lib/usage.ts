import type { Content } from "./types";

export function mediaUsage(c: Content, id: string): string[] {
  const where: string[] = [];
  if (c.settings.photoId === id) where.push("Configurações · foto");
  for (const w of c.works) {
    if (w.logoId === id) where.push(`${w.company} · logo`);
    if (w.coverId === id) where.push(`${w.company} · capa`);
    if (w.gallery.includes(id)) where.push(`${w.company} · galeria`);
  }
  return where;
}
