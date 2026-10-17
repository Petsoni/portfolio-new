import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import "./BackLink.scss";

interface BackLinkProps {
  /** Where "Back" leads — a home-page section anchor, e.g. "/#playground". */
  href: string;
}

/**
 * The "Back" link at the top of a detail page (a playground showcase, a case
 * study). It points at the home section the visitor came from, so that
 * section is on screen when they land.
 */
function BackLink({ href }: BackLinkProps) {
  return (
    <Link href={href} className="back-link enter" data-sound="collapse">
      <ArrowLeft size={16} aria-hidden="true" />
      <span>Back</span>
    </Link>
  );
}

export default BackLink;
