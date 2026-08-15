import { createClient } from "@/lib/supabase/server";
import { CreateSiteForm } from "@/components/dashboard/CreateSiteForm";
import { SiteCard } from "@/components/dashboard/SiteCard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: sites } = await supabase
    .from("sites")
    .select("id, slug, name, is_published, published_at, updated_at")
    .order("created_at", { ascending: false });

  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

  return (
    <main className="mx-auto w-full max-w-3xl min-h-0 flex-1 overflow-y-auto px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your radios</h1>
        <CreateSiteForm />
      </div>

      {!sites?.length ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <p className="text-4xl">📻</p>
          <p className="text-[#2a2118]/60">
            No radios yet. Create your first one — it takes about a minute.
          </p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} domain={domain} />
          ))}
        </ul>
      )}

      <p className="mt-12 text-center text-xs text-[#2a2118]/40">
        Published sites live at{" "}
        <span className="font-mono">yourname.{domain.split(":")[0]}</span>
      </p>
    </main>
  );
}
