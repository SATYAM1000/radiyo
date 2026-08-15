"use client";

import { useFormContext } from "react-hook-form";
import type { SiteConfig } from "@/lib/site-config";

const fields = [
  { name: "widgets.social.whatsapp", label: "WhatsApp number", placeholder: "+91 98765 43210" },
  { name: "widgets.social.instagram", label: "Instagram URL", placeholder: "https://instagram.com/…" },
  { name: "widgets.social.youtube", label: "YouTube URL", placeholder: "https://youtube.com/@…" },
  { name: "widgets.social.twitter", label: "X (Twitter) URL", placeholder: "https://x.com/…" },
  { name: "widgets.social.linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/…" },
  { name: "widgets.social.email", label: "Email", placeholder: "you@example.com" },
] as const;

export function SocialEditorFields() {
  const { register } = useFormContext<SiteConfig>();
  return (
    <div className="flex flex-col gap-2">
      {fields.map((f) => (
        <label key={f.name} className="flex flex-col gap-1 text-xs text-[#2a2118]/60">
          {f.label}
          <input
            {...register(f.name)}
            placeholder={f.placeholder}
            className="rounded-md border border-[#2a2118]/20 bg-white px-3 py-1.5 text-sm text-[#2a2118] outline-none focus:border-[#b3402a]"
          />
        </label>
      ))}
    </div>
  );
}
