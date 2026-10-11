import test from "node:test";
import assert from "node:assert/strict";
import {
  operationOutcome,
  entitlementAllowsAccess,
  evaluateConstraint,
  evaluateEligibility,
} from "./contracts.mjs";

test("operation outcome vocabulary and typed denial/failure are enforced", () => {
  assert.equal(operationOutcome("SUCCESS", { data: { ok: true } }).status, "SUCCESS");
  assert.equal(operationOutcome("SUCCESS_EMPTY").status, "SUCCESS_EMPTY");
  assert.equal(operationOutcome("SUCCESS_PARTIAL", { warnings: ["partial"] }).status, "SUCCESS_PARTIAL");
  assert.equal(operationOutcome("DENIED", { denial_code: "NOT_ENTITLED" }).denial_code, "NOT_ENTITLED");
  assert.equal(operationOutcome("FAILED", { failure_code: "DEPENDENCY_UNAVAILABLE" }).failure_code, "DEPENDENCY_UNAVAILABLE");
  assert.throws(() => operationOutcome("DENIED"), /denial_code/);
  assert.throws(() => operationOutcome("FAILED"), /failure_code/);
  assert.throws(() => operationOutcome("DENIED", { failure_code: "SECRET_DETAIL" }), /denial_code/);
  assert.throws(() => operationOutcome("SUCCESS", { failure_code: "NO" }), /successful outcomes/);
  assert.throws(() => operationOutcome("SUCCESS", { rawDiagnostic: "private" }), /Unsupported outcome field/);
});

test("only canonical ACTIVE entitlement allows access", () => {
  for (const state of ["PENDING", "REVOKED", "BLOCKED", "APPROVED", "active", null, undefined]) {
    assert.equal(entitlementAllowsAccess(state), false, String(state));
  }
  assert.equal(entitlementAllowsAccess("ACTIVE"), true);
});

test("constraint evaluation preserves unknown and not-evaluated states", () => {
  assert.deepEqual(evaluateConstraint({ required: true, matches: true }), { state: "PASS", required: true });
  assert.deepEqual(evaluateConstraint({ required: true, matches: false }), { state: "FAIL", required: true });
  assert.deepEqual(evaluateConstraint({ required: true, matches: null }), { state: "UNKNOWN", required: true });
  assert.deepEqual(evaluateConstraint({ required: false, observedState: "NOT_EVALUATED" }), { state: "NOT_EVALUATED", required: false });
  assert.throws(() => evaluateConstraint({ matches: true }), /required/);
});

test("eligibility uses hard constraints only and never upgrades unknown to pass", () => {
  assert.deepEqual(evaluateEligibility([{ required: true, matches: true }]), {
    state: "PASS", requiredFailures: 0, requiredUnknowns: 0, evaluatedCount: 1,
  });
  assert.equal(evaluateEligibility([{ required: true, matches: true }, { required: true, matches: false }]).state, "FAIL");
  assert.equal(evaluateEligibility([{ required: true, matches: true }, { required: true, matches: null }]).state, "UNKNOWN");
  assert.equal(evaluateEligibility([{ required: true, matches: true }, { required: false, matches: null }]).state, "PASS");
  assert.equal(evaluateEligibility([{ required: true, observedState: "NOT_EVALUATED" }]).state, "UNKNOWN");
  assert.equal(evaluateEligibility([]).state, "PASS");
  assert.throws(() => evaluateEligibility({}), /array/);
});
