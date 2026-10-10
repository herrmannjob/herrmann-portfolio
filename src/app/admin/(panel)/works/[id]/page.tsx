import { notFound } from "next/navigation";
import { getContent } from "@/lib/store";
import { WorkEditor } from "@/components/admin/WorkEditor";

export const dynamic = "force-dynamic";

export default async function EditWork({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getContent();
  const work = c.works.find((w) => w.id === id);
  if (!work) notFound();
  return <WorkEditor work={work} library={c.media} />;
}
