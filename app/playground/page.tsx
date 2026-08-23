import type { Metadata } from "next";
import UiSounds from "@/app/components/UiSounds";
import PlaygroundShowcase from "@/app/components/playground/PlaygroundShowcase";

export const metadata: Metadata = {
  title: "Playground | Petar Marković",
  description:
    "A growing collection of interface components — each one implemented from a Figma design and animated with Motion.",
};

export default function PlaygroundPage() {
  return (
    <div className="page">
      <UiSounds />
      <PlaygroundShowcase />
    </div>
  );
}
