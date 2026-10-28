import type { Metadata } from "next";
import PageShell from "@/app/components/PageShell";
import UiSounds from "@/app/components/UiSounds";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import SliderDemo from "@/app/components/playground/SliderDemo";
import { pageMetadata } from "@/lib/metadata";

// How the demo is built, drafted from the implementation.
// TODO(petar): review the wording.
const notes = [
  {
    label: "Technique",
    text: "One motion value, the fill’s percentage, drives everything: the fill, the counting readout, the handle, the ticks ducking under the edge, and the readout’s hop above the track. Dragging past an end stretches the whole track from its far edge along a rubber-band curve with a 48px range.",
  },
  {
    label: "Timing",
    text: "Springs, as stiffness / damping: detent hop 700 / 42, press and keyboard jumps 420 / 36, free drag 1200 / 80, readout hop 550 / 32, overdrag rebound 480 / 26.",
  },
  {
    label: "Interruption",
    text: "Everything. The pointer is captured for the whole drag and each spring retargets from its current velocity, so grabbing the track mid-glide or mid-rebound blends instead of snapping.",
  },
  {
    label: "Reduced motion",
    text: "The fill jumps to its value, there is no stretch, and the weave at 100% is a single still frame.",
  },
  {
    label: "Accessibility",
    text: "The track has the slider role, with its value exposed as text. Arrow keys step 1% (10% in snap mode), Page Up and Page Down 10%, Home and End go to the ends.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Slider | Petar Marković",
  description:
    "A percentage slider: the fill tracks the pointer, the readout hops above the track near the edges, and snap mode adds magnetic 10% detents.",
  path: "/playground/slider",
});

export default function SliderPage() {
  return (
    <PageShell>
      <UiSounds hover={false} />
      <ComponentShowcase
        title="Slider"
        notes={notes}
        sourcePath="app/components/playground/Slider.tsx"
        description="A percentage slider. The fill tracks the pointer and the readout
          counts along, hopping above the track when it nears the edge. Snap
          mode makes the fill magnetic, ticking between 10% marks."
      >
        <SliderDemo />
      </ComponentShowcase>
    </PageShell>
  );
}
