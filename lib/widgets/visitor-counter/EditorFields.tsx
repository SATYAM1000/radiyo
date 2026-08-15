"use client";

import { useFormContext } from "react-hook-form";
import type { SiteConfig } from "@/lib/site-config";

export function VisitorCounterEditorFields() {
  const { register } = useFormContext<SiteConfig>();
  return (
    <input
      {...register("widgets.visitorCounter.label")}
      placeholder="people vibing here"
      className="w-full rounded-md border border-[#2a2118]/20 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#b3402a]"
    />
  );
}
