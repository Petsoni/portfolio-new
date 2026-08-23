import type { Metadata } from "next";
import UiSounds from "@/app/components/UiSounds";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import MultistateButton from "@/app/components/playground/MultistateButton";

export const metadata: Metadata = {
  title: "Multistate Button | Petar Marković",
  description:
    "An action button implemented from a Figma design: a subtle square grid rings its edges, floods the field while it works, and settles with a success ripple.",
};

export default function MultistateButtonPage() {
  return (
    <div className="page">
      <UiSounds />
      <ComponentShowcase
        title="Multistate Button"
        align="center"
        description="A generate button with three states. A subtle square grid hugs the
          edges at rest; clicking floods the field with pulsing cells while the
          work runs, and a soft ripple rolls out when the report lands."
      >
        <MultistateButton />
      </ComponentShowcase>
    </div>
  );
}
