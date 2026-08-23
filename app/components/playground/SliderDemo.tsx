"use client";

import React, { useState } from "react";
import Slider from "./Slider";
import Picker from "./Picker";
import "./SliderDemo.scss";

type Mode = "free" | "snap";

const MODE_OPTIONS: { value: Mode; label: string }[] = [
  { value: "free", label: "Free control" },
  { value: "snap", label: "Snap" },
];

/**
 * Demo wiring for the slider page: the slider on stage with a mode picker
 * below. "Free control" tracks the pointer continuously; "Snap" turns the
 * fill magnetic, hopping between 10% detents (and pulling the current value
 * onto one the moment you switch).
 */
function SliderDemo() {
  const [mode, setMode] = useState<Mode>("free");

  return (
    <div className="slider-demo">
      <Slider snap={mode === "snap"} label="Percentage" />
      <Picker
        label="Slider mode"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
      />
    </div>
  );
}

export default SliderDemo;
