"use client";

import { Plus, X } from "lucide-react";
import { type Control, useFieldArray, useFormContext } from "react-hook-form";
import type { SiteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";

export function FaqEditorFields({ control }: { control: Control<SiteConfig> }) {
  const { register } = useFormContext<SiteConfig>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "widgets.faq.items",
  });

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, i) => (
        <div
          key={field.id}
          className="flex flex-col gap-1.5 rounded-md border border-[#2a2118]/10 p-2"
        >
          <div className="flex gap-2">
            <input
              {...register(`widgets.faq.items.${i}.q` as const)}
              placeholder="Question"
              className="min-w-0 flex-1 rounded-md border border-[#2a2118]/20 bg-white px-3 py-1.5 text-sm font-medium outline-none focus:border-[#b3402a]"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove FAQ item"
              className="text-[#2a2118]/40 hover:text-red-700"
            >
              <X size={15} />
            </button>
          </div>
          <textarea
            {...register(`widgets.faq.items.${i}.a` as const)}
            placeholder="Answer"
            rows={2}
            className="rounded-md border border-[#2a2118]/20 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#b3402a]"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() => append({ q: "", a: "" })}
        className="self-start"
      >
        <Plus size={14} /> Add question
      </Button>
    </div>
  );
}
