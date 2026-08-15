import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PreviewPane } from "@/components/editor/PreviewPane";
import { SiteRenderer } from "@/components/renderer/SiteRenderer";
import { defaultConfig, type SiteConfig } from "@/lib/site-config";

const demoConfig: SiteConfig = {
  ...defaultConfig("डीलक्स सैलून"),
  meta: {
    siteName: "डीलक्स सैलून",
    tagline: "गली के उस मोड़ पर · since 2004",
    aboutText: "",
  },
  images: { hero: "/gallery/audio-centre.jpg", background: null, logo: null },
  themeId: "barbershop",
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
        "Bhai saab, piche se slope cut karu ki V-shape? — Pappu Ustad",
        "Machine nahi, kainchi se hi karna.",
        "Thoda sa hi, bas set kar do.",
      ],
      intervalMs: 5000,
    },
    visitorCounter: { enabled: true, label: "people vibing here" },
    faq: { enabled: false, items: [] },
    reactions: { enabled: true, emojis: ["🔥", "❤️", "😂", "🥹", "💈"] },
    tipJar: { enabled: true, upiId: "demo@upi", buttonText: "🍵 Chai pilao" },
    dayNight: { enabled: false },
    ambient: { enabled: true, sound: "rain" },
    social: { enabled: true, whatsapp: "+91 98765 43210", email: "hi@example.com" },
  },
};

const steps = [
  {
    n: "1",
    title: "Add your vibe",
    text: "Upload a photo, write a name, paste any YouTube / Spotify playlist link.",
  },
  {
    n: "2",
    title: "Flip on widgets",
    text: "Clock, live listeners, rotating quotes, emoji reactions, rain sounds, a UPI tip jar.",
  },
  {
    n: "3",
    title: "Publish",
    text: "One click and it's live at yourname.yourdomain — share it on WhatsApp.",
  },
];

const features = [
  ["📻", "Music that just plays", "Paste a playlist link — visitors get a retro player, no video clutter."],
  ["🟢", "Alive, together", "A real count of who's listening right now, on every open screen."],
  ["🔥", "Live reactions", "Someone taps 🔥 and it floats up for everyone at that moment."],
  ["🍵", "UPI tip jar", "One tap opens the visitor's UPI app with your ID pre-filled."],
  ["🌧", "Ambient layers", "Rain, ceiling fan, or crickets — synthesized live under the music."],
  ["🌙", "Day & night", "The page tint follows each visitor's local clock."],
] as const;

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-6 py-4 sm:px-10">
        <span className="text-lg">
          <Logo size={26} />
        </span>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="hover:underline">
            Log in
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-[#b3402a] px-4 py-2 font-medium text-[#faf6ef] hover:bg-[#9a3624]"
          >
            Create your radio
          </Link>
        </nav>
      </header>

      {/* Hero: claim + LIVE demo */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-8 pt-14 text-center">
        <p className="mb-4 rounded-full border border-[#2a2118]/15 px-3 py-1 text-xs uppercase tracking-widest text-[#2a2118]/60">
          nostalgia, as a service
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Turn a photo and a playlist into a{" "}
          <span className="text-[#b3402a]">living radio page</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-[#2a2118]/70">
          Like a 2000s barbershop radio that never switched off — published on
          your own subdomain in two minutes. No code.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-md bg-[#b3402a] px-6 py-3 font-medium text-[#faf6ef] hover:bg-[#9a3624]"
          >
            Start building — it&apos;s free
          </Link>
        </div>

        <div className="mt-12 w-full">
          <p className="mb-3 text-xs uppercase tracking-widest text-[#2a2118]/40">
            this is a real page — the clock ticks, the quotes rotate, tap the emoji
          </p>
          <div className="aspect-[1280/832] w-full">
            <PreviewPane>
              <SiteRenderer config={demoConfig} mode="preview" />
            </PreviewPane>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-4xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold">
          Three steps, two minutes
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="flex flex-col items-center text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b3402a] font-mono text-lg font-bold text-[#faf6ef]">
                {step.n}
              </span>
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-[#2a2118]/60">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-[#2a2118]/10 bg-white/50">
        <div className="mx-auto grid w-full max-w-4xl gap-x-10 gap-y-8 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([icon, title, text]) => (
            <div key={title} className="flex gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-0.5 text-sm text-[#2a2118]/60">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Your corner of the internet is waiting
        </h2>
        <p className="mt-3 font-mono text-sm text-[#2a2118]/50">
          yourname.{process.env.NEXT_PUBLIC_ROOT_DOMAIN?.split(":")[0]}
        </p>
        <Link
          href="/login"
          className="mt-8 rounded-md bg-[#b3402a] px-6 py-3 font-medium text-[#faf6ef] hover:bg-[#9a3624]"
        >
          Create your radio — free
        </Link>
      </section>

      <footer className="px-6 py-6 text-center text-xs text-[#2a2118]/40">
        Inspired by the 2000s. Built for the internet.
      </footer>
    </main>
  );
}
