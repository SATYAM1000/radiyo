import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { migrateConfig, type SiteConfig } from "@/lib/site-config";
import { SiteRenderer } from "@/components/renderer/SiteRenderer";

// Read-heavy, changes only on publish; start dynamic, move to tagged ISR
// in the polish phase if traffic warrants CDN caching.
export const dynamic = "force-dynamic";

async function fetchPublishedSite(slug: string): Promise<SiteConfig | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("sites")
    .select("is_published, published_config")
    .eq("slug", slug)
    .maybeSingle();

  if (!data?.is_published || !data.published_config) return null;
  try {
    return migrateConfig(data.published_config);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/s/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const config = await fetchPublishedSite(slug);
  if (!config) return { title: "Not found" };

  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!.split(":")[0];
  const description =
    config.meta.tagline || config.meta.aboutText.slice(0, 160) || undefined;

  return {
    title: config.meta.tagline
      ? `${config.meta.siteName} — ${config.meta.tagline}`
      : config.meta.siteName,
    description,
    alternates: { canonical: `https://${slug}.${domain}` },
    openGraph: {
      title: config.meta.siteName,
      description,
      images: config.images.hero ? [config.images.hero] : undefined,
    },
  };
}

export default async function PublishedSitePage({
  params,
}: PageProps<"/s/[slug]">) {
  const { slug } = await params;
  const config = await fetchPublishedSite(slug);
  if (!config) notFound();

  return <SiteRenderer config={config} mode="live" slug={slug} />;
}
