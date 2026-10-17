"use client";

import React, { useState } from "react";
import ShowcaseStage from "./ShowcaseStage";
import Slider from "./Slider";
import VariantSwitcher from "./VariantSwitcher";
import "./SliderDemo.scss";

type Mode = "free" | "snap";

const MODE_OPTIONS: { value: Mode; label: string }[] = [
  { value: "free", label: "Free control" },
  { value: "snap", label: "Snap" },
];

/**
 * Demo wiring for the slider page: the slider on the canvas with its mode
 * switcher in the stage bar. "Free control" tracks the pointer continuously;
 * "Snap" turns the fill magnetic, hopping between 10% detents (and pulling
 * the current value onto one the moment you switch).
 */
function SliderDemo() {
  const [mode, setMode] = useState<Mode>("free");

  return (
    <ShowcaseStage
      align="center"
      bar={
        <VariantSwitcher
          label="Slider mode"
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
        />
      }
    >
      <div className="slider-demo">
        <Slider snap={mode === "snap"} label="Percentage" />
      </div>
    </ShowcaseStage>
  );
}

export default SliderDemo;
