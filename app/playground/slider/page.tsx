import type { Metadata } from "next";
import UiSounds from "@/app/components/UiSounds";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import SliderDemo from "@/app/components/playground/SliderDemo";
import { playgroundMorphId } from "@/app/motion-variants";

export const metadata: Metadata = {
  title: "Slider | Petar Marković",
  description:
    "A percentage slider implemented from a Figma design: the fill chases the pointer, snaps between magnetic detents, and its readout hops above the track when the edge crowds it.",
};

export default function SliderPage() {
  return (
    <div className="page">
      <UiSounds hover={false} />
      <ComponentShowcase
        title="Slider"
        align="center"
        morphId={playgroundMorphId("slider")}
        description="A percentage slider from a Figma design. Press or drag
          anywhere and the fill follows, its readout counting along — when
          the edge crowds the number, it hops above the track to stay
          readable. Switch to snap and the fill turns magnetic, ticking
          between the ruler marks. And max it out — 100% earns a little
          celebration."
      >
        <SliderDemo />
      </ComponentShowcase>
    </div>
  );
}
