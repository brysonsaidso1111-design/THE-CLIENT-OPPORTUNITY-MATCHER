/**
 * Shared domain vocabulary for the approved Stage 1/3/16 contracts.
 *
 * This module is deliberately pure: it has no network, database, provider,
 * authentication, or authorization side effects. Persistence and access control
 * are implemented at their owning boundaries, not hidden in domain helpers.
 */

/** @typedef {"SUCCESS"|"SUCCESS_EMPTY"|"SUCCESS_PARTIAL"|"DENIED"|"FAILED"} OperationStatus */
/** @typedef {{status: OperationStatus, data?: unknown, denial_code?: string, failure_code?: string, warnings?: string[]}} OperationOutcome */
/** @typedef {"PENDING"|"ACTIVE"|"REVOKED"|"BLOCKED"} EntitlementState */
/** @typedef {"PASS"|"FAIL"|"UNKNOWN"|"NOT_EVALUATED"} EvaluationState */

/**
 * Construct a consistent operation outcome without exposing raw provider,
 * database, or authentication diagnostics.
 * @param {OperationStatus} status
 * @param {object} [details]
 * @returns {OperationOutcome}
 */
export function operationOutcome(status, details = {}) {
  if (!["SUCCESS", "SUCCESS_EMPTY", "SUCCESS_PARTIAL", "DENIED", "FAILED"].includes(status)) {
    throw new TypeError("Unsupported operation status");
  }

  const allowed = new Set(["data", "denial_code", "failure_code", "warnings"]);
  for (const key of Object.keys(details)) {
    if (!allowed.has(key)) throw new TypeError("Unsupported outcome field");
  }

  if (status === "DENIED") {
    if (typeof details.denial_code !== "string" || !details.denial_code.trim()) {
      throw new TypeError("DENIED outcomes require a denial_code");
    }
    if ("failure_code" in details) throw new TypeError("DENIED outcomes cannot contain failure_code");
  } else if (status === "FAILED") {
    if (typeof details.failure_code !== "string" || !details.failure_code.trim()) {
      throw new TypeError("FAILED outcomes require a failure_code");
    }
    if ("denial_code" in details) throw new TypeError("FAILED outcomes cannot contain denial_code");
  } else if ("denial_code" in details || "failure_code" in details) {
    throw new TypeError("Successful outcomes cannot contain denial/failure codes");
  }

  if ("warnings" in details && (!Array.isArray(details.warnings) || details.warnings.some((v) => typeof v !== "string"))) {
    throw new TypeError("warnings must be an array of strings");
  }

  return Object.freeze({ status, ...details });
}

/**
 * Decide whether a persisted entitlement state is eligible for access.
 * This is a domain predicate only. Callers MUST authenticate the principal,
 * fetch the current entitlement server-side, enforce ownership/RLS, and fail
 * closed on lookup errors before using this result for a protected request.
 * @param {EntitlementState|string|null|undefined} state
 */
export function entitlementAllowsAccess(state) {
  return state === "ACTIVE";
}

/**
 * Evaluate one constraint without converting missing/conflicting evidence to
 * a pass or silently turning an unknown hard constraint into a preference.
 * @param {{required: boolean, observedState?: EvaluationState, matches?: boolean|null}} constraint
 * @returns {{state: EvaluationState, required: boolean}}
 */
export function evaluateConstraint(constraint) {
  if (!constraint || typeof constraint.required !== "boolean") {
    throw new TypeError("Constraint must declare whether it is required");
  }

  const observed = constraint.observedState;
  if (observed === "NOT_EVALUATED") return { state: "NOT_EVALUATED", required: constraint.required };
  if (observed === "FAIL") return { state: "FAIL", required: constraint.required };
  if (observed === "PASS") return { state: "PASS", required: constraint.required };
  if (observed === "UNKNOWN" || constraint.matches == null) {
    return { state: "UNKNOWN", required: constraint.required };
  }
  if (observed !== undefined && observed !== "PASS") {
    throw new TypeError("Unsupported constraint evaluation state");
  }
  return { state: constraint.matches ? "PASS" : "FAIL", required: constraint.required };
}

/**
 * Aggregate hard-constraint eligibility without mixing in semantic fit, score,
 * ranking, quality, risk, or recommendation.
 * @param {Array<{required:boolean, observedState?:EvaluationState, matches?:boolean|null}>} constraints
 * @returns {{state: EvaluationState, requiredFailures: number, requiredUnknowns: number, evaluatedCount: number}}
 */
export function evaluateEligibility(constraints) {
  if (!Array.isArray(constraints)) throw new TypeError("constraints must be an array");
  const evaluated = constraints.map(evaluateConstraint);
  const requiredFailures = evaluated.filter((item) => item.required && item.state === "FAIL").length;
  const requiredUnknowns = evaluated.filter((item) => item.required && (item.state === "UNKNOWN" || item.state === "NOT_EVALUATED")).length;

  let state;
  if (constraints.length === 0) state = "UNKNOWN";
  else if (requiredFailures > 0) state = "FAIL";
  else if (requiredUnknowns > 0) state = "UNKNOWN";
  else state = "PASS";

  return Object.freeze({
    state,
    requiredFailures,
    requiredUnknowns,
    evaluatedCount: evaluated.filter((item) => item.state !== "NOT_EVALUATED").length,
  });
}
