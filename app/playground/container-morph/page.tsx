import type { Metadata } from "next";
import PageShell from "@/app/components/PageShell";
import UiSounds from "@/app/components/UiSounds";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import ContainerMorphDemo from "@/app/components/playground/ContainerMorphDemo";
import { playgroundMorphId } from "@/app/motion-variants";
import { pageMetadata } from "@/lib/metadata";

// How the demo is built, drafted from the implementation.
// TODO(petar): review the wording.
const notes = [
  {
    label: "Technique",
    text: "One shell animates its measured width, height, radius and seat. The pill, the spinner and the card are layers centred inside it, each measured with a ResizeObserver, so the shell shrink-wraps whichever is active. It is the box that resizes, never a scale transform, so the text doesn’t stretch.",
  },
  {
    label: "Timing",
    text: "Springs, as stiffness / damping: collapse and slide 200 / 25, bloom into the card 400 / 30 at mass 0.9, return to the pill 440 / 34. Phases: 360ms collapse, 1.6s spin, 320ms seal. Layers fade in over 220ms and out over 160ms.",
  },
  {
    label: "Interruption",
    text: "The working phases ignore presses: a payment in flight shouldn’t restart. The finished card can be pressed at any point to run back to the pill, and switching the outcome reshapes an open card in place.",
  },
  {
    label: "Reduced motion",
    text: "The shell snaps to each shape and fades in over 240ms, the layers crossfade, and the spinner is a still ring. No shake on decline, no shimmer on the label.",
  },
  {
    label: "Accessibility",
    text: "The button’s name is always the action: Pay with card, Start over, Try again. A status region beside it announces each phase and the result, and describes the button, so the result is read again on focus.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Container Morph | Petar Marković",
  description:
    "A payment flow in a single morphing container: button, spinner, and result card are one element continuously reshaping. Built with Motion.",
  path: "/playground/container-morph",
});

export default function ContainerMorphPage() {
  return (
    <PageShell>
      <UiSounds hover={false} />
      <ComponentShowcase
        title="Container Morph"
        morphId={playgroundMorphId("container-morph")}
        notes={notes}
        sourcePath="app/components/playground/ContainerMorph.tsx"
        description="A payment flow in a single morphing container: button, spinner,
          and result card are the same element reshaping. The switcher sets
          the outcome, receipt or decline; clicking the finished card runs
          it again."
      >
        <ContainerMorphDemo />
      </ComponentShowcase>
    </PageShell>
  );
}
