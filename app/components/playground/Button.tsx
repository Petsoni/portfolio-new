"use client";

import React from "react";
import { LoaderCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePress, type PressHandlers } from "./usePress";
import "./Button.scss";

/**
 * `solid` is the one main action, in a satin face; `outline` its companion;
 * `ghost` has no surface until hovered, for the quiet way out; `spotlight`
 * is the satin in ember, in a glow with sparks rising inside, for the one
 * thing on a screen that should catch the eye.
 */
export type ButtonVariant = "solid" | "outline" | "ghost" | "spotlight";

type OwnPressHandlers = Partial<PressHandlers<HTMLButtonElement>>;

/** What a Button and an IconButton share: press tracking and the busy state. */
function useTactile(
  {
    disabled,
    isLoading,
    onClick,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    onKeyDown,
    onKeyUp,
    onBlur,
  }: OwnPressHandlers & {
    disabled: boolean;
    isLoading: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  },
) {
  const { isPressed, pressHandlers } = usePress(disabled || isLoading, {
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    onKeyDown,
    onKeyUp,
    onBlur,
  });

  return {
    disabled,
    "data-pressed": isPressed || undefined,
    "data-loading": isLoading || undefined,
    // Busy is aria-disabled, not disabled: a disabled button drops focus,
    // and the keyboard user who pressed it would be thrown to the page.
    "aria-disabled": isLoading || undefined,
    "aria-busy": isLoading || undefined,
    // A busy button swallows the click, so the delegated tap and buzz
    // (UiSounds) stand down with it.
    ...(isLoading && { "data-sound": "none", "data-haptic": "none" }),
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isLoading) return;
      onClick?.(event);
    },
    ...pressHandlers,
  };
}

// The sparks rising inside the spotlight: spread evenly across its face,
// each with a size (px), a rise time (s) and a head start (s) — how far into
// its rise it already is when the button appears, so they begin scattered up
// the face instead of all at the foot. Worked out rather than random, so the
// server and the client draw the same ones.
const SPARK_COUNT = 14;
const SPARK_SIZES = [2, 2.5, 3];
const SPARKS = Array.from({ length: SPARK_COUNT }, (_, index) => ({
  left: `${(((index + 0.5) / SPARK_COUNT) * 100).toFixed(1)}%`,
  size: SPARK_SIZES[index % SPARK_SIZES.length],
  rise: 2.6 + ((index * 3) % 5) * 0.25, // 2.6–3.6s
  headStart: (((index * 5) % SPARK_COUNT) / SPARK_COUNT) * 3, // 0–3s
}));

/** The spotlight's glow round its edge and the sparks inside its face. */
function SpotlightDressing() {
  return (
    <>
      <span className="tactile-button-glow" aria-hidden="true" />
      <span className="tactile-button-sparks" aria-hidden="true">
        {SPARKS.map((spark) => (
          <span
            key={spark.left}
            className="tactile-button-spark"
            style={{
              left: spark.left,
              width: spark.size,
              animationDuration: `${spark.rise}s`,
              animationDelay: `${-spark.headStart}s`,
            }}
          />
        ))}
      </span>
    </>
  );
}

// 16px, like the site's other inline icons.
const ICON_SIZE = 16;

function Spinner() {
  return (
    <LoaderCircle
      size={ICON_SIZE}
      className="tactile-button-spinner"
      aria-hidden="true"
    />
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** A Lucide icon beside the label. */
  icon?: LucideIcon;
  iconPosition?: "start" | "end";
  /** A spinner takes the contents' place; the button keeps its width. */
  isLoading?: boolean;
}

/**
 * A button built around the press: it sinks the instant it is pressed,
 * lets go if the pointer is dragged off, and springs back on release.
 */
export function Button({
  children,
  variant = "solid",
  icon: Icon,
  iconPosition = "start",
  isLoading = false,
  disabled = false,
  className,
  type = "button",
  onClick,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
  onKeyDown,
  onKeyUp,
  onBlur,
  ...rest
}: ButtonProps) {
  const tactile = useTactile({
    disabled,
    isLoading,
    onClick,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    onKeyDown,
    onKeyUp,
    onBlur,
  });
  const icon = Icon ? (
    <Icon size={ICON_SIZE} className="tactile-button-icon" aria-hidden="true" />
  ) : null;

  return (
    <button
      type={type}
      className={cn("tactile-button", className)}
      data-variant={variant}
      {...rest}
      {...tactile}
    >
      {variant === "spotlight" && <SpotlightDressing />}
      {iconPosition === "start" && icon}
      <span className="tactile-button-label">{children}</span>
      {iconPosition === "end" && icon}
      {isLoading && <Spinner />}
    </button>
  );
}

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: LucideIcon;
  /** Names the action: the button has no text of its own. */
  "aria-label": string;
  /**
   * `raised` is a 44px circle on a surface of its own, for a button that
   * stands alone; `ghost` has no surface until hovered, for a row of tools.
   */
  variant?: "raised" | "ghost";
  isLoading?: boolean;
}

/** A round button with only an icon, pressing like Button. */
export function IconButton({
  icon: Icon,
  variant = "raised",
  isLoading = false,
  disabled = false,
  className,
  type = "button",
  onClick,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
  onKeyDown,
  onKeyUp,
  onBlur,
  ...rest
}: IconButtonProps) {
  const tactile = useTactile({
    disabled,
    isLoading,
    onClick,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    onKeyDown,
    onKeyUp,
    onBlur,
  });

  return (
    <button
      type={type}
      className={cn("tactile-icon-button", className)}
      data-variant={variant}
      {...rest}
      {...tactile}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <Icon size={ICON_SIZE} aria-hidden="true" />
      )}
    </button>
  );
}
