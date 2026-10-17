import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { contactLinks } from "@/lib/profile";

// Mini PDF page that peeks out from behind the CV link on hover.
// Colors come from the --peek-* custom properties defined in common.scss.
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

// The peek art for each contact link, by label.
const peekArt: Record<(typeof contactLinks)[number]["label"], React.ReactNode> = {
  CV: <PdfPeekPage />,
  Email: (
    <span className="hero-peek-tile">
      <Mail size={14} />
    </span>
  ),
  LinkedIn: (
    <span className="hero-peek-tile">
      <Linkedin size={14} />
    </span>
  ),
  GitHub: (
    <span className="hero-peek-tile">
      <Github size={14} />
    </span>
  ),
};

const heroLinks = contactLinks.map((link) => ({
  ...link,
  art: peekArt[link.label],
}));

function HeroSection() {
  // Rendered visible on the server; the entrance is the CSS .enter stagger,
  // which runs from first paint without JS.
  return (
    <section className="section hero-section">
      <div className="hero-left">
        {/* Name first, then what he does: the role is the line a visitor
            reads second, not a detail in the bio. */}
        <hgroup className="hero-intro">
          <h1 className="enter">Petar Marković</h1>
          <p
            className="hero-lede enter"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Design engineer. I care most about the last mile — the motion, the
            micro-interactions, the details that make software feel
            considered.
          </p>
        </hgroup>
        <nav
          className="hero-links enter"
          style={{ "--i": 2 } as React.CSSProperties}
          aria-label="Contact links"
        >
          {heroLinks.map(({ label, href, art }) => (
            <a
              key={label}
              className="hero-link"
              href={href}
              target="_blank"
              rel="noreferrer"
              data-sound="send"
            >
              {label}
              <span className="hero-link-peek" aria-hidden="true">
                {art}
              </span>
            </a>
          ))}
        </nav>
      </div>
      {/* One short personal note, off to the side. */}
      <div
        className="hero-bio enter"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <p>
          When I’m not designing or coding, I’m exploring new technologies or
          producing electronic music.
        </p>
      </div>
    </section>
  );
}

export default HeroSection;
