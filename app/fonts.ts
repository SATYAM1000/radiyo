import {
  Anek_Devanagari,
  Baloo_2,
  IBM_Plex_Mono,
  Modak,
  Rozha_One,
  Space_Grotesk,
  Teko,
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

// Extra heavy display faces for the hero title — all cover Devanagari too.
export const balooFont = Baloo_2({
  weight: "800",
  subsets: ["latin", "devanagari"],
  variable: "--font-baloo",
});
export const modakFont = Modak({
  weight: "400", // Modak has one weight; it's naturally massive
  subsets: ["latin", "devanagari"],
  variable: "--font-modak",
});
export const tekoFont = Teko({
  weight: "700",
  subsets: ["latin", "devanagari"],
  variable: "--font-teko",
});
export const anekFont = Anek_Devanagari({
  weight: "800",
  subsets: ["latin", "devanagari"],
  variable: "--font-anek",
});

export const themeFontVariables = `${themeSerif.variable} ${themeMono.variable} ${themeSans.variable} ${displayFont.variable} ${balooFont.variable} ${modakFont.variable} ${tekoFont.variable} ${anekFont.variable}`;
