"use client";

import React, { useState } from "react";
import ContainerMorph, { type Outcome } from "./ContainerMorph";
import VariantSwitcher from "./VariantSwitcher";

const OUTCOME_OPTIONS: { value: Outcome; label: string }[] = [
  { value: "success", label: "Success" },
  { value: "declined", label: "Decline" },
];

/**
 * Demo wiring for the container-morph page. The variant switcher in the
 * stage bar arms the payment's outcome — which card the morph lands on.
 * Flipped while a card is open, the card reshapes in place (and a fresh
 * decline announces itself with the refusal shake).
 */
function ContainerMorphDemo() {
  const [outcome, setOutcome] = useState<Outcome>("success");

  return (
    <>
      <VariantSwitcher
        label="Payment outcome"
        options={OUTCOME_OPTIONS}
        value={outcome}
        onChange={setOutcome}
      />
      <ContainerMorph outcome={outcome} />
    </>
  );
}

export default ContainerMorphDemo;
