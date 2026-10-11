import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeOpportunity,
  assessEvidence,
  evaluateOpportunityEligibility,
  assessSemanticFit,
  scoreOpportunityFit,
  rankOpportunityAssessments,
  assessOpportunitySet,
} from "./opportunity-pipeline.mjs";

const candidate = (overrides = {}) => ({
  id: "opp-1",
  title: "Website redesign for a local accounting firm",
  description: "Build a responsive website and improve conversion copy for small business clients",
  organization: "Northstar Accounting",
  url: "https://example.com/jobs/website-redesign?utm_source=feed",
  sourceName: "Example source",
  location: "Remote",
  remote: true,
  engagementType: "contract",
  skills: ["web design", "conversion copy", "responsive website"],
  tags: ["small business", "website redesign"],
  budgetMax: 2500,
  currency: "USD",
  evidence: [{
    id: "ev-1", claimType: "budget", value: 2500,
    sourceName: "Example source", sourceUrl: "https://example.com/jobs/website-redesign",
    capturedAt: "2026-10-10T10:00:00.000Z", knowledgeState: "SUPPORTED",
    excerpt: "Budget up to $2,500",
  }],
  ...overrides,
});

test("normalization validates URLs and preserves unknowns without inventing facts", () => {
  const item = normalizeOpportunity(candidate({ remote: null, budgetMax: null, evidence: [] }));
  assert.equal(item.remote, null);
  assert.equal(item.budgetMax, null);
  assert.equal(item.evidence.length, 0);
  assert.equal(item.canonicalKey, "https://example.com/jobs/website-redesign");
  assert.throws(() => normalizeOpportunity(candidate({ url: "javascript:alert(1)" })), /HTTP\(S\)/);
  assert.throws(() => normalizeOpportunity(candidate({ budgetMax: -1 })), /budgetMax/);
});

test("evidence summary preserves conflicts, stale facts and explicit knowledge states", () => {
  const item = normalizeOpportunity(candidate({
    evidence: [
      { id: "a", claimType: "budget", value: 1000, knowledgeState: "SUPPORTED" },
      { id: "b", claimType: "budget", value: 1500, knowledgeState: "SUPPORTED" },
      { id: "c", claimType: "deadline", value: "yesterday", knowledgeState: "STALE" },
    ],
  }));
  const evidence = assessEvidence(item);
  assert.equal(evidence.hasConflictingEvidence, true);
  assert.equal(evidence.hasStaleEvidence, true);
  assert.deepEqual(evidence.conflictingClaimTypes, ["budget"]);
  assert.equal(evidence.state, "CONFLICTING");
});

test("hard constraint evaluation does not treat missing values as a pass", () => {
  const item = normalizeOpportunity(candidate({ budgetMax: null, remote: null }));
  assert.equal(evaluateOpportunityEligibility(item, [
    { id: "remote-required", field: "remote", operator: "equals", value: true, required: true },
  ]).state, "UNCERTAIN");
  assert.equal(evaluateOpportunityEligibility(item, [
    { field: "remote", operator: "equals", value: true, required: true },
    { field: "budgetMax", operator: "min", value: 1000, required: true },
  ]).state, "UNCERTAIN");
  assert.equal(evaluateOpportunityEligibility(item, [
    { field: "remote", operator: "equals", value: false, required: true },
  ]).state, "INELIGIBLE");
  assert.equal(evaluateOpportunityEligibility(item, []).state, "UNCERTAIN");
  assert.throws(() => evaluateOpportunityEligibility(item, [{ field: "constructor", required: true, value: 1 }]), /Unsupported constraint field/);
});

test("fit dimensions and score expose their limitations and withhold insufficient evidence", () => {
  const item = normalizeOpportunity(candidate());
  const fit = assessSemanticFit({
    capabilities: ["web design", "conversion copy"],
    services: ["website redesign"],
    sectors: ["accounting"],
    contextTerms: ["remote"],
  }, item);
  assert.equal(fit.fitVersion, "lexical-fit-v1");
  assert.ok(fit.dimensions.some((dimension) => dimension.name === "capabilities"));
  assert.ok(fit.limitations.length > 0);
  const score = scoreOpportunityFit(fit);
  assert.equal(score.state, "SCORED");
  assert.ok(score.score >= 0 && score.score <= 100);
  const withheld = scoreOpportunityFit(assessSemanticFit({}, item));
  assert.equal(withheld.state, "WITHHELD");
  assert.equal(withheld.score, null);
});

test("ranking keeps ineligible and uncertain opportunities out of the eligible ranked set", () => {
  const result = assessOpportunitySet({
    candidates: [candidate(), candidate({ id: "opp-2", url: "https://example.com/jobs/remote-copywriter", title: "Remote copywriter", skills: ["copywriting"] })],
    profile: { capabilities: ["web design"], services: ["website redesign"], sectors: ["accounting"], contextTerms: ["remote"] },
    constraints: [{ field: "remote", operator: "equals", value: true, required: true }],
  });
  assert.equal(result.ranked.length, 1);
  assert.equal(result.ranked[0].ranking.rank, 1);
  assert.equal(result.separated.length, 1);
  assert.equal(result.separated[0].ranking.group, "ELIGIBILITY_UNCERTAIN");
  assert.match(result.provenanceNotice, /no live source was queried/);
});

test("duplicate canonical URLs do not produce duplicate ranked rows", () => {
  const normalized = normalizeOpportunity(candidate());
  const fake = (url, score) => ({
    opportunity: { ...normalized, canonicalKey: url },
    eligibility: { state: "ELIGIBLE" },
    score: { state: "SCORED", comparable: true, score },
  });
  const output = rankOpportunityAssessments([
    fake("https://example.com/job", 80),
    fake("https://example.com/job", 90),
  ]);
  assert.equal(output.ranked.length, 1);
  assert.equal(output.ranked[0].score.score, 80);
});
