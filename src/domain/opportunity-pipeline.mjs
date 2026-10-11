/**
 * Provider-neutral, deterministic implementation of Stages 5–10.
 *
 * This module deliberately does not fetch live opportunities, claim external
 * facts are verified, make recommendations, or authorize access. Provider
 * adapters (Stage 4/19), quality/risk/recommendation (Stage 12), persistence,
 * and security remain separate boundaries.
 */
import { evaluateEligibility } from "./contracts.mjs";

const KNOWLEDGE_STATES = new Set(["VERIFIED", "SUPPORTED", "INFERRED", "UNKNOWN", "CONFLICTING", "STALE"]);
const ALLOWED_FIELDS = new Set([
  "title", "description", "organization", "location", "remote",
  "engagementType", "skills", "budgetMax", "currency",
]);
const TOKEN_STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in",
  "is", "it", "of", "on", "or", "the", "to", "with", "work", "project",
]);

function requireText(value, name) {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(`${name} must be a non-empty string`);
  return value.trim();
}

function optionalText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function safeHttpUrl(value, name) {
  try {
    const url = new URL(requireText(value, name));
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
    url.username = "";
    url.password = "";
    return url;
  } catch {
    throw new TypeError(`${name} must be a valid HTTP(S) URL`);
  }
}

function normalizeWords(value) {
  if (Array.isArray(value)) return value.flatMap(normalizeWords);
  if (typeof value !== "string") return [];
  return value.toLocaleLowerCase("en")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .match(/[a-z0-9+#.]{2,}/g)
    ?.filter((word) => !TOKEN_STOP_WORDS.has(word)) ?? [];
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
}

function normalizeEvidence(evidence, index) {
  if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
    throw new TypeError("Each evidence item must be an object");
  }
  const knowledgeState = evidence.knowledgeState ?? "UNKNOWN";
  if (!KNOWLEDGE_STATES.has(knowledgeState)) throw new TypeError("Unsupported evidence knowledge state");
  const sourceUrl = evidence.sourceUrl ? safeHttpUrl(evidence.sourceUrl, "evidence sourceUrl").toString() : null;
  const capturedAt = evidence.capturedAt ?? null;
  if (capturedAt !== null && (typeof capturedAt !== "string" || Number.isNaN(Date.parse(capturedAt)))) {
    throw new TypeError("evidence capturedAt must be a valid date string or null");
  }
  return Object.freeze({
    id: optionalText(evidence.id) ?? `evidence-${index + 1}`,
    claimType: requireText(evidence.claimType, "evidence claimType"),
    value: evidence.value ?? null,
    sourceName: optionalText(evidence.sourceName),
    sourceUrl,
    capturedAt,
    excerpt: optionalText(evidence.excerpt),
    knowledgeState,
  });
}

/**
 * Stage 6: normalize a provider candidate without adjudicating truth.
 * Unknown, conflicting, stale, and inferred facts are preserved as supplied.
 */
export function normalizeOpportunity(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new TypeError("candidate must be an object");
  }
  const url = safeHttpUrl(candidate.url, "url");
  const sourceName = requireText(candidate.sourceName, "sourceName");
  const skills = uniqueStrings(Array.isArray(candidate.skills) ? candidate.skills : []);
  const tags = uniqueStrings(Array.isArray(candidate.tags) ? candidate.tags : []);
  const budgetMax = candidate.budgetMax ?? null;
  if (budgetMax !== null && (!Number.isFinite(budgetMax) || budgetMax < 0)) {
    throw new TypeError("budgetMax must be a non-negative finite number or null");
  }
  if (candidate.remote !== null && candidate.remote !== undefined && typeof candidate.remote !== "boolean") {
    throw new TypeError("remote must be boolean or unknown");
  }
  const evidence = (candidate.evidence ?? []).map(normalizeEvidence);
  const canonicalUrl = new URL(url);
  canonicalUrl.hash = "";
  for (const key of [...canonicalUrl.searchParams.keys()]) {
    if (/^(utm_|fbclid$|gclid$|ref$|source$)/i.test(key)) canonicalUrl.searchParams.delete(key);
  }
  canonicalUrl.pathname = canonicalUrl.pathname.replace(/\/+$/, "") || "/";
  const organization = optionalText(candidate.organization);
  const title = requireText(candidate.title, "title");
  return Object.freeze({
    id: optionalText(candidate.id) ?? canonicalUrl.toString(),
    canonicalKey: canonicalUrl.toString().toLocaleLowerCase("en"),
    title,
    description: optionalText(candidate.description) ?? "",
    organization,
    url: url.toString(),
    sourceName,
    sourceRecordId: optionalText(candidate.sourceRecordId),
    location: optionalText(candidate.location),
    remote: candidate.remote ?? null,
    engagementType: optionalText(candidate.engagementType),
    skills: Object.freeze(skills),
    tags: Object.freeze(tags),
    budgetMax,
    currency: optionalText(candidate.currency),
    deadline: optionalText(candidate.deadline),
    firstSeenAt: optionalText(candidate.firstSeenAt),
    evidence: Object.freeze(evidence),
    limitations: Object.freeze(uniqueStrings(candidate.limitations ?? [])),
    normalizationVersion: "canonical-opportunity-v1",
  });
}

