"use client";

import { useEffect, useState, useTransition } from "react";
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
import { track } from "@/lib/analytics";
import { siteConfigSchema, type SiteConfig } from "@/lib/site-config";
import { useAutosave } from "@/lib/hooks/useAutosave";
import {
  Check,
  CircleAlert,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  X,
} from "lucide-react";
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

  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "";
  const liveUrl = `${domain.includes("lvh.me") ? "http" : "https"}://${slug}.${domain}`;

  const config = useWatch({ control: form.control }) as SiteConfig;
  const saveState = useAutosave(siteId, config);
  const [published, setPublished] = useState(isPublished);
  const [publishResult, setPublishResult] = useState<
    { url: string } | { error: string } | null
  >(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  // Success toast auto-dismisses; errors stay until closed.
  useEffect(() => {
    if (publishResult && "url" in publishResult) {
      const t = setTimeout(() => setPublishResult(null), 10000);
      return () => clearTimeout(t);
    }
  }, [publishResult]);

  function onPublish() {
    setPublishResult(null);
    startTransition(async () => {
      const result = await publishSite(siteId);
      if (result.url) {
        setPublished(true);
        setPublishResult({ url: result.url });
        track("Site Published", { slug });
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

          {/* Persistent live URL while published */}
          {published && (
            <div className="flex items-center gap-2 border-b border-[#2a2118]/10 bg-green-700/5 px-4 py-2 text-xs">
              <Globe size={13} className="shrink-0 text-green-700" />
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 truncate font-mono text-[#2a2118]/80 underline-offset-2 hover:underline"
              >
                {liveUrl.replace(/^https?:\/\//, "")}
              </a>
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open live site"
                className="ml-auto shrink-0 text-[#2a2118]/40 hover:text-[#2a2118]"
              >
                <ExternalLink size={13} />
              </a>
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

        {/* Publish toast */}
        {publishResult && (
          <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] animate-quote-fade rounded-2xl border bg-white p-4 shadow-2xl ring-1 ring-black/5">
            {"url" in publishResult ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600/10">
                      <Check size={16} className="text-green-700" strokeWidth={3} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#2a2118]">
                        Your radio is live!
                      </p>
                      <p className="truncate font-mono text-xs text-[#2a2118]/60">
                        {publishResult.url.replace(/^https?:\/\//, "")}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Dismiss"
                    onClick={() => setPublishResult(null)}
                    className="text-[#2a2118]/40 hover:text-[#2a2118]"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <a
                    href={publishResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#b3402a] px-3 py-2 text-sm font-medium text-[#faf6ef] hover:bg-[#9a3624]"
                  >
                    <ExternalLink size={14} /> Open
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard
                        ?.writeText(publishResult.url)
                        .catch(() => {});
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-[#2a2118]/20 px-3 py-2 text-sm font-medium text-[#2a2118] hover:bg-[#2a2118]/5"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-green-700" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy link
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CircleAlert size={18} className="shrink-0 text-red-700" />
                  <p className="text-sm text-red-800">{publishResult.error}</p>
                </div>
                <button
                  type="button"
                  aria-label="Dismiss"
                  onClick={() => setPublishResult(null)}
                  className="text-[#2a2118]/40 hover:text-[#2a2118]"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </FormProvider>
  );
}
