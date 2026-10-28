import type { Metadata } from "next";
import PageShell from "@/app/components/PageShell";
import UiSounds from "@/app/components/UiSounds";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import Dropdown from "@/app/components/playground/Dropdown";
import ShowcaseStage from "@/app/components/playground/ShowcaseStage";
import { pageMetadata } from "@/lib/metadata";

const dropdownOptions = [
  "Software Development",
  "Product Design",
  "Data & Analytics",
  "Marketing",
  "Customer Support",
];

// How the demo is built, drafted from the implementation.
// TODO(petar): review the wording.
const notes = [
  {
    label: "Technique",
    text: "The trigger never moves. A decorative frame behind it springs its insets from the trigger’s box out to the panel’s edge while the list springs from height 0 to auto. Options rise 6px out of a 6px blur, 30ms apart.",
  },
  {
    label: "Timing",
    text: "Open spring 320 / 27 and close spring 380 / 34 (stiffness / damping), both at mass 0.9: a livelier open, and a calmer close so the frame doesn’t wobble under the trigger. Each option fades in over 250ms.",
  },
  {
    label: "Interruption",
    text: "Every value is a spring that retargets from where it is, so toggling mid-animation reverses from the current height instead of jumping. Hover and arrow keys move one shared highlight.",
  },
  {
    label: "Reduced motion",
    text: "The list appears at full height and crossfades over 240ms. The frame only changes color, and the chevron flips without rotating.",
  },
  {
    label: "Accessibility",
    text: "WAI-ARIA listbox. The trigger is named by its label and its value. Arrow keys, Home, End and typing move the highlight; Enter or Space selects; Escape closes back to the trigger; Tab closes and moves on. Selected carries a check, highlighted a fill and the focus ring.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Dropdown | Petar Marković",
  description:
    "An animated, keyboard-accessible select built with Motion from a two-state Figma design.",
  path: "/playground/dropdown",
});

export default function DropdownPage() {
  return (
    <PageShell>
      <UiSounds hover={false} />
      <ComponentShowcase
        title="Dropdown"
        notes={notes}
        sourcePath="app/components/playground/Dropdown.tsx"
        description="An animated select. The closed pill expands into a soft panel,
          the options stagger in with a blur, and it's fully keyboard-accessible."
      >
        <ShowcaseStage>
          <Dropdown label="Discipline" options={dropdownOptions} />
        </ShowcaseStage>
      </ComponentShowcase>
    </PageShell>
  );
}
