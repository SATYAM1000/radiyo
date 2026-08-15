"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { SiteConfig } from "@/lib/site-config";
import { widgetRegistry, WIDGET_ORDER } from "@/lib/widgets/registry";
import { FontPicker } from "@/components/editor/FontPicker";
import { ImageUploadField } from "@/components/editor/ImageUploadField";
import { PlaylistField } from "@/components/editor/PlaylistField";
import { Toggle } from "@/components/ui/Toggle";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[#2a2118]/10 pb-5 pt-4 first:pt-0 last:border-b-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#2a2118]/50">
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

const inputClass =
  "rounded-md border border-[#2a2118]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#b3402a]";

export function SidebarForm({ siteId }: { siteId: string }) {
  const { register, control, formState } = useFormContext<SiteConfig>();

  return (
    <div className="flex flex-col">
      <Section title="Identity">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Site name
          <input {...register("meta.siteName")} className={inputClass} />
          {formState.errors.meta?.siteName && (
            <span className="text-xs font-normal text-red-700">
              Site name is required
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Tagline
          <input
            {...register("meta.tagline")}
            placeholder="गली के उस मोड़ पर · since 2004"
            className={inputClass}
          />
        </label>
      </Section>

      <Section title="Images">
        <ImageUploadField
          siteId={siteId}
          name="images.hero"
          label="Hero image"
          gallery
        />
        <ImageUploadField siteId={siteId} name="images.logo" label="Logo" />
        <ImageUploadField
          siteId={siteId}
          name="images.background"
          label="Background (subtle, behind everything)"
          gallery
        />
      </Section>

      <Section title="Title font">
        <FontPicker />
      </Section>

      <Section title="Music">
        <PlaylistField />
      </Section>

      <Section title="Widgets">
        {WIDGET_ORDER.map((key) => {
          const def = widgetRegistry[key];
          return (
            <div
              key={key}
              className="rounded-lg border border-[#2a2118]/10 p-3"
            >
              <Controller
                control={control}
                name={`widgets.${key}.enabled` as const}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{def.label}</p>
                      <p className="text-xs text-[#2a2118]/50">
                        {def.description}
                      </p>
                    </div>
                    <Toggle checked={field.value} onChange={field.onChange} />
                  </div>
                )}
              />
              <Controller
                control={control}
                name={`widgets.${key}.enabled` as const}
                render={({ field }) =>
                  field.value ? (
                    <div className="mt-3">
                      <def.EditorFields control={control} />
                    </div>
                  ) : (
                    <span />
                  )
                }
              />
            </div>
          );
        })}
      </Section>
    </div>
  );
}
