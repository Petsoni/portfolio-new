import type { Metadata } from "next";
import PageShell from "@/app/components/PageShell";
import UiSounds from "@/app/components/UiSounds";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import ContainerMorphDemo from "@/app/components/playground/ContainerMorphDemo";
import { playgroundMorphId } from "@/app/motion-variants";

export const metadata: Metadata = {
  title: "Container Morph | Petar Marković",
  description:
    "A payment flow in a single morphing container: button, spinner, and result card are one element continuously reshaping. Built with Motion.",
};

export default function ContainerMorphPage() {
  return (
    <PageShell>
      <UiSounds hover={false} />
      <ComponentShowcase
        title="Container Morph"
        morphId={playgroundMorphId("container-morph")}
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
