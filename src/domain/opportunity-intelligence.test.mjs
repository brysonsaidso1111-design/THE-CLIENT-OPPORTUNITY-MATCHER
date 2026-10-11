import test from "node:test";
import assert from "node:assert/strict";
import { assembleOpportunityIntelligence, INTELLIGENCE_VERSION } from "./opportunity-intelligence.mjs";
import { createClaim } from "./knowledge-state.mjs";

function baseInput(overrides = {}) {
  return {
    opportunity: {
      id: "opp-1",
      title: "Acme needs web design",
      organization: "Acme",
      originalUrl: "https://example.com/acme",
      type: { id: "DIRECT_PROJECT", label: "Direct Project" },
      location: "Houston, Texas",
      remoteStatus: "REMOTE",
      facts: { budget: "$5,000", project: "Marketing site redesign" },
      evidence: [],
    },
    eligibility: { state: "PASS", reasons: [] },
    match: {
      state: "SCORED",
      percentage: 85,
      threshold: 70,
      meetsThreshold: true,
      dimensions: [{ key: "service", score: 90, signal: "STRONG_SUPPORTED_OVERLAP" }],
      meaning: "FIT_TO_STATED_BRIEF",
    },
    ranking: {
      status: "RANKED",
      rank: 1,
      rankingScore: 82,
      rankingReasons: ["Strong brief fit."],
      materialUncertainty: [],
    },
    evidence: [
      {
        id: "ev-1",
        sourceUrl: "https://example.com/acme",
        sourceName: "example.com",
        snippet: "Acme is seeking web design for a current project.",
        quality: "STRONG",
        sourceTrust: "PRIMARY",
        freshness: { state: "FRESH" },
      },
    ],
    explanation: {
      status: "SUPPORTED",
      summary: "Acme stands out because the service is an exact fit.",
      claims: [
        {
          id: "fit-service",
          text: "Acme stands out because the service is an exact fit (90/100).",
          evidenceIds: ["ev-1"],
        },
      ],
    },
    ...overrides,
  };
}

test("Stage 11 assembles overview and detail without inventing Stage 12 recommendation", () => {
  const intel = assembleOpportunityIntelligence(baseInput());
  assert.equal(intel.version, INTELLIGENCE_VERSION);
  assert.equal(intel.opportunityId, "opp-1");
  assert.equal(intel.overview.stage12Boundary, "QUALITY_RISK_RECOMMENDATION_NOT_EVALUATED");
  assert.equal(intel.detail.stage12Boundary, "QUALITY_RISK_RECOMMENDATION_NOT_EVALUATED");
  assert.equal(intel.overview.matchPercentage, 85);
  assert.equal(intel.overview.rank, 1);
  assert.equal(intel.overview.eligibilityState, "PASS");
  assert.ok(intel.detail.claims.length >= 1);
  assert.ok(intel.detail.evidence.length === 1);
  assert.equal(intel.detail.evidence[0].id, "ev-1");
  assert.ok(!("recommendation" in intel.overview));
  assert.ok(!("qualityVerdict" in intel.detail));
});

test("Stage 11 rejects verified claims without evidence linkage", () => {
  assert.throws(
    () => createClaim({ id: "c1", text: "Budget is $5k", knowledgeState: "VERIFIED", evidenceIds: [] }),
    /evidence/,
  );
});

test("Stage 11 preserves unknown eligibility and partial completeness", () => {
  const intel = assembleOpportunityIntelligence(
    baseInput({
      eligibility: { state: "UNKNOWN", reasons: ["LOCATION_UNCONFIRMED"] },
      ranking: { status: "UNRANKED", rank: null, rankingReasons: [], materialUncertainty: ["Freshness unresolved."] },
      explanation: { status: "BLOCKED", summary: null, claims: [] },
    }),
  );
  assert.equal(intel.overview.eligibilityState, "UNKNOWN");
  assert.equal(intel.completeness, "PARTIAL");
  assert.ok(intel.detail.limitations.some((item) => /Eligibility/i.test(item) || /ineligible/i.test(item) || /not fully/i.test(item)));
  assert.ok(intel.detail.unresolvedQuestions.length >= 1);
});

test("Stage 11 does not recompute match percentage from dimensions", () => {
  const intel = assembleOpportunityIntelligence(
    baseInput({
      match: {
        state: "SCORED",
        percentage: 72,
        threshold: 70,
        meetsThreshold: true,
        dimensions: [
          { key: "service", score: 100, signal: "EXACT_MATCH" },
          { key: "location", score: 40, signal: "PARTIAL_SUPPORTED_OVERLAP" },
        ],
      },
    }),
  );
  assert.equal(intel.overview.matchPercentage, 72);
  assert.equal(intel.detail.match.percentage, 72);
});

test("Stage 11 requires opportunity identity", () => {
  assert.throws(() => assembleOpportunityIntelligence({ opportunity: { title: "x" } }), /opportunity.id/);
});
