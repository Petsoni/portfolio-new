"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Ellipsis, Eye, Link2, Send, Share } from "lucide-react";
import { Button, IconButton } from "./Button";
import ShowcaseStage from "./ShowcaseStage";
import VariantSwitcher from "./VariantSwitcher";
import "./ButtonsDemo.scss";

type Pin = "default" | "loading" | "disabled";

const STATE_OPTIONS: { value: Pin; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "loading", label: "Loading" },
  { value: "disabled", label: "Disabled" },
];

// The two buttons that start (simulated) work when pressed, and what the
// status region says as it starts and as it ends.
type Action = "publish" | "access";

const STATUS: Record<Action, { start: string; end: string }> = {
  publish: { start: "Publishing…", end: "Published" },
  access: { start: "Requesting access…", end: "Access requested" },
};

const WORK_MS = 1600;

/**
 * Demo wiring for the buttons page: the whole set on the canvas, with a
 * switcher in the stage bar that pins every button to a state for
 * inspection. In Default, Publish and Get early access run a short
 * simulated job, loading on their own; the rest only press.
 */
function ButtonsDemo() {
  const [pin, setPin] = useState<Pin>("default");
  const [busy, setBusy] = useState<Record<Action, boolean>>({
    publish: false,
    access: false,
  });
  const [status, setStatus] = useState("");
  const timers = useRef(new Map<Action, number>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const run = (action: Action) => {
    setBusy((current) => ({ ...current, [action]: true }));
    setStatus(STATUS[action].start);
    timers.current.set(
      action,
      window.setTimeout(() => {
        timers.current.delete(action);
        setBusy((current) => ({ ...current, [action]: false }));
        setStatus(STATUS[action].end);
      }, WORK_MS),
    );
  };

  const pinnedLoading = pin === "loading";
  const disabled = pin === "disabled";
  const state = { isLoading: pinnedLoading, disabled };

  return (
    <ShowcaseStage
      align="center"
      bar={
        <VariantSwitcher
          label="Button state"
          options={STATE_OPTIONS}
          value={pin}
          onChange={setPin}
        />
      }
    >
      <div className="buttons-demo">
        <div className="buttons-demo-row">
          <Button
            variant="solid"
            icon={Send}
            data-sound="send"
            disabled={disabled}
            isLoading={pinnedLoading || busy.publish}
            onClick={() => run("publish")}
          >
            Publish
          </Button>
          <Button variant="outline" icon={Eye} {...state}>
            Preview
          </Button>
          <Button variant="ghost" {...state}>
            Discard
          </Button>
        </div>
        <div className="buttons-demo-row">
          <Button
            variant="spotlight"
            icon={ArrowRight}
            iconPosition="end"
            data-sound="swoosh"
            disabled={disabled}
            isLoading={pinnedLoading || busy.access}
            onClick={() => run("access")}
          >
            Get early access
          </Button>
        </div>
        <div className="buttons-demo-row">
          <IconButton variant="raised" icon={Share} aria-label="Share" {...state} />
          <IconButton
            variant="ghost"
            icon={Link2}
            aria-label="Copy link"
            {...state}
          />
          <IconButton
            variant="ghost"
            icon={Ellipsis}
            aria-label="More options"
            {...state}
          />
        </div>
        {/* Announces the simulated jobs. A sibling, not the buttons: a live
            region on the labelled control itself is announced unreliably. */}
        <p role="status" className="sr-only">
          {status}
        </p>
      </div>
    </ShowcaseStage>
  );
}

export default ButtonsDemo;
