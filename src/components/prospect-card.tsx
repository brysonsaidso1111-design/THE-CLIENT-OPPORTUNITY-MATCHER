import Link from "next/link";

export type ProspectCardData = {
  id: string;
  prospectName: string;
  evidenceSummary?: string | null;
  briefMatchReason?: string | null;
  sourceUrl?: string | null;
  sourceTitle?: string | null;
  publishedOrUpdatedAt?: string | null;
  retrievedAt?: string | null;
  freshnessLabel?: string | null;
  unknowns?: string[];
  detailsHref?: string | null;
};

function safeHttpUrl(value?: string | null): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Structured prospect presentation only. This component does not infer fit,
 * verify claims, generate source metadata, or alter matching/verdict decisions.
 */
export function ProspectCard({ prospect }: { prospect: ProspectCardData }) {
  const sourceUrl = safeHttpUrl(prospect.sourceUrl);
  const unknowns = prospect.unknowns ?? [];

  return (
    <article className="prospect-card">
      <div className="prospect-card__body">
        <p className="prospect-card__eyebrow">POTENTIAL CLIENT</p>
        <h2 className="prospect-card__title">{prospect.prospectName}</h2>

        <section className="prospect-card__section" aria-label="Evidence of potential need">
          <h3>Evidence of potential need</h3>
          <p className="prospect-card__clamped">
            {prospect.evidenceSummary || "Evidence of a current need has not been established yet."}
          </p>
        </section>

        <section className="prospect-card__section" aria-label="Why this matches the brief">
          <h3>Why it matches your brief</h3>
          <p className="prospect-card__clamped">
            {prospect.briefMatchReason || "A match explanation is not available yet."}
          </p>
        </section>

        <section className="prospect-card__meta" aria-label="Source details">
          {prospect.freshnessLabel ? (
            <p><span>Freshness</span> {prospect.freshnessLabel}</p>
          ) : (
            <p><span>Freshness</span> Not established</p>
          )}
          {prospect.publishedOrUpdatedAt ? (
            <p><span>Published or updated</span> {prospect.publishedOrUpdatedAt}</p>
          ) : (
            <p><span>Publication date</span> Not available</p>
          )}
          {prospect.retrievedAt ? <p><span>Retrieved</span> {prospect.retrievedAt}</p> : null}
        </section>

        <section className="prospect-card__unknowns" aria-label="Information not verified">
          <h3>Still to verify</h3>
          {unknowns.length > 0 ? (
            <ul>
              {unknowns.slice(0, 2).map((unknown, index) => <li key={`${prospect.id}-unknown-${index}`}>{unknown}</li>)}
            </ul>
          ) : (
            <p>No additional unknowns were supplied. This does not mean every detail has been independently verified.</p>
          )}
          {unknowns.length > 2 ? <p className="prospect-card__more">Plus {unknowns.length - 2} more item(s) to verify.</p> : null}
        </section>
      </div>

      <footer className="prospect-card__footer">
        {sourceUrl ? (
          <a className="prospect-card__source" href={sourceUrl} target="_blank" rel="noopener noreferrer">
            {prospect.sourceTitle ? `Open source: ${prospect.sourceTitle}` : "Open original source"}
            <span aria-hidden="true"> ↗</span>
          </a>
        ) : (
          <span className="prospect-card__source-unavailable">Original source link unavailable</span>
        )}
        {prospect.detailsHref ? (
          <Link className="prospect-card__details" href={prospect.detailsHref}>Review prospect details</Link>
        ) : null}
      </footer>
    </article>
  );
}