/** Stage 5: evidence summary that never promotes an input knowledge state. */
export function assessEvidence(opportunity) {
  const evidence = opportunity?.evidence;
  if (!Array.isArray(evidence)) throw new TypeError("opportunity must contain normalized evidence");
  const counts = Object.fromEntries([...KNOWLEDGE_STATES].map((state) => [state, 0]));
  for (const item of evidence) counts[item.knowledgeState] += 1;
  const claimsByType = new Map();
  for (const item of evidence) {
    const key = item.claimType.toLocaleLowerCase("en");
    const values = claimsByType.get(key) ?? new Set();
    if (item.value !== null && item.value !== undefined) values.add(JSON.stringify(item.value));
    claimsByType.set(key, values);
  }
  const conflictingClaimTypes = [...claimsByType.entries()]
    .filter(([type, values]) => values.size > 1)
    .map(([type]) => type);
  return Object.freeze({
    evidenceCount: evidence.length,
    knowledgeStateCounts: Object.freeze(counts),
    hasUnknowns: counts.UNKNOWN > 0,
    hasStaleEvidence: counts.STALE > 0,
    hasConflictingEvidence: counts.CONFLICTING > 0 || conflictingClaimTypes.length > 0,
    conflictingClaimTypes: Object.freeze(conflictingClaimTypes),
    evidenceRefs: Object.freeze(evidence.map((item) => item.id)),
    state: evidence.length === 0 ? "UNKNOWN" :
      (counts.CONFLICTING > 0 || conflictingClaimTypes.length > 0) ? "CONFLICTING" :
      counts.STALE > 0 ? "STALE" :
      counts.UNKNOWN > 0 ? "UNKNOWN" :
      counts.INFERRED > 0 ? "INFERRED" :
      counts.SUPPORTED > 0 ? "SUPPORTED" : "VERIFIED",
  });
}

function fieldValue(opportunity, field) {
  if (!ALLOWED_FIELDS.has(field)) throw new TypeError(`Unsupported constraint field: ${field}`);
  return opportunity[field];
}

function compareConstraint(actual, constraint) {
  if (actual === null || actual === undefined || actual === "") return null;
  const expected = constraint.value;
  switch (constraint.operator ?? "equals") {
    case "equals":
      if (typeof actual === "boolean" || typeof expected === "boolean") return actual === expected;
      if (typeof actual === "number" || typeof expected === "number") return Number(actual) === Number(expected);
      return String(actual).trim().toLocaleLowerCase("en") === String(expected).trim().toLocaleLowerCase("en");
    case "contains": {
      const actualValues = normalizeWords(actual);
      const expectedValues = normalizeWords(expected);
      if (expectedValues.length === 0) return null;
      return expectedValues.every((word) => actualValues.includes(word));
    }
    case "min":
      return Number.isFinite(actual) && Number.isFinite(expected) ? actual >= expected : null;
    case "max":
      return Number.isFinite(actual) && Number.isFinite(expected) ? actual <= expected : null;
    case "includesAny": {
      const actualValues = normalizeWords(actual);
      const expectedValues = normalizeWords(expected);
      return expectedValues.length ? expectedValues.some((word) => actualValues.includes(word)) : null;
    }
    default:
      throw new TypeError(`Unsupported constraint operator: ${constraint.operator}`);
  }
}

