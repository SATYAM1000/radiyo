"use client";

import { useState, useTransition } from "react";
import {
  FormProvider,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  publishSite,
  unpublishSite,
} from "@/app/(app)/editor/[siteId]/actions";
import { siteConfigSchema, type SiteConfig } from "@/lib/site-config";
import { useAutosave } from "@/lib/hooks/useAutosave";
import { Check, CircleAlert, Loader2 } from "lucide-react";
import { SidebarForm } from "@/components/editor/SidebarForm";
import { PreviewPane } from "@/components/editor/PreviewPane";
import { SiteRenderer } from "@/components/renderer/SiteRenderer";
import { Button } from "@/components/ui/Button";

interface Props {
  siteId: string;
  slug: string;
  isPublished: boolean;
  initialConfig: SiteConfig;
}

const saveLabels = {
  idle: "",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed — retrying on next change",
} as const;

export function Editor({ siteId, slug, isPublished, initialConfig }: Props) {
  const form = useForm<SiteConfig>({
    // Zod .default()s make the schema's input type looser than its output;
    // the form always holds a complete SiteConfig, so collapse the two.
    resolver: zodResolver(siteConfigSchema) as unknown as Resolver<SiteConfig>,
    defaultValues: initialConfig,
    mode: "onChange",
  });

  const config = useWatch({ control: form.control }) as SiteConfig;
  const saveState = useAutosave(siteId, config);
  const [published, setPublished] = useState(isPublished);
  const [publishResult, setPublishResult] = useState<
    { url: string } | { error: string } | null
  >(null);
  const [pending, startTransition] = useTransition();

  function onPublish() {
    setPublishResult(null);
    startTransition(async () => {
      const result = await publishSite(siteId);
      if (result.url) {
        setPublished(true);
        setPublishResult({ url: result.url });
      } else {
        setPublishResult({ error: result.error ?? "Publish failed" });
      }
    });
  }

  function onUnpublish() {
    startTransition(async () => {
      await unpublishSite(siteId);
      setPublished(false);
      setPublishResult(null);
    });
  }

  return (
    <FormProvider {...form}>
      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="flex w-[380px] shrink-0 flex-col border-r border-[#2a2118]/10">
          <div className="flex items-center justify-between border-b border-[#2a2118]/10 px-4 py-3">
            <span
              className={`flex items-center gap-1.5 text-xs ${saveState === "error" ? "text-red-700" : "text-[#2a2118]/50"}`}
            >
              {saveState === "saving" && (
                <Loader2 size={13} className="animate-spin" />
              )}
              {saveState === "saved" && (
                <Check size={13} className="text-green-700" strokeWidth={3} />
              )}
              {saveState === "error" && <CircleAlert size={13} />}
              {saveLabels[saveState]}
            </span>
            <div className="flex items-center gap-2">
              {published && (
                <Button
                  variant="ghost"
                  onClick={onUnpublish}
                  disabled={pending}
                >
                  Unpublish
                </Button>
              )}
              <Button onClick={onPublish} disabled={pending}>
                {pending ? "Publishing…" : published ? "Republish" : "Publish"}
              </Button>
            </div>
          </div>

          {publishResult && (
            <div className="border-b border-[#2a2118]/10 px-4 py-2 text-sm">
              {"url" in publishResult ? (
                <p className="text-green-800">
                  Live at{" "}
                  <a
                    href={publishResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono underline"
                  >
                    {publishResult.url.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              ) : (
                <p className="text-red-700">{publishResult.error}</p>
              )}
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <SidebarForm siteId={siteId} />
          </div>
        </aside>

        {/* Live preview — scaled to fit, never scrolls or crops */}
        <div className="min-h-0 flex-1 bg-[#2a2118]/5 p-6">
          <PreviewPane>
            <SiteRenderer config={config} mode="preview" slug={slug} />
          </PreviewPane>
        </div>
      </div>
    </FormProvider>
  );
}
