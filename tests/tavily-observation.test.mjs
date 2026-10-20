import test from "node:test";
import assert from "node:assert/strict";
import { tavilyObservationToOpportunity } from "../src/discovery/tavily-observation.mjs";

test("Tavily observation becomes canonical opportunity with unknown evidence state", () => {
  const item = tavilyObservationToOpportunity({
    title: "Company seeking a website redesign contractor",
    sourceUrl: "https://example.org/projects/redesign?utm_source=tavily",
    sourceDomain: "example.org",
    evidenceSnippet: "The company is seeking a contractor.",
    provider: "TAVILY_SEARCH",
    retrievedAt: "2026-10-20T12:00:00.000Z",
    sourcePublishedAt: null,
    freshnessState: "UNKNOWN",
    candidateType: "POSSIBLE_DIRECT_OPPORTUNITY",
    demandEvidence: "SIGNAL_DETECTED_REQUIRES_SOURCE_REVIEW",
    providerScore: 0.91,
  });

  assert.equal(item.title, "Company seeking a website redesign contractor");
  assert.equal(item.sourceName, "example.org");
  assert.equal(item.url, "https://example.org/projects/redesign?utm_source=tavily");
  assert.equal(item.organization, null);
  assert.equal(item.budgetMax, null);
  assert.equal(item.firstSeenAt, "2026-10-20T12:00:00.000Z");
  assert.equal(item.evidence[0].knowledgeState, "UNKNOWN");
  assert.equal(item.evidence[0].value.publisherDate, null);
  assert.equal(item.evidence[0].value.freshnessState, "UNKNOWN");
  assert.ok(item.limitations.some((value) => value.includes("not been independently verified")));
  assert.ok(item.tags.includes("candidate-type:possible_direct_opportunity"));
});

test("adapter refuses observations without a safe source identity", () => {
  assert.throws(() => tavilyObservationToOpportunity({ title: "No URL" }), TypeError);
});

test("provider retrieval time is not substituted for publisher publication date", () => {
  const item = tavilyObservationToOpportunity({
    title: "Undated prospect",
    sourceUrl: "https://example.org/about",
    sourceDomain: "example.org",
    retrievedAt: "2026-10-20T12:00:00.000Z",
    freshnessState: "UNKNOWN",
  });

  assert.equal(item.firstSeenAt, "2026-10-20T12:00:00.000Z");
  assert.equal(item.evidence[0].value.publisherDate, null);
  assert.ok(item.limitations.some((value) => value.includes("publication or update date is unknown")));
});
