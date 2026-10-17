// Case studies for the Work section: the cards on the home page and the
// pages at /work/[slug].
//
// An entry ships only when `published` is true. Until then it is hidden from
// the built site — no card, no page — and shows only in `next dev`, so the
// template can be checked while the content is being written. A section left
// empty is skipped, never rendered blank.
//
// Every entry tells the same story, in this order:
//   problem       what was broken or missing, and for whom
//   constraints   what could not change (time, stack, brand, data, team)
//   explorations  the options tried, including the rejected ones and why
//   decisions     what was chosen, and the reasoning
//   build         stack, tokens, and motion specs (springs, durations)
//   outcome       what changed; a metric if there is one
//   links         live site, repository, Figma

export interface WorkExploration {
  title: string;
  body: string;
  /** Tried and dropped. Rejected options are part of the story. */
  rejected?: boolean;
}

export interface WorkLink {
  label: string;
  href: string;
}

export interface WorkEntry {
  slug: string;
  title: string;
  /** One line for the card on the home page and the top of the page. */
  summary: string;
  /** Hidden from the built site until true. */
  published: boolean;
  /** Paragraphs. */
  problem: string[];
  /** Bullets. */
  constraints: string[];
  explorations: WorkExploration[];
  /** Bullets. */
  decisions: string[];
  build: {
    stack: string[];
    tokens: string[];
    motion: string[];
  };
  /** Paragraphs. */
  outcome: string[];
  links: WorkLink[];
}

const work: WorkEntry[] = [
  {
    slug: "nera",
    title: "NERA",
    // TODO(petar): confirm the one-liner (taken from the fixes brief).
    summary:
      "Client-tracking platform for fitness trainers. I design and build the UI.",
    // TODO(petar): write the case study below, then set published to true.
    published: false,
    // TODO(petar): problem — what trainers could not do before, and how they coped.
    problem: [],
    // TODO(petar): constraints.
    constraints: [],
    // TODO(petar): explorations, including the options that were rejected.
    explorations: [],
    // TODO(petar): decisions.
    decisions: [],
    build: {
      // TODO(petar): stack (the fixes brief mentions React and a PWA).
      stack: [],
      // TODO(petar): tokens.
      tokens: [],
      // TODO(petar): motion specs.
      motion: [],
    },
    // TODO(petar): outcome — a metric if there is one; say so if there isn't.
    outcome: [],
    // TODO(petar): links (live URL, repository, Figma).
    links: [],
  },
  {
    slug: "mat-promet-eshop",
    title: "Mat Promet eShop",
    // TODO(petar): confirm the one-liner (taken from the fixes brief).
    summary:
      "Next.js e-commerce with 5,000+ SKUs, real-time inventory and order reservation.",
    // TODO(petar): write the case study below, then set published to true.
    published: false,
    // TODO(petar): problem.
    problem: [],
    // TODO(petar): constraints.
    constraints: [],
    // TODO(petar): explorations, including the options that were rejected.
    explorations: [],
    // TODO(petar): decisions.
    decisions: [],
    build: {
      // From lib/projects.json, the site's earlier copy for this project.
      stack: ["Next.js", "Tailwind CSS", "Radix UI"],
      // TODO(petar): tokens.
      tokens: [],
      // TODO(petar): motion specs.
      motion: [],
    },
    // TODO(petar): outcome. lib/projects.json says "Drove 40% sales increase
    // and reduced order processing time" — confirm the numbers before using.
    outcome: [],
    links: [
      // From lib/projects.json.
      { label: "matpromet-eshop.com", href: "https://matpromet-eshop.com" },
    ],
  },
  {
    slug: "ashkin-component-library",
    title: "Ashkin Studio component library",
    // TODO(petar): confirm the one-liner (drawn from the CV draft in the brief).
    summary:
      "Shared component library reused across Ashkin Studio client projects.",
    // TODO(petar): write the case study below, then set published to true.
    published: false,
    // TODO(petar): problem.
    problem: [],
    // TODO(petar): constraints.
    constraints: [],
    // TODO(petar): explorations, including the options that were rejected.
    explorations: [],
    // TODO(petar): decisions.
    decisions: [],
    build: {
      // TODO(petar): stack.
      stack: [],
      // TODO(petar): tokens.
      tokens: [],
      // TODO(petar): motion specs.
      motion: [],
    },
    // TODO(petar): outcome — the brief's CV draft wants "setup cut from X to Y
    // days"; fill in only with real numbers.
    outcome: [],
    // TODO(petar): links.
    links: [],
  },
];

// Drafts are visible while developing, never in a production build.
const showDrafts = process.env.NODE_ENV === "development";

/** The entries the site may show: published ones (plus drafts in dev). */
export const visibleWork: WorkEntry[] = work.filter(
  (entry) => entry.published || showDrafts,
);

export function getWork(slug: string): WorkEntry | undefined {
  return visibleWork.find((entry) => entry.slug === slug);
}
