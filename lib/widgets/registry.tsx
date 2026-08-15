import type { WidgetDef, WidgetKey } from "@/lib/widgets/types";
import { ClockRender } from "@/lib/widgets/clock/Render";
import { ClockEditorFields } from "@/lib/widgets/clock/EditorFields";
import { QuotesRender } from "@/lib/widgets/quotes/Render";
import { QuotesEditorFields } from "@/lib/widgets/quotes/EditorFields";
import { VisitorCounterRender } from "@/lib/widgets/visitor-counter/Render";
import { VisitorCounterEditorFields } from "@/lib/widgets/visitor-counter/EditorFields";
import { FaqRender } from "@/lib/widgets/faq/Render";
import { FaqEditorFields } from "@/lib/widgets/faq/EditorFields";
import { SocialRender } from "@/lib/widgets/social/Render";
import { SocialEditorFields } from "@/lib/widgets/social/EditorFields";
import { AmbientRender } from "@/lib/widgets/ambient/Render";
import { AmbientEditorFields } from "@/lib/widgets/ambient/EditorFields";
import { ReactionsRender } from "@/lib/widgets/reactions/Render";
import { ReactionsEditorFields } from "@/lib/widgets/reactions/EditorFields";
import { TipJarRender } from "@/lib/widgets/tip-jar/Render";
import { TipJarEditorFields } from "@/lib/widgets/tip-jar/EditorFields";
import { DayNightRender } from "@/lib/widgets/day-night/Render";
import { DayNightEditorFields } from "@/lib/widgets/day-night/EditorFields";

export const widgetRegistry: { [K in WidgetKey]: WidgetDef<K> } = {
  clock: {
    key: "clock",
    label: "Clock",
    description: "A ticking local-time clock",
    Render: ClockRender,
    EditorFields: ClockEditorFields,
  },
  quotes: {
    key: "quotes",
    label: "Rotating quotes",
    description: "Overheard lines that fade in and out",
    Render: QuotesRender,
    EditorFields: QuotesEditorFields,
  },
  visitorCounter: {
    key: "visitorCounter",
    label: "Visitor counter",
    description: "A retro live visitor count",
    Render: VisitorCounterRender,
    EditorFields: VisitorCounterEditorFields,
  },
  faq: {
    key: "faq",
    label: "FAQ",
    description: "Questions and answers, accordion style",
    Render: FaqRender,
    EditorFields: FaqEditorFields,
  },
  reactions: {
    key: "reactions",
    label: "Live reactions",
    description: "Floating emoji every visitor sees in real time",
    Render: ReactionsRender,
    EditorFields: ReactionsEditorFields,
  },
  tipJar: {
    key: "tipJar",
    label: "UPI tip jar",
    description: "One-tap chai money straight to your UPI ID",
    Render: TipJarRender,
    EditorFields: TipJarEditorFields,
  },
  dayNight: {
    key: "dayNight",
    label: "Day & night mode",
    description: "Page tint follows each visitor's local time",
    Render: DayNightRender,
    EditorFields: DayNightEditorFields,
  },
  ambient: {
    key: "ambient",
    label: "Ambient sound",
    description: "A toggleable rain / fan / crickets layer under the music",
    Render: AmbientRender,
    EditorFields: AmbientEditorFields,
  },
  social: {
    key: "social",
    label: "Social links",
    description: "WhatsApp, Instagram, YouTube, X, LinkedIn, email",
    Render: SocialRender,
    EditorFields: SocialEditorFields,
  },
};

// Widgets offered in the editor sidebar (faq stays registered for old
// configs but is no longer offered — the page is single-viewport now).
export const WIDGET_ORDER: WidgetKey[] = [
  "quotes",
  "clock",
  "visitorCounter",
  "reactions",
  "tipJar",
  "ambient",
  "dayNight",
  "social",
];
