import type { Metadata } from "next";
import UiSounds from "@/app/components/UiSounds";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import Dropdown from "@/app/components/playground/Dropdown";

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
    "An expanding select implemented from a two-state Figma design and animated with Motion.",
};

export default function DropdownPage() {
  return (
    <div className="page">
      <UiSounds />
      <ComponentShowcase
        title="Dropdown"
        description="An expanding select. The closed pill grows a soft panel around itself,
          the options bloom in with a blur stagger, and the whole thing is fully
          keyboard-accessible."
      >
        <Dropdown label="Discipline" options={dropdownOptions} />
      </ComponentShowcase>
    </div>
  );
}
