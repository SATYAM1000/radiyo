import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { migrateConfig } from "@/lib/site-config";
import { Editor } from "@/components/editor/Editor";

export default async function EditorPage({
  params,
}: PageProps<"/editor/[siteId]">) {
  const { siteId } = await params;
  const supabase = await createClient();

  // RLS scopes this to the signed-in owner.
  const { data: site } = await supabase
    .from("sites")
    .select("id, slug, name, draft_config, is_published")
    .eq("id", siteId)
    .single();

  if (!site) notFound();

  let config;
  try {
    config = migrateConfig(site.draft_config);
  } catch {
    notFound();
  }

  return (
    <Editor
      siteId={site.id}
      slug={site.slug}
      isPublished={site.is_published}
      initialConfig={config}
    />
  );
}
