import test from "node:test";
import assert from "node:assert/strict";
import { createHuntBudget, getSourceRegistry, routeSources } from "../src/discovery/source-registry.mjs";

test("Tavily is registered as semantic web discovery, not a structured opportunity database", () => {
  const [tavily] = getSourceRegistry();
  assert.equal(tavily.acquisitionProvider, "TAVILY");
  assert.equal(tavily.capabilities.semanticWebDiscovery, true);
  assert.equal(tavily.capabilities.structuredOpportunitySearch, false);
  assert.equal(tavily.capabilities.structuredContactDetails, false);
  assert.equal(tavily.capabilities.maxLookbackDays, 120);
});

test("source routing discloses limitations for structured listings", () => {
  const route = routeSources({ opportunityType: "STRUCTURED_JOB_LISTING" });
  assert.equal(route.status, "ROUTED");
  assert.equal(route.selectedSourceIds.includes("tavily-web-search"), true);
  assert.match(route.sources[0].routeReason, /cannot guarantee structured records/);
  assert.ok(route.sources[0].limitations.some((item) => item.includes("source specific structured adapter")));
});

test("Tavily is not routed when the Hunt hard requires structured contact or budget data", () => {
  assert.equal(routeSources({ requireStructuredContacts: true }).status, "NO_COMPATIBLE_SOURCE");
  assert.equal(routeSources({ requireStructuredBudget: true }).status, "NO_COMPATIBLE_SOURCE");
});

test("search budget is bounded even when callers request excessive limits", () => {
  const budget = createHuntBudget({
    maxProviderCalls: 999,
    maxResultsPerCall: 500,
    maxUniqueCandidates: 500,
    maxFreshnessDays: 9999,
  });
  assert.equal(budget.maxProviderCalls, 3);
  assert.equal(budget.initialProviderCalls, 1);
  assert.equal(budget.maxResultsPerCall, 10);
  assert.equal(budget.maxUniqueCandidates, 10);
  assert.equal(budget.maxFreshnessDays, 120);
});
