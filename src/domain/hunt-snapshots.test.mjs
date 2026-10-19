import test from "node:test";
import assert from "node:assert/strict";
import { createHuntSnapshot, resolveVerdictInput } from "./hunt-snapshots.mjs";

function validHunt(overrides = {}) {
  return createHuntSnapshot({
    huntId: "hunt-1",
    briefId: "brief-1",
    briefVersion: 3,
    briefSnapshot: { service: "web design", target: "small businesses" },
    status: "SUCCESS",
    results: [{ title: "Prospect A", sourceUrl: "https://example.com/source" }],
    startedAt: "2026-10-19T10:00:00.000Z",
    completedAt: "2026-10-19T10:00:05.000Z",
    ...overrides,
  });
}

test("hunt snapshot binds results to an immutable brief version", () => {
  const hunt = validHunt();
  assert.equal(hunt.briefId, "brief-1");
  assert.equal(hunt.briefVersion, 3);
  assert.equal(Object.isFrozen(hunt), true);
  assert.equal(Object.isFrozen(hunt.results), true);
  assert.equal(Object.isFrozen(hunt.briefSnapshot), true);
});

test("hunt snapshot rejects impossible success and empty states", () => {
  assert.throws(() => validHunt({ results: [] }), /SUCCESS requires at least one result/);
  assert.equal(validHunt({ status: "SUCCESS_EMPTY", results: [] }).status, "SUCCESS_EMPTY");
  assert.throws(() => validHunt({ status: "SUCCESS_EMPTY", results: [{ title: "A" }] }), /SUCCESS_EMPTY requires zero results/);
  assert.throws(() => validHunt({ status: "SUCCESS_PARTIAL", results: [] }), /SUCCESS_PARTIAL requires at least one partial result/);
});

test("verdict requires a search and the current brief", () => {
  assert.deepEqual(resolveVerdictInput({ latestHunt: null, currentBrief: { briefId: "brief-1", briefVersion: 3 } }), { status: "SEARCH_REQUIRED" });
  assert.deepEqual(resolveVerdictInput({ latestHunt: validHunt(), currentBrief: null }), { status: "BRIEF_REQUIRED" });
});

test("verdict refuses to silently analyse results against an edited brief", () => {
  const hunt = validHunt();
  const result = resolveVerdictInput({
    latestHunt: hunt,
    currentBrief: { briefId: "brief-1", briefVersion: 4 },
  });
  assert.deepEqual(result, { status: "BRIEF_CHANGED", huntId: "hunt-1" });
});

test("verdict passes the original brief snapshot and actual results when versions match", () => {
  const hunt = validHunt();
  const result = resolveVerdictInput({
    latestHunt: hunt,
    currentBrief: { briefId: "brief-1", briefVersion: 3 },
  });
  assert.equal(result.status, "READY");
  assert.deepEqual(result.briefSnapshot, hunt.briefSnapshot);
  assert.deepEqual(result.results, hunt.results);
  assert.equal(result.huntId, "hunt-1");
});

test("empty successful search is distinct from provider failure", () => {
  const empty = createHuntSnapshot({
    huntId: "hunt-empty",
    briefId: "brief-1",
    briefVersion: 3,
    briefSnapshot: { service: "web design" },
    status: "SUCCESS_EMPTY",
    results: [],
    startedAt: "2026-10-19T10:00:00.000Z",
    completedAt: "2026-10-19T10:00:05.000Z",
  });
  assert.equal(resolveVerdictInput({
    latestHunt: empty,
    currentBrief: { briefId: "brief-1", briefVersion: 3 },
  }).status, "NO_RESULTS");

  const failed = createHuntSnapshot({
    huntId: "hunt-failed",
    briefId: "brief-1",
    briefVersion: 3,
    briefSnapshot: { service: "web design" },
    status: "FAILED",
    results: [],
    startedAt: "2026-10-19T10:00:00.000Z",
  });
  assert.equal(resolveVerdictInput({
    latestHunt: failed,
    currentBrief: { briefId: "brief-1", briefVersion: 3 },
  }).status, "SEARCH_UNAVAILABLE");
});
