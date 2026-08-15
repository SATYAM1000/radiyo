import type { SiteConfig } from "@/lib/site-config";

export interface Theme {
  id: SiteConfig["themeId"];
  label: string;
  vars: {
    "--site-bg": string;
    "--site-surface": string;
    "--site-primary": string;
    "--site-accent": string;
    "--site-text": string;
    "--site-muted": string;
    "--site-border": string;
  };
  fontClass: string; // CSS class on the renderer root, set by app/fonts.ts
  texture?: "texture-grain" | "texture-halftone" | "texture-scanlines";
}

export const themes: Record<SiteConfig["themeId"], Theme> = {
  barbershop: {
    id: "barbershop",
    label: "Barbershop",
    vars: {
      "--site-bg": "#f6efe1",
      "--site-surface": "#fffaf0",
      "--site-primary": "#b3402a",
      "--site-accent": "#1f4d3a",
      "--site-text": "#2a2118",
      "--site-muted": "#2a211899",
      "--site-border": "#2a211826",
    },
    fontClass: "font-theme-serif",
    texture: "texture-grain",
  },
  cassette: {
    id: "cassette",
    label: "Cassette",
    vars: {
      "--site-bg": "#e8ddc7",
      "--site-surface": "#f5eeda",
      "--site-primary": "#d96c2c",
      "--site-accent": "#20707a",
      "--site-text": "#33291c",
      "--site-muted": "#33291c99",
      "--site-border": "#33291c26",
    },
    fontClass: "font-theme-mono",
    texture: "texture-halftone",
  },
  monsoon: {
    id: "monsoon",
    label: "Monsoon",
    vars: {
      "--site-bg": "#e7ebf0",
      "--site-surface": "#f4f6f9",
      "--site-primary": "#3b4a8f",
      "--site-accent": "#5b7a8c",
      "--site-text": "#232a35",
      "--site-muted": "#232a3599",
      "--site-border": "#232a3526",
    },
    fontClass: "font-theme-sans",
    texture: "texture-grain",
  },
  "neon-dhaba": {
    id: "neon-dhaba",
    label: "Neon Dhaba",
    vars: {
      "--site-bg": "#16121f",
      "--site-surface": "#221b30",
      "--site-primary": "#e945a5",
      "--site-accent": "#3ad6d0",
      "--site-text": "#f2ecf9",
      "--site-muted": "#f2ecf999",
      "--site-border": "#f2ecf926",
    },
    fontClass: "font-theme-sans",
    texture: "texture-scanlines",
  },
  sepia: {
    id: "sepia",
    label: "Sepia",
    vars: {
      "--site-bg": "#efe6d5",
      "--site-surface": "#f8f2e5",
      "--site-primary": "#7a5230",
      "--site-accent": "#9c6b3f",
      "--site-text": "#3a2e20",
      "--site-muted": "#3a2e2099",
      "--site-border": "#3a2e2026",
    },
    fontClass: "font-theme-serif",
    texture: "texture-grain",
  },
};
