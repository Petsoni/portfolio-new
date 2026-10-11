import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { playgroundItems } from "@/lib/playground";

const item = playgroundItems.find((entry) => entry.id === "multistate-button")!;

export const alt = `${item.name} — ${item.meta}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ title: item.name, subtitle: item.meta });
}
