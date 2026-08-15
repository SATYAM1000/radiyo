import type { Control } from "react-hook-form";
import type { SiteConfig } from "@/lib/site-config";

export type WidgetKey = keyof SiteConfig["widgets"];

export interface WidgetRenderProps<K extends WidgetKey> {
  config: SiteConfig["widgets"][K];
  site: SiteConfig;
  mode: "preview" | "live";
  slug?: string;
}

export interface WidgetDef<K extends WidgetKey> {
  key: K;
  label: string;
  description: string;
  Render: React.ComponentType<WidgetRenderProps<K>>;
  EditorFields: React.ComponentType<{ control: Control<SiteConfig> }>;
}
