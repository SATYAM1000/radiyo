import { notFound } from "next/navigation";
import { SiteRenderer } from "@/components/renderer/SiteRenderer";
import { defaultConfig, type SiteConfig } from "@/lib/site-config";

// Dev-only harness for eyeballing the renderer without a database.
export default async function RendererDevPage({
  searchParams,
}: PageProps<"/dev/renderer">) {
  if (process.env.NODE_ENV === "production") notFound();

  const { theme } = await searchParams;
  const config: SiteConfig = {
    ...defaultConfig("Deluxe Hair Saloon"),
    images: { hero: "/gallery/deluxe-hair-saloon.jpg", background: null, logo: null },
    meta: {
      siteName: "डीलक्स सैलून",
      tagline: "गली के उस मोड़ पर · since 2004",
      aboutText:
        "A little corner of the internet that sounds like a Sunday morning haircut in 2004.\n\nSit back. The radio is already on.",
    },
    themeId: (typeof theme === "string"
      ? theme
      : "barbershop") as SiteConfig["themeId"],
    playlist: {
      provider: "youtube",
      originalUrl:
        "https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj",
      embedUrl:
        "https://www.youtube.com/embed/videoseries?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj",
    },
    widgets: {
      clock: { enabled: true, format: "12h" },
      quotes: {
        enabled: true,
        items: [
          "Bhai saab, piche se slope cut karu ki V-shape? — Pappu Ustad (Chief Barber)",
          "Machine nahi, kainchi se hi karna.",
          "Thoda sa hi, bas set kar do.",
        ],
        intervalMs: 5000,
      },
      visitorCounter: { enabled: true, label: "people vibing here" },
      ambient: { enabled: true, sound: "rain" as const },
      reactions: { enabled: true, emojis: ["🔥", "❤️", "😂", "🥹", "💈"] },
      tipJar: { enabled: true, upiId: "satyam@upi", buttonText: "🍵 Chai pilao" },
      dayNight: { enabled: true },
      faq: {
        enabled: true,
        items: [
          { q: "What is this?", a: "A nostalgic ambient radio page. Free, no signup." },
          { q: "Kya music milega?", a: "2000s Bollywood, barbershop chatter, and dher saara nostalgia." },
        ],
      },
      social: { enabled: true, whatsapp: "+91 98765 43210" },
    },
  };

  return (
    <div className="h-svh">
      <SiteRenderer config={config} mode="preview" />
    </div>
  );
}
