"use client";

import React from "react";
import { motion } from "motion/react";
import { Github, Linkedin, Mail } from "lucide-react";
import { containerVariants, itemVariants } from "@/app/motion-variants";

// Mini PDF page that peeks out from behind the CV link on hover.
// Colors come from the --peek-* custom properties themed in common.scss.
function PdfPeekPage() {
  return (
    <svg className="hero-peek-page" viewBox="0 0 26 34" fill="none">
      <path
        d="M1 4 A3 3 0 0 1 4 1 H16.5 L25 9.5 V30 A3 3 0 0 1 22 33 H4 A3 3 0 0 1 1 30 Z"
        fill="var(--peek-paper)"
        stroke="var(--peek-border)"
        strokeWidth="1"
      />
      <path
        d="M16.5 1 V6.5 A3 3 0 0 0 19.5 9.5 H25 Z"
        fill="var(--peek-fold)"
        stroke="var(--peek-border)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <line x1="6" y1="9" x2="12" y2="9" stroke="var(--peek-ink)" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="15" x2="20" y2="15" stroke="var(--peek-line)" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="20" x2="20" y2="20" stroke="var(--peek-line)" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="25" x2="14" y2="25" stroke="var(--peek-line)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const heroLinks = [
  { label: "CV", href: "/Petar_Marković_CV.pdf", art: <PdfPeekPage /> },
  {
    label: "Email",
    href: "mailto:pmarkovic2308@gmail.com",
    art: (
      <span className="hero-peek-tile">
        <Mail size={14} />
      </span>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/petar-markovic-a38596165/",
    art: (
      <span className="hero-peek-tile">
        <Linkedin size={14} />
      </span>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/Petsoni",
    art: (
      <span className="hero-peek-tile">
        <Github size={14} />
      </span>
    ),
  },
];

function HeroSection() {
  return (
    <motion.section
      className="section hero-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="hero-left">
        <motion.h1 variants={itemVariants}>Hi there, I’m Petar.</motion.h1>
        <motion.nav className="hero-links" variants={itemVariants} aria-label="Contact links">
          {heroLinks.map(({ label, href, art }) => (
            <a key={label} className="hero-link" href={href} target="_blank" rel="noreferrer">
              {label}
              <span className="hero-link-peek" aria-hidden="true">
                {art}
              </span>
            </a>
          ))}
        </motion.nav>
      </div>
      <motion.div className="hero-bio" variants={itemVariants}>
        <p>
          Design engineer based in Serbia, turning ideas into interfaces that feel as good as they look.
        </p>
        <p>
          I work across the full stack, but I care most about the last mile. The motion, the micro-interactions, the details that 	make software feel considered. When I'm not designing or coding, I'm	exploring new technologies or producing electronic music.
        </p>
      </motion.div>
    </motion.section>
  );
}

export default HeroSection;
