import React from "react";
import TransitionLink from "@/app/components/TransitionLink";
import { visibleWork } from "@/lib/work";
import "./WorkSection.scss";

/**
 * The home page's Work section: one card per case study, each linking to
 * /work/[slug]. Renders nothing at all while there is nothing to show — an
 * empty heading or empty cards never ship (see `published` in lib/work.ts).
 */
function WorkSection() {
  if (visibleWork.length === 0) return null;

  return (
    <section
      id="work"
      className="section work-section enter"
      style={{ "--i": 4 } as React.CSSProperties}
    >
      <h2>Work</h2>
      <ul className="work-list">
        {visibleWork.map((entry) => (
          <li key={entry.slug}>
            <TransitionLink
              href={`/work/${entry.slug}`}
              className="work-card"
              data-sound="expand"
            >
              <h3 className="work-card-title">{entry.title}</h3>
              <p className="work-card-summary">{entry.summary}</p>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default WorkSection;
