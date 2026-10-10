import { getContent } from "@/lib/store";
import { SettingsEditor } from "@/components/admin/SettingsEditor";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const c = await getContent();
  return <SettingsEditor settings={c.settings} library={c.media} />;
}
