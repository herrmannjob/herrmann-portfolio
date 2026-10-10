import { getContent } from "@/lib/store";
import { mediaUsage } from "@/lib/usage";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const c = await getContent();
  const usage = Object.fromEntries(c.media.map((m) => [m.id, mediaUsage(c, m.id)]));
  return <MediaLibrary media={c.media} usage={usage} />;
}
