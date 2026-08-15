/* Built-in hero/background art — a consistent set of nostalgic Indian
   storefront illustrations so a page looks great with zero uploads. */

export interface GalleryImage {
  src: string;
  label: string;
}

/* Shown in the gallery picker so users can generate matching art with
   ChatGPT/any image model — same style spec that produced the built-ins. */
export const GALLERY_PROMPT = `Create a wide illustrated storefront scene in a nostalgic 2000s-Indian-street aesthetic. Subject: [YOUR SHOP — e.g. a roadside chai tapri with a steaming kettle]. Golden-hour light, warm amber glow, hazy dusk sky. Flat illustration with subtle grain, muted warm palette (cream, terracotta, deep green, faded red), hand-painted bilingual Hindi + English signboard. Era details: painted shutters, hanging tube light, plastic chairs, an old radio, tangled electric wires overhead, faded film posters. Eye-level view, storefront centered, no modern elements. Aspect ratio 16:9, high detail.`;

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: "/gallery/audio-centre.jpg", label: "Audio Centre" },
  { src: "/gallery/music-sansar.jpg", label: "Cassette Shop" },
  { src: "/gallery/deluxe-hair-saloon.jpg", label: "Hair Saloon" },
  { src: "/gallery/gupta-tea-stall.jpg", label: "Tea Stall" },
  { src: "/gallery/sharma-tea-stall.jpg", label: "Chai Tapri" },
  { src: "/gallery/punjab-dhaba.jpg", label: "Highway Dhaba" },
  { src: "/gallery/independence-day.jpg", label: "15 August" },
];
