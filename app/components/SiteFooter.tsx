import React from "react";
import { Send } from "lucide-react";
import { formatDay } from "@/lib/format";
import { emailAddress, links } from "@/lib/profile";
import "./SiteFooter.scss";

// Every page is rendered at build time, so this is the day the site was
// last built and deployed — what "Last updated" reports.
const builtAt = new Date();

/**
 * The site footer, on every page: the email address as the call to action
 * on the left; a short personal note and when the site was last updated on
 * the right.
 */
function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="site-footer-cta">
        Get in touch
        <a href={links.email} className="site-footer-email" data-sound="send">
          <span>{emailAddress}</span>
          <Send size={16} aria-hidden="true" />
        </a>
      </p>
      <div className="site-footer-aside">
        <p>
          When I’m not designing or coding, I’m exploring new technologies or
          producing electronic music.
        </p>
        <p className="site-footer-updated">
          Last updated{" "}
          <time dateTime={builtAt.toISOString().slice(0, 10)}>
            {formatDay(builtAt)}
          </time>
        </p>
      </div>
    </footer>
  );
}

export default SiteFooter;
