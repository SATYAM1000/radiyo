"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSafeEmbedUrl } from "@/lib/embeds";
import { defaultConfig, siteConfigSchema } from "@/lib/site-config";
import { normalizeSlug, slugSchema } from "@/lib/slugs";

export async function checkSlugAvailable(
  slug: string,
): Promise<{ available: boolean; reason?: string }> {
  const parsed = slugSchema.safeParse(normalizeSlug(slug));
  if (!parsed.success) {
    return { available: false, reason: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("sites")
    .select("id")
    .eq("slug", parsed.data)
    .maybeSingle();

  return data
    ? { available: false, reason: "That name is taken" }
    : { available: true };
}

export async function createSite(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim() || "Mera Rediyo";
  const slugInput = normalizeSlug(String(formData.get("slug") ?? ""));

  const parsed = slugSchema.safeParse(slugInput);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid name" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("sites")
    .insert({
      owner_id: user.id,
      slug: parsed.data,
      name,
      draft_config: defaultConfig(name),
    })
    .select("id")
    .single();

  if (error) {
    if (error.message.includes("slug_reserved")) {
      return { error: "That name is reserved" };
    }
    if (error.code === "23505") {
      return { error: "That name is taken" };
    }
    return { error: "Could not create the site. Please try again." };
  }

  redirect(`/editor/${data.id}`);
}

export async function deleteSite(siteId: string) {
  const supabase = await createClient();
  // RLS restricts the delete to rows the caller owns.
  await supabase.from("sites").delete().eq("id", siteId);
  revalidatePath("/dashboard");
}

export async function publishSite(
  siteId: string,
): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: site } = await supabase
    .from("sites")
    .select("slug, draft_config")
    .eq("id", siteId)
    .single();
  if (!site) return { error: "Site not found" };

  const parsed = siteConfigSchema.safeParse(site.draft_config);
  if (!parsed.success) {
    return { error: "Some settings are invalid — fix the highlighted fields first." };
  }

  // The renderer iframes embedUrl blindly; never let a tampered client
  // publish an arbitrary host.
  if (parsed.data.playlist && !isSafeEmbedUrl(parsed.data.playlist.embedUrl)) {
    return { error: "That playlist link isn't from a supported provider." };
  }

  const { error } = await supabase
    .from("sites")
    .update({
      published_config: parsed.data,
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .eq("id", siteId);

  if (error) return { error: "Publish failed. Please try again." };

  revalidateTag(`site:${site.slug}`, "max");
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;
  const protocol = domain.includes("lvh.me") ? "http" : "https";
  return { url: `${protocol}://${site.slug}.${domain}` };
}

export async function unpublishSite(siteId: string) {
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select("slug")
    .eq("id", siteId)
    .single();

  await supabase
    .from("sites")
    .update({ is_published: false })
    .eq("id", siteId);

  if (site) revalidateTag(`site:${site.slug}`, "max");
  revalidatePath("/dashboard");
}
