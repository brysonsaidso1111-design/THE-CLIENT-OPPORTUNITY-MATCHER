/**
 * Stage 11 — Opportunity Intelligence assembler.
 *
 * Assembles an evidence-first intelligence dossier from upstream Stage 5–10
 * outputs without recomputing eligibility, match, score, or rank, and without
 * producing Stage 12 quality/risk/recommendation verdicts.
 */

import { createClaim, normalizeKnowledgeState, isKnowledgeState } from "./knowledge-state.mjs";

export const INTELLIGENCE_VERSION = "OPPORTUNITY_INTELLIGENCE_V1";

const SCORE_STATES = Object.freeze([
  "SCORED", "QUALIFIED", "WITHHELD", "NOT_SCORED", "EVALUATION_INCOMPLETE", "DEGRADED",
]);

const RANK_STATES = Object.freeze([
  "RANKED", "TIED", "SEPARATED", "UNRANKED", "WITHHELD",
]);

const ELIGIBILITY_STATES = Object.freeze([
  "PASS", "FAIL", "UNKNOWN", "NOT_EVALUATED", "DEGRADED",
]);

/**
 * @param {object} input
 * @returns {object} frozen Stage 11 intelligence dossier
 */
export function assembleOpportunityIntelligence(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("Intelligence input must be an object");
  }

  const opportunity = requireObject(input.opportunity, "opportunity");
  const opportunityId = requireNonEmptyString(opportunity.id, "opportunity.id");
  const title = requireNonEmptyString(opportunity.title, "opportunity.title");

  const eligibility = normalizeEligibility(input.eligibility);
  const match = normalizeMatch(input.match);
  const ranking = normalizeRanking(input.ranking);
  const evidence = normalizeEvidenceList(input.evidence ?? opportunity.evidence ?? []);
  const explanation = input.explanation ?? null;

  const claims = buildClaims({ opportunity, explanation, evidence, match, eligibility });

  const limitations = collectLimitations({
    eligibility, match, ranking, evidence, claims, explanation,
  });

  const unresolvedQuestions = collectUnresolvedQuestions({
    eligibility, match, evidence, opportunity,
  });

  const overview = Object.freeze({
    opportunityId,
    title,
    organization: optionalString(opportunity.organization),
    originalUrl: optionalString(opportunity.originalUrl),
    type: optionalString(opportunity.type?.label ?? opportunity.type?.id ?? opportunity.type),
    location: optionalString(opportunity.location),
    remoteStatus: optionalString(opportunity.remoteStatus),
    eligibilityState: eligibility.state,
    matchPercentage: match?.percentage ?? null,
    matchState: match?.state ?? "NOT_SCORED",
    rank: ranking?.rank ?? null,
    rankState: ranking?.status ?? "UNRANKED",
    summary: buildOverviewSummary({ title, claims, limitations, match, ranking }),
    materialLimitations: Object.freeze(limitations.slice(0, 5)),
    stage12Boundary: "QUALITY_RISK_RECOMMENDATION_NOT_EVALUATED",
  });

  const detail = Object.freeze({
    facts: normalizeFacts(opportunity.facts),
    claims,
    evidence: Object.freeze(evidence.map(presentEvidence)),
    eligibility,
    match,
    ranking,
    explanationStatus: explanation?.status ?? null,
    explanationSummary: optionalString(explanation?.summary),
    unresolvedQuestions: Object.freeze(unresolvedQuestions),
    limitations: Object.freeze(limitations),
    assemblyVersion: INTELLIGENCE_VERSION,
    stage12Boundary: "QUALITY_RISK_RECOMMENDATION_NOT_EVALUATED",
  });

  return Object.freeze({
    version: INTELLIGENCE_VERSION,
    opportunityId,
    overview,
    detail,
    completeness: limitations.length === 0 && unresolvedQuestions.length === 0 ? "COMPLETE" : "PARTIAL",
  });
}