/** Stage 7: evaluate explicit constraints; missing data remains UNKNOWN. */
export function evaluateOpportunityEligibility(opportunity, constraints = []) {
  if (!Array.isArray(constraints)) throw new TypeError("constraints must be an array");
  const details = constraints.map((constraint, index) => {
    if (!constraint || typeof constraint !== "object" || typeof constraint.required !== "boolean") {
      throw new TypeError("Each constraint must declare required as a boolean");
    }
    const field = requireText(constraint.field, "constraint field");
    const actual = fieldValue(opportunity, field);
    const result = actual === null || actual === undefined
      ? { state: "UNKNOWN", required: constraint.required }
      : (() => {
          const matches = compareConstraint(actual, constraint);
          return { state: matches === null ? "UNKNOWN" : matches ? "PASS" : "FAIL", required: constraint.required };
        })();
    return Object.freeze({
      id: optionalText(constraint.id) ?? `constraint-${index + 1}`,
      field,
      required: constraint.required,
      state: result.state,
      observed: actual ?? null,
      expected: constraint.value ?? null,
      operator: constraint.operator ?? "equals",
    });
  });
  const aggregate = evaluateEligibility(details.map(({ required, state }) => ({
    required,
    observedState: state,
  })));
  const state = aggregate.state === "PASS" ? "ELIGIBLE" :
    aggregate.state === "FAIL" ? "INELIGIBLE" : "UNCERTAIN";
  return Object.freeze({
    state,
    requiredFailures: aggregate.requiredFailures,
    requiredUnknowns: aggregate.requiredUnknowns,
    evaluatedCount: aggregate.evaluatedCount,
    constraints: Object.freeze(details),
    policyVersion: "eligibility-v1",
  });
}

function dimension(name, userTerms, opportunityTerms) {
  const requested = uniqueStrings(userTerms.flatMap(normalizeWords));
  const available = new Set(uniqueStrings(opportunityTerms.flatMap(normalizeWords)));
  if (requested.length === 0) return Object.freeze({ name, state: "NOT_APPLICABLE", matched: [], missing: [] });
  if (available.size === 0) return Object.freeze({ name, state: "UNKNOWN", matched: [], missing: requested });
  const matched = requested.filter((term) => available.has(term));
  const missing = requested.filter((term) => !available.has(term));
  return Object.freeze({
    name,
    state: matched.length === 0 ? "NO_MATCH" : missing.length === 0 ? "MATCH" : "PARTIAL_MATCH",
    matched: Object.freeze(matched),
    missing: Object.freeze(missing),
    coverage: matched.length / requested.length,
  });
}

/** Stage 8: transparent lexical fit signals, not a claim of deep AI understanding. */
export function assessSemanticFit(profile, opportunity) {
  if (!profile || typeof profile !== "object") throw new TypeError("profile must be an object");
  const dimensions = [
    dimension("capabilities", Array.isArray(profile.capabilities) ? profile.capabilities : [], [
      ...opportunity.skills, ...opportunity.tags, opportunity.title, opportunity.description,
    ]),
    dimension("serviceIntent", Array.isArray(profile.services) ? profile.services : [], [
      opportunity.title, opportunity.description, ...opportunity.tags,
    ]),
    dimension("sector", Array.isArray(profile.sectors) ? profile.sectors : [], [
      opportunity.organization, opportunity.title, opportunity.description, ...opportunity.tags,
    ]),
    dimension("context", Array.isArray(profile.contextTerms) ? profile.contextTerms : [], [
      opportunity.location, opportunity.engagementType, opportunity.remote === true ? "remote" : opportunity.remote === false ? "onsite" : null,
      opportunity.title, opportunity.description,
    ]),
  ];
  const applicable = dimensions.filter((item) => item.state !== "NOT_APPLICABLE");
  const matchedTerms = uniqueStrings(applicable.flatMap((item) => item.matched));
  const missingTerms = uniqueStrings(applicable.flatMap((item) => item.missing));
  return Object.freeze({
    dimensions: Object.freeze(dimensions),
    applicableDimensions: applicable.length,
    matchedTerms: Object.freeze(matchedTerms),
    missingTerms: Object.freeze(missingTerms),
    limitations: Object.freeze([
      "Lexical overlap is a transparent baseline, not a semantic-model judgment.",
      "A fit signal does not establish eligibility, legitimacy, quality, or recommendation.",
    ]),
    fitVersion: "lexical-fit-v1",
  });
}

