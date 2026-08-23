import type { Metadata } from "next";
import UiSounds from "@/app/components/UiSounds";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import MultistateButtonDemo from "@/app/components/playground/MultistateButtonDemo";
import { playgroundMorphId } from "@/app/motion-variants";

export const metadata: Metadata = {
  title: "Multistate Button | Petar Marković",
  description:
    "An action button implemented from a Figma design: a subtle square grid rings its edges, floods the field while it works, and settles with a success ripple.",
};

export default function MultistateButtonPage() {
  return (
    <div className="page">
      <UiSounds hover={false} />
      <ComponentShowcase
        title="Multistate Button"
        align="center"
        morphId={playgroundMorphId("multistate-button")}
        description="A generate button with three states. A subtle square grid hugs the
          edges at rest; clicking floods the field with pulsing cells while the
          work runs, and a soft ripple rolls out when the report lands. Use the
          picker to pin any state in place, or click the button and watch the
          picker follow the flow."
      >
        <MultistateButtonDemo />
      </ComponentShowcase>
    </div>
  );
}
