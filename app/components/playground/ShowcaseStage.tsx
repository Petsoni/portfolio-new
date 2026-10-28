import React from "react";
import "./ShowcaseStage.scss";

interface ShowcaseStageProps {
  /** Controls seated in the bar above the canvas, e.g. a VariantSwitcher. */
  bar?: React.ReactNode;
  /**
   * Vertical placement of the demo on the canvas. "top" suits demos that
   * expand downward (e.g. the dropdown); "center" suits fixed-size ones.
   */
  align?: "top" | "center";
  /** The live demo, rendered on the stage's white canvas. */
  children: React.ReactNode;
}

/**
 * The stage from the Figma design — a soft gray frame holding an optional
 * bar and the white canvas with the live demo. The demo owns its switcher's
 * state, so it composes the stage itself and hands the switcher in as `bar`:
 * the bar is in the server HTML, and nothing moves at hydration.
 */
function ShowcaseStage({ bar, align = "top", children }: ShowcaseStageProps) {
  return (
    <div
      className="showcase-stage enter"
      style={{ "--i": 3 } as React.CSSProperties}
    >
      {bar && <div className="showcase-stage-bar">{bar}</div>}
      <div className="showcase-stage-canvas" data-align={align}>
        {children}
      </div>
    </div>
  );
}

export default ShowcaseStage;
