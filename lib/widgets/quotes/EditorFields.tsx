"use client";

import { Plus, X } from "lucide-react";
import { type Control, useFieldArray, useFormContext } from "react-hook-form";
import type { SiteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";

export function QuotesEditorFields({ control }: { control: Control<SiteConfig> }) {
  const { register } = useFormContext<SiteConfig>();
  // Strings can't be a field array directly; index-register against items.
  const { fields, append, remove } = useFieldArray({
    control,
    name: "widgets.quotes.items" as never,
  });

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, i) => (
        <div key={field.id} className="flex gap-2">
          <input
            {...register(`widgets.quotes.items.${i}` as const)}
            placeholder="Bhai saab, piche se slope cut…"
            className="min-w-0 flex-1 rounded-md border border-[#2a2118]/20 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#b3402a]"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Remove quote"
            className="text-[#2a2118]/40 hover:text-red-700"
          >
            <X size={15} />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() => append("" as never)}
        className="self-start"
      >
        <Plus size={14} /> Add quote
      </Button>
    </div>
  );
}
