import {
  IBM_Plex_Mono,
  Rozha_One,
  Space_Grotesk,
  Yatra_One,
} from "next/font/google";

// Same stack as deluxsalon.in: Yatra One for poster titles (Devanagari
// display face, naturally heavy at its single 400 weight), Space Grotesk
// for UI, Rozha One for serif accents like quotes.
export const displayFont = Yatra_One({
  weight: "400",
  subsets: ["latin", "devanagari"],
  variable: "--font-display",
});

export const themeSerif = Rozha_One({
  weight: "400",
  subsets: ["latin", "devanagari"],
  variable: "--font-theme-serif",
});

export const themeMono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-theme-mono",
});

export const themeSans = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-theme-sans",
});

export const themeFontVariables = `${themeSerif.variable} ${themeMono.variable} ${themeSans.variable} ${displayFont.variable}`;
