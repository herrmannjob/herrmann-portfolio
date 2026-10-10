import { getContent } from "@/lib/store";
import { WorksBoard } from "@/components/admin/WorksBoard";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const c = await getContent();
  const byId = new Map(c.media.map((m) => [m.id, m]));
  const rows = [...c.works]
    .sort((a, b) => a.order - b.order)
    .map((w) => ({
      id: w.id,
      slug: w.slug,
      kind: w.kind,
      company: w.company,
      title: w.title,
      start: w.start,
      end: w.end,
      published: w.published,
      featured: w.featured,
      images: w.gallery.length + (w.coverId ? 1 : 0),
      thumb: byId.get(w.coverId) ?? byId.get(w.logoId),
    }));
  return <WorksBoard rows={rows} />;
}
