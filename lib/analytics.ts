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

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "ref",
];

/** Attach UTM params (and referrer) to every event: latest-touch as super
    properties, first-touch preserved under initial_*. Safe to call often. */
export function captureUtms() {
  try {
    ensureInit();
    if (!ready) return;
    const params = new URLSearchParams(window.location.search);
    const utms: Record<string, string> = {};
    const firstTouch: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) {
        utms[key] = value;
        firstTouch[`initial_${key}`] = value;
      }
    }
    if (Object.keys(utms).length) {
      mixpanel.register(utms);
      mixpanel.register_once(firstTouch);
    }
    if (document.referrer) {
      mixpanel.register_once({ initial_referrer: document.referrer });
    }
  } catch {
    /* analytics must never break the page */
  }
}
