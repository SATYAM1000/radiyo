"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SiteConfig } from "@/lib/site-config";

export type SaveState = "idle" | "saving" | "saved" | "error";

export function useAutosave(siteId: string, config: SiteConfig | undefined) {
  const [state, setState] = useState<SaveState>("idle");
  const seq = useRef(0);
  const skippedFirst = useRef(false);

  useEffect(() => {
    if (!config) return;
    // The first watch emission is the loaded draft itself — don't re-save it.
    if (!skippedFirst.current) {
      skippedFirst.current = true;
      return;
    }

    setState("saving");
    const mySeq = ++seq.current;
    const t = setTimeout(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("sites")
        .update({ draft_config: config })
        .eq("id", siteId);
      // Ignore resolutions of superseded saves.
      if (seq.current === mySeq) setState(error ? "error" : "saved");
    }, 1200);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- config identity changes on every keystroke; serialize instead
  }, [siteId, JSON.stringify(config)]);

  return state;
}
