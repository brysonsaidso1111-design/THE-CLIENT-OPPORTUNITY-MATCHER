import test from "node:test";
import assert from "node:assert/strict";
import {
  assessTavilyFreshness,
  buildTavilyQuery,
  buildTavilyQueryFamily,
  classifyDiscoveryObservation,
  searchTavily,
  TavilyProviderError,
} from "../src/providers/tavily.mjs";

const now = new Date("2026-10-20T12:00:00.000Z");

function response(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  };
}

test("buildTavilyQuery creates a bounded query from structured Hunt fields", () => {
  const query = buildTavilyQuery({
    service: "website design",
    capabilities: ["ecommerce", "conversion optimization"],
    targetClientType: "small businesses",
    location: "United States",
  });
  assert.match(query, /website design/);
  assert.match(query, /ecommerce/);
  assert.match(query, /request for proposal/);
  assert.ok(query.length <= 400);
});

test("query families are prioritized, deduplicated, and bounded to three", () => {
  const family = buildTavilyQueryFamily({
    service: "website design",
    capabilities: ["ecommerce"],
    problemSolved: "low online conversion",
    deliverable: "website redesign",
    targetClientType: "retail businesses",
    location: "United States",
  });
  assert.equal(family.length, 3);
  assert.match(family[0], /website design/);
  assert.match(family[0], /request for proposal/);
  assert.match(family[1], /low online conversion/);
  assert.match(family[2], /procurement RFP/);
  assert.ok(family.every((query) => query.length <= 400));
});

test("buildTavilyQuery rejects an empty or overlong raw query", () => {
  assert.throws(() => buildTavilyQuery("  "), TypeError);
  assert.throws(() => buildTavilyQuery("x".repeat(401)), TypeError);
});

test("freshness uses the publisher date and the configured maximum of 120 days", () => {
  const fresh = assessTavilyFreshness(
    { published_date: "2026-10-01" },
    { now, freshnessDays: 120 },
  );
  const stale = assessTavilyFreshness(
    { published_date: "2026-05-01" },
    { now, freshnessDays: 120 },
  );
  const unknown = assessTavilyFreshness({ title: "Undated page" }, { now });
  assert.equal(fresh.freshnessState, "WITHIN_WINDOW");
  assert.equal(stale.freshnessState, "OUTSIDE_WINDOW");
  assert.equal(unknown.freshnessState, "UNKNOWN");
  assert.equal(unknown.sourceDate, null);
});

test("generic articles and vendor promotions are not labelled as active opportunities", () => {
  assert.equal(
    classifyDiscoveryObservation({ title: "How to choose a web designer", content: "Tips for businesses" }).candidateType,
    "CONTEXT_OR_PROMOTION",
  );
  assert.equal(
    classifyDiscoveryObservation({ title: "We offer website design services", content: "Contact us for a quote" }).candidateType,
    "CONTEXT_OR_PROMOTION",
  );
  assert.equal(
    classifyDiscoveryObservation({ title: "Company seeking a website redesign contractor", content: "Submit proposal by Friday" }).candidateType,
    "POSSIBLE_DIRECT_OPPORTUNITY",
  );
  assert.equal(
    classifyDiscoveryObservation({ title: "Acme company", content: "We operate in retail" }).demandEvidence,
    "UNCONFIRMED",
  );
});

test("searchTavily sends bounded, server-side discovery parameters and preserves provenance", async () => {
  let captured;
  const result = await searchTavily({
    hunt: { service: "website design", targetClientType: "retail businesses" },
    apiKey: "server-secret",
    now,
    maxResults: 99,
    fetchImpl: async (url, init) => {
      captured = { url, init, body: JSON.parse(init.body) };
      return response(200, {
        usage: { credits: 1 },
        results: [
          {
            title: "Acme seeks website redesign contractor",
            url: "https://acme.example/projects/redesign",
            content: "Acme is seeking a contractor. Submit proposal.",
            published_date: "2026-10-01",
            score: 0.91,
          },
          {
            title: "Duplicate URL",
            url: "https://acme.example/projects/redesign",
            content: "duplicate",
            published_date: "2026-10-01",
          },
          {
            title: "Undated company page",
            url: "https://company.example/about",
            content: "A retail company.",
          },
          {
            title: "Old project",
            url: "https://old.example/project",
            content: "Seeking a contractor.",
            published_date: "2026-01-01",
          },
          {
            title: "Unsafe URL",
            url: "javascript:alert(1)",
            content: "Ignore",
          },
        ],
      });
    },
  });

  assert.equal(captured.url, "https://api.tavily.com/search");
  assert.equal(captured.body.api_key, "server-secret");
  assert.equal(captured.body.max_results, 10);
  assert.equal(captured.body.include_answer, false);
  assert.equal(captured.body.include_raw_content, false);
  assert.equal(captured.body.start_date, "2026-06-22");
  assert.equal(captured.body.end_date, "2026-10-20");
  assert.equal(result.resultCount, 3);
  assert.equal(result.excludedOutsideWindowCount, 1);
  assert.equal(result.results[0].sourceUrl, "https://acme.example/projects/redesign");
  assert.equal(result.results[0].provider, "TAVILY_SEARCH");
  assert.equal(result.results[0].verificationState, "UNVERIFIED");
  assert.equal(result.results[1].freshnessState, "UNKNOWN");
  assert.equal(result.results[1].demandEvidence, "UNCONFIRMED");
  assert.equal(JSON.stringify(result).includes("server-secret"), false);
});

test("provider failures are distinct from successful empty discovery", async () => {
  await assert.rejects(
    searchTavily({ query: "web design project", apiKey: "x", fetchImpl: async () => response(429, {}) }),
    (error) => error instanceof TavilyProviderError && error.code === "RATE_LIMITED",
  );
  await assert.rejects(
    searchTavily({ query: "web design project", apiKey: "x", fetchImpl: async () => response(200, { results: "invalid" }) }),
    (error) => error instanceof TavilyProviderError && error.code === "MALFORMED_RESPONSE",
  );
  const empty = await searchTavily({
    query: "web design project",
    apiKey: "x",
    now,
    fetchImpl: async () => response(200, { results: [] }),
  });
  assert.equal(empty.outcome, "NO_VALID_RESULTS");
  assert.equal(empty.resultCount, 0);
});
