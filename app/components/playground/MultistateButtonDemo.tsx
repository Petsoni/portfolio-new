"use client";

import React, { useCallback, useState } from "react";
import MultistateButton, { type Phase } from "./MultistateButton";
import ShowcaseStage from "./ShowcaseStage";
import VariantSwitcher from "./VariantSwitcher";

const STATE_OPTIONS: { value: Phase; label: string }[] = [
  { value: "idle", label: "Idle" },
  { value: "generating", label: "Generating" },
  { value: "success", label: "Success" },
  { value: "error", label: "Error" },
];

/**
 * Demo wiring for the multistate-button page. The variant switcher in the
 * stage bar pins the button to any of its states for inspection — pinned
 * "generating" pulses forever, re-picking "success" or "error" replays its
 * ripple. Clicking the button itself releases the pin and runs the real
 * simulated flow (a retry, when clicked on a pinned error), with the
 * switcher's selection following along.
 */
function MultistateButtonDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [pinned, setPinned] = useState(false);

  // The button advanced on its own (click or timer): follow, don't hold.
  const follow = useCallback((next: Phase) => {
    setPhase(next);
    setPinned(false);
  }, []);

  const pick = useCallback((next: Phase) => {
    setPhase(next);
    setPinned(true);
  }, []);

  return (
    <ShowcaseStage
      align="center"
      bar={
        <VariantSwitcher
          label="Button state"
          options={STATE_OPTIONS}
          value={phase}
          onChange={pick}
        />
      }
    >
      <MultistateButton
        pinnedPhase={pinned ? phase : null}
        onPhaseChange={follow}
      />
    </ShowcaseStage>
  );
}

export default MultistateButtonDemo;
