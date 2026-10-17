// The single source of truth for the facts the site states about Petar:
// where to reach him and where he has worked. The hero and the Experience
// section read from here, and a CV built from this repo should too, so the
// two cannot drift apart again.

import type { YearMonth } from "@/lib/format";

export const emailAddress = "pmarkovic2308@gmail.com";

export const links = {
  // ASCII-only filename: the old one's ć became %C4%87 in the URL, which
  // some applicant-tracking systems and mail clients break. The old path
  // redirects here (see next.config.ts).
  cv: "/petar-markovic-cv.pdf",
  email: `mailto:${emailAddress}`,
  // TODO(petar): confirm which LinkedIn URL works and use the same one on
  // the CV. The site has used this one; the CV has
  // /in/petar-markovic-petsoni.
  linkedin: "https://www.linkedin.com/in/petar-markovic-a38596165/",
  github: "https://github.com/Petsoni",
};

/** The contact links, in order, as the hero lists them. */
export const contactLinks = [
  { label: "CV", href: links.cv },
  { label: "Email", href: links.email },
  { label: "LinkedIn", href: links.linkedin },
  { label: "GitHub", href: links.github },
] as const;

// TODO(petar): repo URL. Set this to the repository's public address (no
// trailing slash) and every playground page gains a "View source" link to
// its component; until then the link is not rendered.
const sourceRepo: string | undefined = undefined;

/** Link to a file in the public repository, once there is one. */
export function sourceUrl(path: string): string | undefined {
  return sourceRepo ? `${sourceRepo}/blob/master/${path}` : undefined;
}

export interface ExperienceEntry {
  id: number;
  /** The company. */
  title: string;
  /** The role shown beside the company name, and first in the dialog. */
  role: string;
  /** Any further roles held there, listed after `role` in the dialog. */
  otherRoles: string[];
  link: string;
  image: string;
  start: YearMonth;
  /** null while he still works there. */
  end: YearMonth | null;
  /** Paragraphs, separated by newlines. */
  description: string;
}

export const experience: ExperienceEntry[] = [
  {
    id: 1,
    title: "Prepia",
    role: "Frontend Engineer",
    otherRoles: [],
    link: "https://prepia.com",
    image: "/work-logos/prepia.png",
    start: "2026-06",
    end: null,
    description:
      "Currently working as a Frontend Engineer at Prepia, building modern, performant, and accessible web interfaces.\nThe specifics of the product are under NDA, but the focus is on crafting a polished user experience backed by a clean, scalable component architecture and close collaboration with design and backend teams.",
  },
  {
    id: 2,
    title: "Ashkin Studio",
    // TODO(petar): confirm the role. "Founder & Design Engineer" is the
    // recommendation; the CV has said "Founder & Developer".
    role: "Founder & Design Engineer",
    otherRoles: ["UI/UX Designer"],
    link: "https://ashkin-studio.vercel.app",
    image: "/work-logos/ashkin.png",
    // TODO(petar): confirm the start. The site has said August 2022, the CV
    // June 2022.
    start: "2022-08",
    end: "2026-04",
    description:
      "Founded and ran Ashkin Studio, a software studio delivering high-performance SaaS products and custom web applications for clients across multiple countries. Managed the full project lifecycle for 10+ production-grade projects, maintaining a 100% completion rate.\nLed cross-functional teams of up to four developers, owning requirements gathering, sprint planning, code reviews, and delivery. Standardized reusable component libraries and CI/CD pipelines that reduced time-to-launch and kept quality consistent across the portfolio.\nMy work bridged business goals and technical execution end to end — from UI/UX strategy and design through scalable, production-ready frontend architecture.",
  },
  {
    id: 3,
    // TODO(petar): official spelling. The site has said "Dual SOFT", the CV
    // "DualSOFT".
    title: "Dual SOFT",
    role: "Full-Stack Developer",
    otherRoles: [],
    link: "https://dualsoft.net",
    image: "/work-logos/dualsoft.png",
    start: "2025-04",
    end: "2025-07",
    description:
      "Worked as a Full-Stack Developer building reactive Angular UI components backed by Spring Boot microservices with PostgreSQL integration.\nEngineered an event-driven architecture using Kafka and RabbitMQ, and integrated real-time WebSocket notifications for live updates under heavy concurrent load. Maintained 80%+ test coverage across my assigned modules and conducted regular peer code reviews to uphold code quality.",
  },
  {
    id: 5,
    title: "iMET",
    // TODO(petar): add "part-time" or "student" to the role if that is
    // accurate.
    role: "Full-Stack Developer",
    otherRoles: ["Frontend Team Lead", "Python Developer"],
    link: "https://imet.metropolitan.ac.rs",
    image: "/work-logos/imet.svg",
    start: "2021-08",
    end: "2025-04",
    description:
      "Built Angular frontend modules and Spring Boot RESTful APIs for an enterprise university platform serving 20,000+ students and 200+ staff.\nArchitected a modular monorepo serving multiple faculties, with shared modules that kept the system scalable and maintainable as it grew.\nDeveloped an internal analytics platform in Python/Flask that automated KPI reporting across 50,000+ records, reducing aggregation time from days to minutes.",
  },
];
