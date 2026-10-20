/**
 * Stage 4 discovery observation to Stage 5 evidence and Stage 6 canonical model.
 *
 * This adapter intentionally does not promote Tavily snippets to verified facts.
 * It preserves the original publisher URL and keeps source publication dates
 * separate from retrieval timestamps.
 */
import { normalizeOpportunity } from "../domain/opportunity-pipeline.mjs";

function nonEmpty(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function tavilyObservationToOpportunity(observation) {
  if (!observation || typeof observation !== "object" || Array.isArray(observation)) {
    throw new TypeError("A Tavily discovery observation is required.");
  }

  const sourceUrl = nonEmpty(observation.sourceUrl);
  const sourceDomain = nonEmpty(observation.sourceDomain);
  const title = nonEmpty(observation.title);
  const retrievedAt = nonEmpty(observation.retrievedAt);

  if (!sourceUrl || !sourceDomain || !title || !retrievedAt) {
    throw new TypeError("Observation must include title, publisher URL/domain, and retrieval timestamp.");
  }

  const candidateType = nonEmpty(observation.candidateType) ?? "POTENTIAL_PROSPECT";
  const demandEvidence = nonEmpty(observation.demandEvidence) ?? "UNCONFIRMED";
  const snippet = nonEmpty(observation.evidenceSnippet);

  return normalizeOpportunity({
    id: sourceUrl,
    title,
    description: snippet ?? "",
    organization: null,
    url: sourceUrl,
    sourceName: sourceDomain,
    sourceRecordId: nonEmpty(observation.provider) ?? "TAVILY_SEARCH",
    location: null,
    remote: null,
    engagementType: null,
    skills: [],
    tags: [
      "discovery:tavily",
      `candidate-type:${candidateType.toLowerCase()}`,
      `demand-evidence:${demandEvidence.toLowerCase()}`,
      `freshness:${String(observation.freshnessState ?? "UNKNOWN").toLowerCase()}`,
    ],
    budgetMax: null,
    currency: null,
    deadline: null,
    firstSeenAt: retrievedAt,
    evidence: [{
      id: `tavily-observation:${sourceUrl}`,
      claimType: "discovery_observation",
      value: {
        candidateType,
        demandEvidence,
        publisherDate: observation.sourcePublishedAt ?? null,
        freshnessState: observation.freshnessState ?? "UNKNOWN",
        providerScore: Number.isFinite(observation.providerScore) ? observation.providerScore : null,
      },
      sourceName: sourceDomain,
      sourceUrl,
      capturedAt: retrievedAt,
      excerpt: snippet,
      knowledgeState: "UNKNOWN",
    }],
    limitations: [
      "Discovery provider output has not been independently verified on the publisher page.",
      "A demand signal is not proof that a project is active or accepting proposals.",
      "Budget, organization identity, contact details, and current hiring status are unknown unless supported by separate source evidence.",
      ...(observation.freshnessState === "UNKNOWN" ? ["Publisher publication or update date is unknown."] : []),
    ],
  });
}
