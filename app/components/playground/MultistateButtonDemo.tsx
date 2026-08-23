"use client";

import React, { useCallback, useState } from "react";
import MultistateButton, { type Phase } from "./MultistateButton";
import Picker from "./Picker";
import "./MultistateButtonDemo.scss";

const STATE_OPTIONS: { value: Phase; label: string }[] = [
  { value: "idle", label: "Idle" },
  { value: "generating", label: "Generating" },
  { value: "success", label: "Success" },
];

/**
 * Demo wiring for the multistate-button page. The picker pins the button to
 * any of its three states for inspection — pinned "generating" pulses
 * forever, re-picking "success" replays the ripple. Clicking the button
 * itself releases the pin and runs the real simulated flow, with the
 * picker's selection following along.
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
    <div className="multistate-button-demo">
      <MultistateButton
        pinnedPhase={pinned ? phase : null}
        onPhaseChange={follow}
      />
      <Picker
        label="Button state"
        options={STATE_OPTIONS}
        value={phase}
        onChange={pick}
      />
    </div>
  );
}

export default MultistateButtonDemo;
