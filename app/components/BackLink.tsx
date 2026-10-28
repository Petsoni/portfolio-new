import React from "react";
import { ArrowLeft } from "lucide-react";
import TransitionLink from "@/app/components/TransitionLink";
import "./BackLink.scss";

interface BackLinkProps {
  /** Where "Back" leads — a home-page section anchor, e.g. "/#playground". */
  href: string;
}

/**
 * The "Back" link at the top of a detail page (a playground showcase, a case
 * study). It points at the home section the visitor came from, so that
 * section is on screen when they land. Like the playground rows, it plays
 * the page transition.
 */
function BackLink({ href }: BackLinkProps) {
  return (
    <TransitionLink
      href={href}
      className="back-link enter"
      data-sound="collapse"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      <span>Back</span>
    </TransitionLink>
  );
}

export default BackLink;
