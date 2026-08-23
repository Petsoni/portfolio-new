"use client";

import { useEffect, useState } from "react";
import { HOME_RETURN_FLAG } from "@/app/motion-variants";

/**
 * Entrance gate for the home sections. Returns the value for a motion
 * component's `initial` prop: "hidden" plays the one-time fade-in (hard load
 * or refresh), false renders the section already settled (returning from a
 * showcase page via the Back link or the browser's back button).
 *
 * The flag read is render-safe (no side effects, so strict-mode double
 * renders agree); consumption happens in the effect. All home sections may
 * call this — the removal is idempotent and every initializer runs before
 * any effect clears the flag.
 */
export function useHomeEntrance(): "hidden" | false {
  const [returning] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem(HOME_RETURN_FLAG) === "1",
  );

  useEffect(() => {
    sessionStorage.removeItem(HOME_RETURN_FLAG);
  }, []);

  return returning ? false : "hidden";
}
