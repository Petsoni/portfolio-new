"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import BackLink from "@/app/components/BackLink";
import { returnSpring } from "@/app/motion-variants";
import { sourceUrl } from "@/lib/profile";
import "./ComponentShowcase.scss";

/** One line of the notes under a demo: what it covers, then the note. */
export interface ShowcaseNote {
  label: string;
  text: string;
}

interface ComponentShowcaseProps {
  title: string;
  description: string;
  /**
   * How the demo is built — technique, timing values, what can be
   * interrupted, reduced-motion behaviour, accessibility pattern — written
   * from the implementation.
   */
  notes: ShowcaseNote[];
  /** Repo-relative path of the component, for the "View source" link. */
  sourcePath: string;
  /**
   * layoutId shared with this component's playground row (see
   * playgroundMorphId). When set, the row's name morphs into this page's
   * title on navigation.
   */
  morphId?: string;
  /** The stage: a ShowcaseStage holding the live demo. */
  children: React.ReactNode;
}

/**
 * Shared scaffold for a component's dedicated playground page: back link,
 * title, short description, the stage with the live demo, and the notes on
 * how it is built. Every showcased component gets its own page from this.
 * Everything renders visible on the server; the entrance is the CSS .enter
 * stagger.
 */
function ComponentShowcase({
  title,
  description,
  notes,
  sourcePath,
  morphId,
  children,
}: ComponentShowcaseProps) {
  const reducedMotion = useReducedMotion();
  const source = sourceUrl(sourcePath);

  return (
    <section className="section component-showcase">
      {/* Anchor to the playground section so the morph target is on
          screen when the reverse flight plays. */}
      <BackLink href="/#playground" />
      {/* The morph target: flies in from the playground row's name, so it
          takes no entrance of its own. On a hard load there is no source
          element and it simply renders in place. Under reduced motion the
          pairing is dropped altogether, so the title never shows a frame at
          the row's position before settling. */}
      <motion.h1
        layoutId={reducedMotion ? undefined : morphId}
        transition={returnSpring}
        style={{ position: "relative", zIndex: 5 }}
      >
        {title}
      </motion.h1>
      <p className="enter" style={{ "--i": 1 } as React.CSSProperties}>
        {description}
      </p>
      {children}
      <section
        className="showcase-notes enter"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <header className="showcase-notes-header">
          <h2>Notes</h2>
          {source && (
            <a
              href={source}
              target="_blank"
              rel="noreferrer"
              data-sound="swoosh"
            >
              View source
            </a>
          )}
        </header>
        <dl className="showcase-notes-list">
          {notes.map((note) => (
            <div key={note.label}>
              <dt>{note.label}</dt>
              <dd>{note.text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </section>
  );
}

export default ComponentShowcase;
