import type { Metadata } from "next";
import UiSounds from "@/app/components/UiSounds";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import MultistateButtonDemo from "@/app/components/playground/MultistateButtonDemo";
import { playgroundMorphId } from "@/app/motion-variants";

export const metadata: Metadata = {
  title: "Multistate Button | Petar Marković",
  description:
    "A four-state generate button: a square grid rings it at rest, floods it while it works, and ripples green on success or red on error.",
};

export default function MultistateButtonPage() {
  return (
    <div className="page">
      <UiSounds hover={false} />
      <ComponentShowcase
        title="Multistate Button"
        align="center"
        morphId={playgroundMorphId("multistate-button")}
        description="A generate button with four states. A square grid rings it at rest
          and floods it while the work runs; success ripples outward in green,
          error collapses inward in red. Pin a state with the switcher, or
          click the button to run the full flow."
      >
        <MultistateButtonDemo />
      </ComponentShowcase>
    </div>
  );
}
