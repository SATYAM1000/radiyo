"use client";

import { useEffect, useState, useTransition } from "react";
import {
  checkSlugAvailable,
  createSite,
} from "@/app/(app)/editor/[siteId]/actions";
import { normalizeSlug, slugSchema } from "@/lib/slugs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function CreateSiteForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  // Availability is keyed to the slug it was checked for, so a stale
  // result never applies to what the user is currently typing.
  const [availability, setAvailability] = useState<{
    slug: string;
    ok: boolean;
    reason?: string;
  } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const effectiveSlug = slugTouched
    ? slug
    : normalizeSlug(name).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const parsed = slugSchema.safeParse(effectiveSlug);
  const syntaxError =
    effectiveSlug && !parsed.success
      ? (parsed.error.issues[0]?.message ?? "Invalid name")
      : null;
  const current =
    availability?.slug === effectiveSlug ? availability : null;
  const slugOk = parsed.success && current?.ok === true;
  const checking = !!effectiveSlug && parsed.success && !current;

  useEffect(() => {
    if (!effectiveSlug) return;
    const p = slugSchema.safeParse(effectiveSlug);
    if (!p.success) return;
    const t = setTimeout(async () => {
      const result = await checkSlugAvailable(p.data);
      setAvailability({
        slug: effectiveSlug,
        ok: result.available,
        reason: result.reason,
      });
    }, 400);
    return () => clearTimeout(t);
  }, [effectiveSlug]);

  function submit(formData: FormData) {
    setServerError(null);
    startTransition(async () => {
      formData.set("slug", effectiveSlug);
      const result = await createSite(formData);
      // createSite redirects on success; a return value is always an error.
      if (result?.error) setServerError(result.error);
    });
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>+ New radio</Button>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      <div className="w-full max-w-md rounded-xl bg-[#faf6ef] p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Create a new radio</h2>
        <form action={submit} className="mt-4 flex flex-col gap-4">
          <Input
            label="Name"
            name="name"
            required
            placeholder="Deluxe Hair Saloon"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div>
            <Input
              label="Web address"
              name="slug"
              placeholder="deluxe"
              value={effectiveSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(normalizeSlug(e.target.value));
              }}
              error={
                syntaxError ??
                (current && !current.ok
                  ? (current.reason ?? "Not available")
                  : undefined)
              }
            />
            <p className="mt-1 text-xs text-[#2a2118]/50">
              {effectiveSlug || "yourname"}.
              {process.env.NEXT_PUBLIC_ROOT_DOMAIN?.split(":")[0]}
              {checking && " · checking…"}
              {slugOk && " · available ✓"}
            </p>
          </div>
          {serverError && <p className="text-sm text-red-700">{serverError}</p>}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending || !slugOk}>
              {pending ? "Creating…" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
