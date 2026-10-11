"use client";

import React, { useEffect, useState } from "react";

// True once any page has mounted in this document, which makes every later
// mount a client-side navigation. Module state resets on a hard load (so,
// unlike a storage flag, it can't go stale) and is never set on the server.
let pageMounted = false;

/**
 * Shell for every page. On a hard load or refresh the `.enter` elements
 * inside play their staggered CSS entrance from first paint. On a client-side
 * navigation (a playground row, the Back link, browser back/forward) the
 * shell marks itself data-nav="client" and those same elements only
 * crossfade (see .enter in common.scss): the stagger never replays, and the
 * title morph flies over a page that is already in place.
 *
 * The flag read is render-safe (no side effects, so strict-mode double
 * renders agree); it is set in the effect, after every initializer has run.
 */
function PageShell({ children }: { children: React.ReactNode }) {
  const [clientNav] = useState(() => pageMounted);

  useEffect(() => {
    pageMounted = true;
  }, []);

  return (
    <div className="page" data-nav={clientNav ? "client" : undefined}>
      {children}
    </div>
  );
}

export default PageShell;
