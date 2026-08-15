"use client";

import { useFormContext } from "react-hook-form";
import type { SiteConfig } from "@/lib/site-config";

const inputClass =
  "rounded-md border border-[#2a2118]/20 bg-white px-3 py-1.5 text-sm text-[#2a2118] outline-none focus:border-[#b3402a]";

export function TipJarEditorFields() {
  const { register } = useFormContext<SiteConfig>();
  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-1 text-xs text-[#2a2118]/60">
        Your UPI ID
        <input
          {...register("widgets.tipJar.upiId")}
          placeholder="yourname@okhdfcbank"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-[#2a2118]/60">
        Button label
        <input
          {...register("widgets.tipJar.buttonText")}
          placeholder="🍵 Chai pilao"
          className={inputClass}
        />
      </label>
      <p className="text-xs text-[#2a2118]/50">
        On phones the button opens the visitor&apos;s UPI app with your ID
        pre-filled; on desktop it copies your UPI ID.
      </p>
    </div>
  );
}
