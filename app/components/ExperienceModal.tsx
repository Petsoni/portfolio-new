"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export interface WorkModel {
  id: number;
  title: string;
  link: string;
  image: string;
  duration: string;
  roles: string[];
  description: string;
}

// Shared between the experience rows and the modal card so the clicked row
// morphs into the card on open and back into the list on close.
export const workLayoutId = (id: number) => `experience-work-${id}`;

// Springier than critical damping — the card arrives with a soft overshoot.
export const morphSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 22,
  mass: 0.9,
};

// Near-critically damped spring for the close morph. The row drives the
// return animation (it becomes the lead element when the card exits), and any
// overshoot there makes the row text look squished as the box wobbles.
export const returnSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 34,
  mass: 0.9,
};

const contentGroup = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
  exit: {},
};

interface ExperienceModalProps {
  work: WorkModel | null;
  onClose: () => void;
}

function ExperienceModal({ work, onClose }: ExperienceModalProps) {
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!work) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    cardRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [work, onClose]);

  if (!mounted) return null;

  // Content blooms in with the site's blur-stagger signature.
  const contentItem = {
    hidden: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 8, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.25, ease: "easeOut" as const },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.1, ease: "easeOut" as const },
    },
  };

  const paragraphs = work
    ? work.description.split("\n").map((line) => line.trim()).filter(Boolean)
    : [];

  return createPortal(
    <AnimatePresence>
      {work && (
        <>
          <motion.div
            key="experience-modal-overlay"
            className="experience-modal-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          <div key="experience-modal-root" className="experience-modal-root">
            <motion.div
              ref={cardRef}
              className="experience-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`${work.title} experience details`}
              tabIndex={-1}
              layoutId={workLayoutId(work.id)}
              style={{ borderRadius: 12 }}
              transition={{ layout: morphSpring }}
            >
              <motion.div
                className="experience-modal-side"
                variants={contentGroup}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="experience-modal-side-top">
                  <motion.div
                    className="experience-modal-heading"
                    variants={contentItem}
                  >
                    <h3 className="experience-modal-title">{work.title}</h3>
                    <span className="experience-modal-duration">
                      {work.duration}.
                    </span>
                  </motion.div>
                  {work.link && (
                    <motion.div variants={contentItem}>
                      <Link
                        href={work.link}
                        target="_blank"
                        className="experience-modal-visit"
                        data-sound="swoosh"
                      >
                        <span>Visit website</span>
                        <ArrowUpRight size={20} />
                      </Link>
                    </motion.div>
                  )}
                </div>
                <motion.div
                  className="experience-modal-roles"
                  variants={contentItem}
                >
                  {work.roles.map((role) => (
                    <span key={role}>{role}</span>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                className="experience-modal-body"
                variants={contentGroup}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {paragraphs.map((paragraph, index) => (
                  <motion.p key={index} variants={contentItem}>
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default ExperienceModal;
