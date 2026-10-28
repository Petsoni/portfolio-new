import React from "react";
import BackLink from "@/app/components/BackLink";
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
  children,
}: ComponentShowcaseProps) {
  const source = sourceUrl(sourcePath);

  return (
    <section className="section component-showcase">
      {/* Anchor to the playground section: the visitor lands back where
          they left. */}
      <BackLink href="/#playground" />
      <h1 className="enter" style={{ "--i": 1 } as React.CSSProperties}>
        {title}
      </h1>
      <p className="enter" style={{ "--i": 2 } as React.CSSProperties}>
        {description}
      </p>
      {children}
      <section
        className="showcase-notes enter"
        style={{ "--i": 4 } as React.CSSProperties}
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
