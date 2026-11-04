import type { Metadata } from "next";
import PageShell from "@/app/components/PageShell";
import UiSounds from "@/app/components/UiSounds";
import ButtonsDemo from "@/app/components/playground/ButtonsDemo";
import ComponentShowcase from "@/app/components/playground/ComponentShowcase";
import { pageMetadata } from "@/lib/metadata";

// How the demo is built, drafted from the implementation.
// TODO(petar): review the wording.
const notes = [
  {
    label: "Technique",
    text: "The press is tracked by hand rather than with :active. It turns on the instant the pointer goes down, off while the pointer is dragged away (a release out there doesn’t click), and back on when it returns; Space and Enter press it too. Each button’s looks are layers already painted on its pseudo-elements, the rest sheen on one and the pressed shade on the other, so a press only cross-fades them and moves the button: nothing but opacity and transform animates.",
  },
  {
    label: "Timing",
    text: "Press: 150ms ease-out to 97% scale, sinking 1px, with the pressed look on at once. Release: 300ms on a critically damped spring sampled into a CSS linear() curve, so it settles without overshoot, while the look fades back over 200ms. The spotlight’s glow breathes every 3.6s, and each spark rises over 2.6–3.6s.",
  },
  {
    label: "Interruption",
    text: "Transitions start from the value on screen, so pressing again during the release catches the button mid-spring. The switcher pins every button to a state at any moment. Loading keeps each button’s width: the spinner takes the contents’ place without moving the layout.",
  },
  {
    label: "Reduced motion",
    text: "No shrink and no sink, no sparks, and the glow holds still. The look still changes on press, and the spinner pulses instead of turning.",
  },
  {
    label: "Accessibility",
    text: "Native buttons. Loading sets aria-busy and aria-disabled rather than disabled, so focus stays on the button while it works; its label is faded rather than hidden, so it keeps its name, and a status region announces the job starting and ending. Icon buttons are named with aria-label, and the small ghost ones keep a 44px target. Hover only applies where a pointer can hover, so a tap never leaves a button lit.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Buttons | Petar Marković",
  description:
    "A tactile button set: buttons that press the instant the pointer goes down, let go when it is dragged away and spring back on release, with satin faces and a glowing spotlight.",
  path: "/playground/buttons",
});

export default function ButtonsPage() {
  return (
    <PageShell>
      <UiSounds hover={false} />
      <ComponentShowcase
        title="Buttons"
        notes={notes}
        sourcePath="app/components/playground/Button.tsx"
        description="A button set built around the press. Each button sinks the instant
          it is pressed, lets go if you drag away, and springs back when you
          release. The solid button wears a satin face; the spotlight adds a
          breathing glow and sparks. Pin a state with the switcher, or press
          Publish to watch it load."
      >
        <ButtonsDemo />
      </ComponentShowcase>
    </PageShell>
  );
}
