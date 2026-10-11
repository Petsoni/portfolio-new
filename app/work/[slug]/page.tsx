import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackLink from "@/app/components/BackLink";
import PageShell from "@/app/components/PageShell";
import UiSounds from "@/app/components/UiSounds";
import { getWork, visibleWork } from "@/lib/work";
import "./CaseStudy.scss";

type Params = Promise<{ slug: string }>;

// Only the entries the site may show get a page; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return visibleWork.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const entry = getWork((await params).slug);
  if (!entry) return {};
  return {
    title: `${entry.title} | Petar Marković`,
    description: entry.summary,
  };
}

/**
 * A case study, always in the same order: problem, constraints, explorations
 * (rejected options included), decisions, build, outcome, links. A section
 * with nothing written is skipped rather than rendered empty.
 */
export default async function CaseStudyPage({ params }: { params: Params }) {
  const entry = getWork((await params).slug);
  if (!entry) notFound();

  const { build } = entry;
  const buildSpecs = [
    { term: "Stack", items: build.stack },
    { term: "Tokens", items: build.tokens },
    { term: "Motion", items: build.motion },
  ].filter((spec) => spec.items.length > 0);

  return (
    <PageShell>
      <UiSounds hover={false} />
      <article className="section case-study">
        <BackLink href="/#work" />
        <h1>{entry.title}</h1>
        <p
          className="case-study-summary enter"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {entry.summary}
        </p>

        <div
          className="case-study-body enter"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          {entry.problem.length > 0 && (
            <section>
              <h2>Problem</h2>
              {entry.problem.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </section>
          )}

          {entry.constraints.length > 0 && (
            <section>
              <h2>Constraints</h2>
              <ul>
                {entry.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </section>
          )}

          {entry.explorations.length > 0 && (
            <section>
              <h2>Explorations</h2>
              {entry.explorations.map((exploration) => (
                <div className="case-study-exploration" key={exploration.title}>
                  <h3>
                    {exploration.title}
                    {exploration.rejected && (
                      <span className="case-study-rejected">Rejected</span>
                    )}
                  </h3>
                  <p>{exploration.body}</p>
                </div>
              ))}
            </section>
          )}

          {entry.decisions.length > 0 && (
            <section>
              <h2>Decisions</h2>
              <ul>
                {entry.decisions.map((decision, index) => (
                  <li key={index}>{decision}</li>
                ))}
              </ul>
            </section>
          )}

          {buildSpecs.length > 0 && (
            <section>
              <h2>Build</h2>
              <dl className="case-study-specs">
                {buildSpecs.map((spec) => (
                  <div key={spec.term}>
                    <dt>{spec.term}</dt>
                    {spec.items.map((item, index) => (
                      <dd key={index}>{item}</dd>
                    ))}
                  </div>
                ))}
              </dl>
            </section>
          )}

          {entry.outcome.length > 0 && (
            <section>
              <h2>Outcome</h2>
              {entry.outcome.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </section>
          )}

          {entry.links.length > 0 && (
            <section>
              <h2>Links</h2>
              <ul className="case-study-links">
                {entry.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      data-sound="swoosh"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </PageShell>
  );
}
