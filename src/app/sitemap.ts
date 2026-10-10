import type { MetadataRoute } from "next";
import { getSite, hasCasePage } from "@/lib/queries";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { works } = await getSite();
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...works.filter(hasCasePage).map((w) => ({ url: `${base}/work/${w.slug}`, changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