function requireObject(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${name} must be an object`);
  }
  return value;
}

function requireNonEmptyString(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`${name} must be a non-empty string`);
  }
  return value.trim();
}

function optionalString(value) {
  if (value == null) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function normalizeEligibility(raw) {
  if (!raw || typeof raw !== "object") {
    return Object.freeze({ state: "NOT_EVALUATED", reasons: Object.freeze([]) });
  }
  const state = ELIGIBILITY_STATES.includes(raw.state) ? raw.state : "UNKNOWN";
  const reasons = Array.isArray(raw.reasons)
    ? Object.freeze(raw.reasons.filter((r) => typeof r === "string"))
    : Object.freeze([]);
  return Object.freeze({ state, reasons });
}

function normalizeMatch(raw) {
  if (!raw || typeof raw !== "object") {
    return Object.freeze({
      state: "NOT_SCORED",
      percentage: null,
      threshold: null,
      meetsThreshold: null,
      dimensions: Object.freeze([]),
      meaning: "FIT_TO_STATED_BRIEF",
    });
  }
  const state = SCORE_STATES.includes(raw.state)
    ? raw.state
    : Number.isInteger(raw.percentage)
      ? "SCORED"
      : "NOT_SCORED";
  const dimensions = Array.isArray(raw.dimensions)
    ? Object.freeze(
        raw.dimensions.map((d) =>
          Object.freeze({
            key: String(d.key),
            score: Number.isInteger(d.score) ? d.score : null,
            signal: optionalString(d.signal),
          }),
        ),
      )
    : Object.freeze([]);
  return Object.freeze({
    state,
    percentage: Number.isInteger(raw.percentage) ? raw.percentage : null,
    threshold: Number.isInteger(raw.threshold) ? raw.threshold : null,
    meetsThreshold: typeof raw.meetsThreshold === "boolean" ? raw.meetsThreshold : null,
    dimensions,
    meaning: "FIT_TO_STATED_BRIEF",
  });
}

function normalizeRanking(raw) {
  if (!raw || typeof raw !== "object") {
    return Object.freeze({
      status: "UNRANKED",
      rank: null,
      rankingScore: null,
      rankingReasons: Object.freeze([]),
      materialUncertainty: Object.freeze([]),
    });
  }
  const status = RANK_STATES.includes(raw.status) ? raw.status : "UNRANKED";
  return Object.freeze({
    status,
    rank: Number.isInteger(raw.rank) ? raw.rank : null,
    rankingScore: Number.isFinite(raw.rankingScore) ? raw.rankingScore : null,
    rankingReasons: Object.freeze(
      Array.isArray(raw.rankingReasons) ? raw.rankingReasons.filter((r) => typeof r === "string") : [],
    ),
    materialUncertainty: Object.freeze(
      Array.isArray(raw.materialUncertainty)
        ? raw.materialUncertainty.filter((r) => typeof r === "string")
        : [],
    ),
  });
}

function normalizeEvidenceList(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((item) => item && typeof item.id === "string" && item.id.trim());
}

function presentEvidence(item) {
  return Object.freeze({
    id: item.id.trim(),
    sourceUrl: optionalString(item.sourceUrl),
    sourceName: optionalString(item.sourceName),
    sourceDomain: optionalString(item.sourceDomain),
    snippet: optionalString(item.snippet),
    knowledgeState: isKnowledgeState(item.knowledgeState)
      ? item.knowledgeState
      : item.quality === "STRONG"
        ? "SUPPORTED"
        : item.quality === "MODERATE"
          ? "SUPPORTED"
          : item.freshness?.state === "STALE"
            ? "STALE"
            : "UNKNOWN",
    quality: optionalString(item.quality),
    freshness: optionalString(item.freshness?.state ?? item.freshness),
    sourceTrust: optionalString(item.sourceTrust),
    conflictState: optionalString(item.conflictState) ?? "NONE",
  });
}

function normalizeFacts(facts) {
  if (!facts || typeof facts !== "object") return null;
  return Object.freeze({
    project: optionalString(facts.project),
    service: optionalString(facts.service),
    timing: optionalString(facts.timing),
    deadline: optionalString(facts.deadline),
    budget: optionalString(facts.budget),
    compensation: optionalString(facts.compensation),
    requirements: Object.freeze(
      Array.isArray(facts.requirements) ? facts.requirements.filter((x) => typeof x === "string") : [],
    ),
    deliverables: Object.freeze(
      Array.isArray(facts.deliverables) ? facts.deliverables.filter((x) => typeof x === "string") : [],
    ),
  });
}

function buildClaims({ opportunity, explanation, evidence, match, eligibility }) {
  const claims = [];
  const evidenceIds = evidence.map((e) => e.id);

  if (explanation?.status === "SUPPORTED" && Array.isArray(explanation.claims)) {
    for (const claim of explanation.claims) {
      if (!claim?.text || !Array.isArray(claim.evidenceIds) || claim.evidenceIds.length === 0) continue;
      const linked = claim.evidenceIds.filter((id) => evidenceIds.includes(id));
      if (!linked.length) continue;
      claims.push(
        createClaim({
          id: claim.id || `expl-${claims.length + 1}`,
          text: claim.text,
          knowledgeState: "SUPPORTED",
          evidenceIds: linked,
        }),
      );
    }
  }

  if (match?.percentage != null && match.meetsThreshold === true && evidenceIds.length) {
    claims.push(
      createClaim({
        id: "match-threshold",
        text: `Match score ${match.percentage}% meets the configured brief-fit threshold.`,
        knowledgeState: "SUPPORTED",
        evidenceIds: evidenceIds.slice(0, 2),
      }),
    );
  }

  if (eligibility.state === "PASS" && evidenceIds.length) {
    claims.push(
      createClaim({
        id: "eligibility-pass",
        text: "Hard eligibility constraints passed based on available evaluation inputs.",
        knowledgeState: "SUPPORTED",
        evidenceIds: evidenceIds.slice(0, 1),
        limitations: eligibility.reasons.length ? [...eligibility.reasons] : [],
      }),
    );
  } else if (eligibility.state === "FAIL") {
    claims.push(
      createClaim({
        id: "eligibility-fail",
        text: "Hard eligibility constraints did not pass.",
        knowledgeState: "SUPPORTED",
        evidenceIds: evidenceIds.length ? evidenceIds.slice(0, 1) : undefined,
        limitations: [...eligibility.reasons],
      }),
    );
  }

  if (opportunity.facts?.budget && evidenceIds.length) {
    claims.push(
      createClaim({
        id: "budget-stated",
        text: `Stated budget context: ${opportunity.facts.budget}`,
        knowledgeState: "SUPPORTED",
        evidenceIds: evidenceIds.slice(0, 1),
        limitations: ["Budget is presented as source-stated; not independently verified."],
      }),
    );
  }

  return Object.freeze(claims);
}

function collectLimitations({ eligibility, match, ranking, evidence, claims, explanation }) {
  const limitations = [];
  if (eligibility.state === "UNKNOWN" || eligibility.state === "NOT_EVALUATED") {
    limitations.push("Eligibility is not fully established.");
  }
  if (eligibility.state === "FAIL") {
    limitations.push("Opportunity is ineligible under hard constraints.");
  }
  if (!match || match.state === "NOT_SCORED" || match.percentage == null) {
    limitations.push("Fit score is not available.");
  }
  if (match?.meetsThreshold === false) {
    limitations.push("Match does not meet the configured threshold.");
  }
  if (!ranking || ranking.status !== "RANKED") {
    limitations.push("Ranking context is unavailable or withheld.");
  }
  if (!evidence.length) {
    limitations.push("No usable evidence is attached.");
  }
  if (evidence.some((e) => e.freshness?.state === "STALE" || e.freshness === "STALE")) {
    limitations.push("Some evidence is stale.");
  }
  if (explanation?.status === "BLOCKED") {
    limitations.push("Explanation could not be supported from available evidence.");
  }
  for (const claim of claims) {
    for (const limit of claim.limitations || []) {
      if (!limitations.includes(limit)) limitations.push(limit);
    }
  }
  for (const item of ranking?.materialUncertainty || []) {
    if (!limitations.includes(item)) limitations.push(item);
  }
  return limitations;
}

function collectUnresolvedQuestions({ eligibility, match, evidence, opportunity }) {
  const questions = [];
  if (eligibility.state === "UNKNOWN" || eligibility.state === "NOT_EVALUATED") {
    questions.push("Can hard constraints be confirmed with additional evidence?");
  }
  if (!opportunity.facts?.budget && !opportunity.facts?.compensation) {
    questions.push("Is budget or compensation stated by the source?");
  }
  if (!evidence.length) {
    questions.push("What primary source evidence supports this opportunity?");
  }
  if (match?.dimensions?.some((d) => d.signal && String(d.signal).includes("UNVERIFIED"))) {
    questions.push("Which match dimensions remain unverified?");
  }
  if (opportunity.remoteStatus === "UNKNOWN" || !opportunity.location) {
    questions.push("What are the location or remote-work requirements?");
  }
  return questions;
}

function buildOverviewSummary({ title, claims, limitations, match, ranking }) {
  const parts = [];
  parts.push(title);
  if (match?.percentage != null) {
    parts.push(`Fit to stated brief: ${match.percentage}%.`);
  }
  if (ranking?.status === "RANKED" && ranking.rank != null) {
    parts.push(`Attention rank: #${ranking.rank}.`);
  }
  if (claims.length) {
    parts.push(claims[0].text);
  }
  if (limitations.length) {
    parts.push(`Limitations: ${limitations.slice(0, 2).join(" ")}`);
  }
  return parts.join(" ");
}