/** Stage 9: versioned equal-dimension baseline; withhold when inputs are insufficient. */
export function scoreOpportunityFit(fitAssessment) {
  const usable = fitAssessment.dimensions.filter((item) =>
    item.state === "MATCH" || item.state === "PARTIAL_MATCH" || item.state === "NO_MATCH");
  if (usable.length < 2) {
    return Object.freeze({
      state: "WITHHELD",
      score: null,
      comparable: false,
      reason: "INSUFFICIENT_APPLICABLE_DIMENSIONS",
      dimensionScores: Object.freeze([]),
      policyVersion: "fit-score-v1-equal-dimensions",
    });
  }
  const dimensionScores = usable.map((item) => ({
    dimension: item.name,
    score: Math.round((item.coverage ?? 0) * 100),
    matchedTerms: item.matched,
    missingTerms: item.missing,
  }));
  const score = Math.round(dimensionScores.reduce((sum, item) => sum + item.score, 0) / dimensionScores.length);
  const hasUnknown = fitAssessment.dimensions.some((item) => item.state === "UNKNOWN");
  return Object.freeze({
    state: hasUnknown ? "QUALIFIED" : "SCORED",
    score,
    comparable: !hasUnknown,
    reason: hasUnknown ? "SOME_DIMENSIONS_UNKNOWN" : null,
    dimensionScores: Object.freeze(dimensionScores),
    policyVersion: "fit-score-v1-equal-dimensions",
    interpretation: "Relative fit signal under this policy only; not probability of winning, opportunity quality, or recommendation.",
  });
}

/** Stage 10: rank only eligible, scored, policy-comparable opportunities. */
export function rankOpportunityAssessments(assessments) {
  if (!Array.isArray(assessments)) throw new TypeError("assessments must be an array");
  const seen = new Set();
  const unique = [];
  for (const item of assessments) {
    const key = item.opportunity.canonicalKey;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  const rankable = unique.filter((item) =>
    item.eligibility.state === "ELIGIBLE" &&
    item.score.state === "SCORED" &&
    item.score.comparable === true &&
    Number.isFinite(item.score.score));
  rankable.sort((a, b) => b.score.score - a.score.score || a.opportunity.canonicalKey.localeCompare(b.opportunity.canonicalKey));
  const ranked = rankable.map((item, index) => Object.freeze({
    ...item,
    ranking: Object.freeze({
      group: "ELIGIBLE_RANKED",
      rank: index + 1,
      primarySignal: "fitScore",
      policyVersion: "ranking-v1-fit-score",
      explanation: `Ranked by comparable fit score (${item.score.score}/100) under ranking-v1-fit-score.`,
      limitation: "Rank is an attention order, not a quality verdict or recommendation.",
    }),
  }));
  const rankedKeys = new Set(rankable.map((item) => item.opportunity.canonicalKey));
  const separated = unique.filter((item) => !rankedKeys.has(item.opportunity.canonicalKey)).map((item) => {
    const group = item.eligibility.state === "INELIGIBLE" ? "INELIGIBLE" :
      item.eligibility.state === "UNCERTAIN" ? "ELIGIBILITY_UNCERTAIN" :
      item.score.state !== "SCORED" || item.score.comparable !== true ? "ELIGIBLE_OR_UNCONFIRMED_UNRANKED" : "NOT_RANKED";
    return Object.freeze({
      ...item,
      ranking: Object.freeze({
        group,
        rank: null,
        primarySignal: null,
        policyVersion: "ranking-v1-fit-score",
        explanation: group === "INELIGIBLE" ? "A required constraint failed; excluded from the eligible ranking." :
          group === "ELIGIBILITY_UNCERTAIN" ? "Required information is unknown; eligibility is not confirmed." :
          "A comparable fit score is unavailable; no rank is fabricated.",
        limitation: "This group is not an ordinary eligible ranking.",
      }),
    });
  });
  return Object.freeze({ ranked: Object.freeze(ranked), separated: Object.freeze(separated), policyVersion: "ranking-v1-fit-score" });
}

/** Deterministic end-to-end assessment for candidates already lawfully obtained. */
export function assessOpportunitySet({ candidates, profile, constraints = [] }) {
  if (!Array.isArray(candidates)) throw new TypeError("candidates must be an array");
  const assessments = candidates.map((candidate) => {
    const opportunity = normalizeOpportunity(candidate);
    const evidence = assessEvidence(opportunity);
    const eligibility = evaluateOpportunityEligibility(opportunity, constraints);
    const fit = assessSemanticFit(profile ?? {}, opportunity);
    const score = scoreOpportunityFit(fit);
    return Object.freeze({ opportunity, evidence, eligibility, fit, score });
  });
  const ranking = rankOpportunityAssessments(assessments);
  return Object.freeze({
    assessments: Object.freeze(assessments),
    ranked: ranking.ranked,
    separated: ranking.separated,
    pipelineVersion: "opportunity-assessment-v1",
    provenanceNotice: "Assessments are based only on supplied candidate data; no live source was queried or independently verified.",
  });
}
