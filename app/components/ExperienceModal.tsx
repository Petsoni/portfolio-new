"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export interface WorkModel {
  id: number;
  title: string;
  link: string;
  image: string;
  duration: string;
  roles: string[];
  description: string;
}

interface ExperienceModalProps {
  work: WorkModel | null;
  onClose: () => void;
}

function ExperienceModal({ work, onClose }: ExperienceModalProps) {
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!work) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("modal-open");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    cardRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
      document.body.style.overflow = previousOverflow;
    };
  }, [work, onClose]);

  if (!mounted) return null;

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
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{
                type: "spring",
                stiffness: 360,
                damping: 30,
                mass: 0.9,
                opacity: { duration: 0.2, ease: "easeOut" },
              }}
            >
              <div className="experience-modal-side">
                <div className="experience-modal-side-top">
                  <div className="experience-modal-heading">
                    <h3 className="experience-modal-title">{work.title}</h3>
                    <span className="experience-modal-duration">
                      {work.duration}.
                    </span>
                  </div>
                  {work.link && (
                    <Link
                      href={work.link}
                      target="_blank"
                      className="experience-modal-visit"
                    >
                      <span>Visit website</span>
                      <ArrowUpRight size={20} />
                    </Link>
                  )}
                </div>
                <div className="experience-modal-roles">
                  {work.roles.map((role) => (
                    <span key={role}>{role}</span>
                  ))}
                </div>
              </div>

              <div className="experience-modal-body">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default ExperienceModal;
