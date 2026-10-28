import React from "react";
import TransitionLink from "@/app/components/TransitionLink";
import { playgroundItems } from "@/lib/playground";

function PlaygroundSection() {
  return (
    <section
      id="playground"
      className="section experience-section enter"
      style={{ "--i": 5 } as React.CSSProperties}
    >
      <h2>Playground</h2>
      <div className="experience-list">
        {playgroundItems.map((item) => (
          <TransitionLink
            key={item.id}
            href={item.href}
            className="experience-row"
            data-sound="expand"
          >
            <span className="experience-name">{item.name}</span>
            <span className="separator"></span>
            <span className="experience-duration">{item.meta}</span>
          </TransitionLink>
        ))}
      </div>
    </section>
  );
}

export default PlaygroundSection;
