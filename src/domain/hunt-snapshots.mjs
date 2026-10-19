/**
 * Pure hunt snapshot and verdict handoff rules.
 *
 * This module does not search the web, persist data, authenticate users, or
 * authorize access. Those responsibilities remain at their owning boundaries.
 */

const COMPLETED_STATUSES = new Set(["SUCCESS", "SUCCESS_EMPTY", "SUCCESS_PARTIAL"]);
const ALL_STATUSES = new Set(["SUCCESS", "SUCCESS_EMPTY", "SUCCESS_PARTIAL", "DENIED", "FAILED"]);

function requireNonEmptyString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${field} must be a non-empty string`);
  }
}

function cloneJsonValue(value, field) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${field} must be an object`);
  }
  try {
    return structuredClone(value);
  } catch {
    throw new TypeError(`${field} must contain cloneable data`);
  }
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

/**
 * Build an immutable record tying discovered results to the exact brief
 * version that produced them. Persist this record at the integration boundary.
 *
 * @param {{
 *   huntId:string, briefId:string, briefVersion:string|number,
 *   briefSnapshot:object, status:string, results:object[],
 *   startedAt:string, completedAt?:string|null, warnings?:string[]
 * }} input
 */
export function createHuntSnapshot(input) {
  if (!input || typeof input !== "object") throw new TypeError("Hunt snapshot input is required");
  requireNonEmptyString(input.huntId, "huntId");
  requireNonEmptyString(input.briefId, "briefId");
  if (!(typeof input.briefVersion === "string" || (typeof input.briefVersion === "number" && Number.isFinite(input.briefVersion)))) {
    throw new TypeError("briefVersion must be a string or finite number");
  }
  if (!ALL_STATUSES.has(input.status)) throw new TypeError("Unsupported hunt status");
  requireNonEmptyString(input.startedAt, "startedAt");
  if (!Array.isArray(input.results)) throw new TypeError("results must be an array");
  if (input.results.some((result) => !result || typeof result !== "object" || Array.isArray(result))) {
    throw new TypeError("each result must be an object");
  }
  if (input.warnings !== undefined && (!Array.isArray(input.warnings) || input.warnings.some((item) => typeof item !== "string"))) {
    throw new TypeError("warnings must be an array of strings");
  }

  const isCompleted = COMPLETED_STATUSES.has(input.status);
  if (isCompleted) requireNonEmptyString(input.completedAt, "completedAt");
  if (!isCompleted && input.completedAt != null) {
    throw new TypeError("incomplete or failed hunts cannot have completedAt");
  }
  if (input.status === "SUCCESS" && input.results.length === 0) {
    throw new TypeError("SUCCESS requires at least one result; use SUCCESS_EMPTY for zero results");
  }
  if (input.status === "SUCCESS_EMPTY" && input.results.length !== 0) {
    throw new TypeError("SUCCESS_EMPTY requires zero results");
  }
  if (input.status === "SUCCESS_PARTIAL" && input.results.length === 0) {
    throw new TypeError("SUCCESS_PARTIAL requires at least one partial result");
  }

  return deepFreeze({
    huntId: input.huntId,
    briefId: input.briefId,
    briefVersion: input.briefVersion,
    briefSnapshot: cloneJsonValue(input.briefSnapshot, "briefSnapshot"),
    status: input.status,
    results: structuredClone(input.results),
    startedAt: input.startedAt,
    completedAt: input.completedAt ?? null,
    warnings: [...(input.warnings ?? [])],
  });
}

/**
 * Resolve whether the latest hunt can be analysed against the currently
 * selected brief. The caller must load the hunt and brief through an
 * authenticated, entitlement-checked, user-scoped server boundary.
 */
export function resolveVerdictInput({ latestHunt, currentBrief }) {
  if (!latestHunt) return Object.freeze({ status: "SEARCH_REQUIRED" });
  if (!currentBrief) return Object.freeze({ status: "BRIEF_REQUIRED" });
  if (!COMPLETED_STATUSES.has(latestHunt.status)) {
    return Object.freeze({ status: "SEARCH_UNAVAILABLE" });
  }
  if (latestHunt.briefId !== currentBrief.briefId || latestHunt.briefVersion !== currentBrief.briefVersion) {
    return Object.freeze({ status: "BRIEF_CHANGED", huntId: latestHunt.huntId });
  }
  if (latestHunt.status === "SUCCESS_EMPTY") {
    return Object.freeze({ status: "NO_RESULTS", huntId: latestHunt.huntId, briefSnapshot: latestHunt.briefSnapshot });
  }
  return deepFreeze({
    status: "READY",
    huntId: latestHunt.huntId,
    briefId: latestHunt.briefId,
    briefVersion: latestHunt.briefVersion,
    briefSnapshot: structuredClone(latestHunt.briefSnapshot),
    results: structuredClone(latestHunt.results),
    warnings: [...(latestHunt.warnings ?? [])],
  });
}
