"use client";

import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { defineSound } from "@web-kits/audio";
import { toggleOn } from "@/.web-kits/core";
import { useSoundEnabled } from "@/app/hooks/useSoundEnabled";
import { setSoundEnabled } from "@/app/sound-preference";
import "./SoundToggle.scss";

const playToggleOn = defineSound(toggleOn);

/**
 * The site's sound switch: a toggle button at the top of every page. Sound
 * is off until the visitor turns it on here, and the choice persists (see
 * sound-preference.ts). Haptics are not affected.
 */
function SoundToggle() {
  const enabled = useSoundEnabled();

  const toggle = () => {
    const next = !enabled;
    setSoundEnabled(next);
    // Turning sound on answers with one: this click is the gesture the
    // browser needs to start audio, and the chirp confirms it works.
    // Turning it off is silent.
    if (next) playToggleOn();
  };

  return (
    <button
      type="button"
      className="icon-button sound-toggle"
      aria-label="Sound"
      aria-pressed={enabled}
      // The toggle speaks for itself above; no delegated tap on top.
      data-sound="none"
      onClick={toggle}
    >
      {enabled ? (
        <Volume2 size={16} aria-hidden="true" />
      ) : (
        <VolumeX size={16} aria-hidden="true" />
      )}
    </button>
  );
}

export default SoundToggle;
