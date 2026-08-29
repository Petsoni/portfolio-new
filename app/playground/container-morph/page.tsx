import type { Metadata } from "next";
import UiSounds from "@/app/components/UiSounds";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import ContainerMorphDemo from "@/app/components/playground/ContainerMorphDemo";
import { playgroundMorphId } from "@/app/motion-variants";

export const metadata: Metadata = {
  title: "Container Morph | Petar Marković",
  description:
    "A payment flow as one continuously morphing container: the pill button collapses into a spinning arc beside a shimmering “Analysing transaction”, seals shut, and blooms into the receipt card — or, switched to decline, lands the failure with a refusal shake.",
};

export default function ContainerMorphPage() {
  return (
    <div className="page">
      <UiSounds hover={false} />
      <ComponentShowcase
        title="Container Morph"
        align="center"
        morphId={playgroundMorphId("container-morph")}
        description="One payment control, three lives. Click the pill and it
          collapses into a spinner running beside “Analysing transaction”,
          a light band sweeping the words while the payment runs; when the
          answer lands, the arc seals shut, glides back to centre, and blooms
          into the card as the details blur in. The switcher above picks the
          landing — the receipt, or a decline that arrives with a shake.
          Click the card to run it again."
      >
        <ContainerMorphDemo />
      </ComponentShowcase>
    </div>
  );
}
