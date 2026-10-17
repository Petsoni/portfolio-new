import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Petar Marković — Design engineer";
export const size = ogSize;
export const contentType = ogContentType;

// The preview for the home page, and for any page without its own.
export default function Image() {
  return renderOgImage({
    title: "Petar Marković",
    subtitle: "Design engineer",
  });
}
