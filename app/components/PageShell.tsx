"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

// True once any page has mounted in this document, which makes every later
// mount a client-side navigation. Module state resets on a hard load (so,
// unlike a storage flag, it can't go stale) and is never set on the server.
let pageMounted = false;

// Leaves the current page for href, playing its exit first. Null outside a
// PageShell, where a link just navigates.
const PageExitContext = createContext<((href: string) => void) | null>(null);

export const usePageExit = () => useContext(PageExitContext);

/**
 * Sets each `.enter` item's --nav-i: its place in the page transition's
 * stagger (see .page in common.scss). Runs right before an exit, and on
 * arrival once the router has scrolled (to the top, or to a #section).
 */
function numberOnScreen(page: HTMLElement) {
  let order = 0;
  page.querySelectorAll<HTMLElement>(".enter").forEach((item) => {
    const { top, bottom } = item.getBoundingClientRect();
    const onScreen = bottom > 0 && top < window.innerHeight;
    // Off screen, an item takes no slot: it goes at once, unseen, and never
    // holds up the navigation.
    item.style.setProperty("--nav-i", String(onScreen ? order++ : 0));
  });
}

/**
 * Shell for every page. On a hard load or refresh the `.enter` elements
 * inside play their staggered CSS entrance from first paint. Moving between
 * pages (a TransitionLink — a playground row, the Back link) plays a page
 * transition instead: those same elements blur away one after another, then
 * the next page's blur in, in the same order. Browser back/forward skips
 * the exit — the page is already gone — and plays only the entrance.
 *
 * The flag read is render-safe (no side effects, so strict-mode double
 * renders agree); it is set in the effect, after every initializer has run.
 */
function PageShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const [clientNav] = useState(() => pageMounted);
  const [exiting, setExiting] = useState(false);
  // Where to go once the exit has played. A second click before then only
  // retargets it.
  const destination = useRef<string | null>(null);

  useEffect(() => {
    pageMounted = true;
  }, []);

  // Arrived by client-side navigation. A passive effect, so the router's
  // scroll (a layout-phase effect) has already happened.
  useEffect(() => {
    if (clientNav && pageRef.current) numberOnScreen(pageRef.current);
  }, [clientNav]);

  // Navigate once every item has blurred away. Under reduced motion there is
  // no exit to wait for. Browser back/forward in the meantime wins: the exit
  // is dropped and the page comes back.
  useEffect(() => {
    const page = pageRef.current;
    if (!exiting || !page) return;

    let cancelled = false;
    const exits = page
      .getAnimations({ subtree: true })
      .filter(
        (animation) =>
          animation instanceof CSSAnimation &&
          animation.animationName === "page-out",
      );
    Promise.allSettled(exits.map((animation) => animation.finished)).then(
      () => {
        if (!cancelled && destination.current) {
          router.push(destination.current);
        }
      },
    );

    const cancel = () => {
      destination.current = null;
      setExiting(false);
    };
    window.addEventListener("popstate", cancel);
    return () => {
      cancelled = true;
      window.removeEventListener("popstate", cancel);
    };
  }, [exiting, router]);

  const exitTo = useCallback(
    (href: string) => {
      const page = pageRef.current;
      const samePage =
        new URL(href, window.location.href).pathname ===
        window.location.pathname;
      // Nothing to leave: no exit, or this page would stay hidden.
      if (!page || samePage) {
        router.push(href);
        return;
      }
      if (destination.current === null) numberOnScreen(page);
      destination.current = href;
      setExiting(true);
    },
    [router],
  );

  return (
    <PageExitContext.Provider value={exitTo}>
      <div
        ref={pageRef}
        className="page"
        data-nav={clientNav ? "client" : undefined}
        data-transition={exiting ? "exit" : undefined}
      >
        {children}
      </div>
    </PageExitContext.Provider>
  );
}

export default PageShell;
