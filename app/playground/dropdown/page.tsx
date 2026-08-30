import type { Metadata } from "next";
import UiSounds from "@/app/components/UiSounds";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import Dropdown from "@/app/components/playground/Dropdown";
import { playgroundMorphId } from "@/app/motion-variants";

const dropdownOptions = [
  "Software Development",
  "Product Design",
  "Data & Analytics",
  "Marketing",
  "Customer Support",
];

export const metadata: Metadata = {
  title: "Dropdown | Petar Marković",
  description:
    "An animated, keyboard-accessible select built with Motion from a two-state Figma design.",
};

export default function DropdownPage() {
  return (
    <div className="page">
      <UiSounds hover={false} />
      <ComponentShowcase
        title="Dropdown"
        morphId={playgroundMorphId("dropdown")}
        description="An animated select. The closed pill expands into a soft panel,
          the options stagger in with a blur, and it's fully keyboard-accessible."
      >
        <Dropdown label="Discipline" options={dropdownOptions} />
      </ComponentShowcase>
    </div>
  );
}
