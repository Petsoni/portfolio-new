"use client";

import React from "react";
import Link from "next/link";
import { usePageExit } from "@/app/components/PageShell";

type TransitionLinkProps = Omit<
  React.ComponentProps<typeof Link>,
  "href" | "onNavigate"
> & {
  href: string;
};

/**
 * A link to another page of the site that plays the page transition: this
 * page's items blur away first (see PageShell), then the next page's blur
 * in. onNavigate only fires for in-app navigations, so a modified click (new
 * tab, new window) still does what the browser would.
 */
function TransitionLink({ href, ...props }: TransitionLinkProps) {
  const exitTo = usePageExit();

  return (
    <Link
      href={href}
      onNavigate={
        exitTo
          ? (event) => {
              event.preventDefault();
              exitTo(href);
            }
          : undefined
      }
      {...props}
    />
  );
}

export default TransitionLink;
