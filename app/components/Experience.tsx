"use client";

import React, { useRef, useState } from "react";
import workHistory from "@/lib/work-history.json";
import { motion } from "motion/react";
import ExperienceModal, {
  WorkModel,
  workLayoutId,
} from "@/app/components/ExperienceModal";
import { returnSpring } from "@/app/motion-variants";

function Experience() {
  const [selected, setSelected] = useState<WorkModel | null>(null);
  // The row that opened the dialog — where focus returns when it closes.
  const openerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <section
      className="section experience-section enter"
      style={{ "--i": 6 } as React.CSSProperties}
    >
      <h2>Experience</h2>
      <div className="experience-list">
        {(workHistory as WorkModel[]).map((work) => (
          <motion.button
            type="button"
            className={"experience-row"}
            key={work.id}
            layoutId={workLayoutId(work.id)}
            style={{ borderRadius: 8 }}
            // Calm return spring: the row leads the close morph, while the
            // card's bouncier morphSpring still drives the open.
            transition={{ layout: returnSpring }}
            onClick={(event) => {
              openerRef.current = event.currentTarget;
              setSelected(work);
            }}
            aria-haspopup="dialog"
            data-sound="none"
          >
            <span className={"experience-name"}>{work.title}</span>
            <span className="separator"></span>
            <span className={"experience-duration"}>{work.duration}</span>
          </motion.button>
        ))}
      </div>
      <ExperienceModal
        work={selected}
        onClose={() => setSelected(null)}
        openerRef={openerRef}
      />
    </section>
  );
}

export default Experience;
