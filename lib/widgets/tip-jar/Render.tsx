"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import type { WidgetRenderProps } from "@/lib/widgets/types";

/* One-tap UPI tip: on phones it deep-links straight into the visitor's UPI
   app with the owner's ID pre-filled; everywhere it also copies the UPI ID. */
export function TipJarRender({ config, site }: WidgetRenderProps<"tipJar">) {
  const [copied, setCopied] = useState(false);
  if (!config.upiId) return null;

  function tip() {
    track("Tip Jar Clicked", { site: site.meta.siteName });
    navigator.clipboard?.writeText(config.upiId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    if (/android|iphone|ipad|mobile/i.test(navigator.userAgent)) {
      window.location.href = `upi://pay?pa=${encodeURIComponent(config.upiId)}&pn=${encodeURIComponent(site.meta.siteName)}&cu=INR`;
    }
  }

  return (
    <div className="font-theme-sans flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={tip}
        className="rounded-full border border-amber-400/40 bg-amber-400/15 px-5 py-2 text-sm font-semibold text-amber-200 backdrop-blur-sm transition-colors hover:bg-amber-400/30"
      >
        {config.buttonText || "🍵 Chai pilao"}
      </button>
      <span
        className={`text-[10px] text-amber-200/70 transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}
      >
        UPI ID copied — {config.upiId}
      </span>
    </div>
  );
}
