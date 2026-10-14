import type { Content } from "./types";

export function mediaUsage(c: Content, id: string): string[] {
  const where: string[] = [];
  if (c.settings.photoId === id) where.push("Configurações · foto");
  for (const w of c.works) {
    if (w.logoId === id) where.push(`${w.company} · logo`);
    if (w.coverId === id) where.push(`${w.company} · capa`);
    if (w.gallery.includes(id)) where.push(`${w.company} · galeria`);
    for (const a of w.apps) {
      if (a.iconId === id) where.push(`${w.company} · ícone do app ${a.name}`);
      if (a.shots.includes(id)) where.push(`${w.company} · telas do app ${a.name}`);
    }
  }
  return where;
}
