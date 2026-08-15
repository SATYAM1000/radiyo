"use client";

import mixpanel from "mixpanel-browser";

const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
let ready = false;

function ensureInit() {
  if (ready || !token || typeof window === "undefined") return;
  mixpanel.init(token, { persistence: "localStorage" });
  ready = true;
}

/** Fire-and-forget event tracking — never throws, no-ops without a token. */
export function track(event: string, props?: Record<string, unknown>) {
  try {
    ensureInit();
    if (ready) mixpanel.track(event, props);
  } catch {
    /* analytics must never break the page */
  }
}
