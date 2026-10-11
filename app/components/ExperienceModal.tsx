"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { playUiSound } from "@/app/hooks/useUiSounds";
import { crossfade } from "@/app/motion-variants";
import { modalOpen, modalClose } from "@/.web-kits/core";

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

const contentGroup = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
  exit: {},
};

interface ExperienceModalProps {
  work: WorkModel | null;
  onClose: () => void;
  /** The row that opened the dialog; focus goes back to it on close. */
  openerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Experience details as a modal dialog. Radix Dialog owns the behaviour —
 * focus trap, Escape, outside press, scroll lock, hiding the page from
 * assistive tech — while Motion keeps the looks: everything is force-mounted
 * under AnimatePresence, so the card still morphs out of (and back into) its
 * row through the shared layoutId.
 */
function ExperienceModal({ work, onClose, openerRef }: ExperienceModalProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  // Sound tracks the open state rather than any single trigger, so closing
  // via the overlay, Escape, or the close button all sound the same.
  // The trigger row opts out of the default tap with data-sound="none".
  const wasOpen = useRef(false);
  useEffect(() => {
    const isOpen = work !== null;
    if (isOpen && !wasOpen.current) playUiSound(modalOpen);
    if (!isOpen && wasOpen.current) playUiSound(modalClose);
    wasOpen.current = isOpen;
  }, [work]);


  // Content blooms in with the site's blur-stagger signature — or, under
  // reduced motion, simply fades.
  const contentItem = reducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: crossfade },
        exit: { opacity: 0, transition: crossfade },
      }
    : {
        hidden: { opacity: 0, y: 8, filter: "blur(8px)" },
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

  // The card morphs out of its row through the shared layoutId. Under
  // reduced motion there is no morph: the card drops the layoutId and
  // crossfades in place instead of just appearing.
  const cardMotion = reducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: crossfade,
      }
    : {
        layoutId: work ? workLayoutId(work.id) : undefined,
        transition: { layout: morphSpring },
      };

  const paragraphs = work
    ? work.description.split("\n").map((line) => line.trim()).filter(Boolean)
    : [];

  return (
    <Dialog.Root
      open={work !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AnimatePresence>
        {work && (
          <Dialog.Portal key="experience-modal" forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="experience-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            </Dialog.Overlay>
            <div className="experience-modal-root">
              <Dialog.Content
                asChild
                aria-modal="true"
                // The title names the dialog; the body is too long to also
                // read out as its description.
                aria-describedby={undefined}
                // Focus lands on the card itself, so a screen reader starts
                // from the title rather than from the first link.
                onOpenAutoFocus={(event) => {
                  event.preventDefault();
                  cardRef.current?.focus();
                }}
                // Every close path (Escape, outside press, the close button)
                // ends here, once the card has left the DOM. Focus goes to
                // the row that opened it — named explicitly, because Safari
                // doesn't focus a button on click and Radix would otherwise
                // restore to <body>.
                onCloseAutoFocus={(event) => {
                  event.preventDefault();
                  openerRef.current?.focus();
                }}
              >
                <motion.div
                  ref={cardRef}
                  className="experience-modal"
                  style={{ borderRadius: 12 }}
                  {...cardMotion}
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
                        <Dialog.Title asChild>
                          <h3 className="experience-modal-title">
                            {work.title}
                          </h3>
                        </Dialog.Title>
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

                  {/* The modal's own close sound plays from the open-state
                      effect above, so the button opts out of the tap. */}
                  <Dialog.Close asChild>
                    <motion.button
                      type="button"
                      className="experience-modal-close"
                      aria-label="Close"
                      data-sound="none"
                      variants={contentItem}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <X size={16} aria-hidden="true" />
                    </motion.button>
                  </Dialog.Close>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export default ExperienceModal;
