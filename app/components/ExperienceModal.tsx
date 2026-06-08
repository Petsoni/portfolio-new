"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Globe } from "lucide-react";
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

function WorkedLine({ duration }: { duration: string }) {
  const [start, end] = duration.split("—").map((part) => part.trim());

  if (end && end.toLowerCase() === "present") {
    return (
      <p className="experience-sheet-meta">
        <span>Working here since </span>
        <span className="experience-sheet-strong">{start}</span>
        <span>.</span>
      </p>
    );
  }

  return (
    <p className="experience-sheet-meta">
      <span>Worked here from </span>
      <span className="experience-sheet-strong">{start}</span>
      <span> until </span>
      <span className="experience-sheet-strong">{end}</span>
      <span>.</span>
    </p>
  );
}

function RolesLine({
  roles,
  isPresent,
}: {
  roles: string[];
  isPresent: boolean;
}) {
  if (!roles || roles.length === 0) return null;

  return (
    <div className="experience-sheet-roles">
      {roles.map((role, index) => {
        const connector =
          index === 0
            ? isPresent
              ? "Here I am a"
              : "During my time here, I was a"
            : index === roles.length - 1
              ? "and a"
              : "a";

        return (
          <React.Fragment key={`${role}-${index}`}>
            <span className="experience-sheet-muted">{connector}</span>
            <span className="experience-role-chip">{role}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

interface ExperienceModalProps {
  work: WorkModel | null;
  onClose: () => void;
}

function ExperienceModal({ work, onClose }: ExperienceModalProps) {
  const [mounted, setMounted] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!work) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("sheet-open");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    sheetRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("sheet-open");
      document.body.style.overflow = previousOverflow;
    };
  }, [work, onClose]);

  if (!mounted) return null;

  const paragraphs = work
    ? work.description.split("\n").map((line) => line.trim()).filter(Boolean)
    : [];

  const isPresent = work
    ? work.duration.split("—").pop()?.trim().toLowerCase() === "present"
    : false;

  return createPortal(
    <AnimatePresence>
      {work && (
        <>
          <motion.div
            key="experience-sheet-overlay"
            className="experience-sheet-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          <motion.div
            key="experience-sheet"
            ref={sheetRef}
            className="experience-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={`${work.title} experience details`}
            tabIndex={-1}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
          >
            <div className="experience-sheet-inner">
              <div className="experience-sheet-header">
                <div className="experience-sheet-identity">
                  {/* <Image
                    className="experience-sheet-logo"
                    src={work.image}
                    alt={`${work.title} logo`}
                    width={512}
                    height={512}
                  /> */}
                  <h3 className="experience-sheet-title">{work.title}</h3>
                </div>
                {work.link && (
                  <Link
                    href={work.link}
                    target="_blank"
                    className="pill-button experience-sheet-visit"
                  >
                    <Globe size={20} />
                    <span>Visit website</span>
                  </Link>
                )}
              </div>

              <div className="experience-sheet-meta-group">
                <WorkedLine duration={work.duration} />
                <RolesLine roles={work.roles} isPresent={isPresent} />
              </div>

              <div className="separator experience-sheet-divider"></div>

              <div className="experience-sheet-body">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>{work.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default ExperienceModal;
