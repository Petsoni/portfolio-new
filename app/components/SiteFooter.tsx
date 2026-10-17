import React from "react";
import { formatDay } from "@/lib/format";
import { contactLinks, emailAddress, links } from "@/lib/profile";
import "./SiteFooter.scss";

// Every page is rendered at build time, so this is the day the site was
// last built and deployed — what "Last updated" reports.
const builtAt = new Date();

/**
 * The site footer, on every page: the email address as the call to action,
 * the same contact links as the hero, and a line on how and when the site
 * was built.
 */
function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="site-footer-cta">
        Get in touch
        <a href={links.email} className="site-footer-email" data-sound="send">
          {emailAddress}
        </a>
      </p>
      <ul className="site-footer-links">
        {contactLinks.map(({ label, href }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noreferrer" data-sound="send">
              {label}
            </a>
          </li>
        ))}
      </ul>
      <p className="site-footer-meta">
        Built with Next.js + Motion · Last updated{" "}
        <time dateTime={builtAt.toISOString().slice(0, 10)}>
          {formatDay(builtAt)}
        </time>
      </p>
    </footer>
  );
}

export default SiteFooter;
