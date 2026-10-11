import type { Metadata } from "next";
import PageShell from "@/app/components/PageShell";
import UiSounds from "@/app/components/UiSounds";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import SliderDemo from "@/app/components/playground/SliderDemo";
import { playgroundMorphId } from "@/app/motion-variants";

export const metadata: Metadata = {
  title: "Slider | Petar Marković",
  description:
    "A percentage slider: the fill tracks the pointer, the readout hops above the track near the edges, and snap mode adds magnetic 10% detents.",
};

export default function SliderPage() {
  return (
    <PageShell>
      <UiSounds hover={false} />
      <ComponentShowcase
        title="Slider"
        morphId={playgroundMorphId("slider")}
        description="A percentage slider. The fill tracks the pointer and the readout
          counts along, hopping above the track when it nears the edge. Snap
          mode makes the fill magnetic, ticking between 10% marks."
      >
        <SliderDemo />
      </ComponentShowcase>
    </PageShell>
  );
}
