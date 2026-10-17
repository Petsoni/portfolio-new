import type { Metadata } from "next";
import PageShell from "@/app/components/PageShell";
import UiSounds from "@/app/components/UiSounds";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import MultistateButtonDemo from "@/app/components/playground/MultistateButtonDemo";
import { playgroundMorphId } from "@/app/motion-variants";
import { pageMetadata } from "@/lib/metadata";

// How the demo is built, drafted from the implementation.
// TODO(petar): review the wording.
const notes = [
  {
    label: "Technique",
    text: "The grid is live SVG: 5px cells on a 6px pitch, laid out to the measured button. Each cell carries its distance from the corner and from the centre as CSS custom properties, so the glow and the ripples are plain CSS animations staggered per cell. While generating, a class is toggled on two random cells every 120ms, straight on the DOM, so the cells never re-render.",
  },
  {
    label: "Timing",
    text: "Label swap: 250ms ease-out with 7px of travel and a 5px blur. Pulses and ripples: 550ms ease-out, the ripple delayed by distance from the centre, up to 430ms. The run is simulated: 2.6s generating, then 1.8s on success.",
  },
  {
    label: "Interruption",
    text: "The switcher can pin any state at any moment, which pauses the run’s timers. Pressing the button releases the pin and runs the real flow. Generating and success ignore presses.",
  },
  {
    label: "Reduced motion",
    text: "No pulses and no ripples. The field holds a static tint instead (lit while generating, green or red for the outcome) and the labels crossfade.",
  },
  {
    label: "Accessibility",
    text: "The button’s name is its visible label, and a status region beside it announces Generating…, Report ready and Report failed. Outcomes carry an icon and text, never color alone.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Multistate Button | Petar Marković",
  description:
    "A four-state generate button: a square grid rings it at rest, floods it while it works, and ripples green on success or red on error.",
  path: "/playground/multistate-button",
});

export default function MultistateButtonPage() {
  return (
    <PageShell>
      <UiSounds hover={false} />
      <ComponentShowcase
        title="Multistate Button"
        morphId={playgroundMorphId("multistate-button")}
        notes={notes}
        sourcePath="app/components/playground/MultistateButton.tsx"
        description="A generate button with four states. A square grid rings it at rest
          and floods it while the work runs; success ripples outward in green,
          error collapses inward in red. Pin a state with the switcher, or
          click the button to run the full flow."
      >
        <MultistateButtonDemo />
      </ComponentShowcase>
    </PageShell>
  );
}
