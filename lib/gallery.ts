/* Built-in hero/background art — a consistent set of nostalgic Indian
   storefront illustrations so a page looks great with zero uploads. */

export interface GalleryImage {
  src: string;
  label: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: "/gallery/audio-centre.jpg", label: "Audio Centre" },
  { src: "/gallery/music-sansar.jpg", label: "Cassette Shop" },
  { src: "/gallery/deluxe-hair-saloon.jpg", label: "Hair Saloon" },
  { src: "/gallery/gupta-tea-stall.jpg", label: "Tea Stall" },
  { src: "/gallery/sharma-tea-stall.jpg", label: "Chai Tapri" },
  { src: "/gallery/punjab-dhaba.jpg", label: "Highway Dhaba" },
  { src: "/gallery/independence-day.jpg", label: "15 August" },
];
