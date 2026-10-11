/**
 * Stage 17 entitlement policy helpers (domain-level).
 * Callers must authenticate the principal and load durable entitlement state
 * server-side before applying these predicates.
 */

import { entitlementAllowsAccess, operationOutcome } from "./contracts.mjs";

export const OWNER_ACTIONS = Object.freeze(["APPROVE", "REJECT", "REVOKE", "BLOCK", "UNBLOCK"]);

/**
 * @param {{ authenticated: boolean, principalId?: string|null, isOwner?: boolean }} principal
 * @param {{ userId: string, state: string }|null|undefined} entitlement
 * @param {{ resourceOwnerId?: string|null }} [resource]
 */
export function authorizeProtectedAccess(principal, entitlement, resource = {}) {
  if (!principal || principal.authenticated !== true || !principal.principalId) {
    return operationOutcome("DENIED", { denial_code: "UNAUTHENTICATED" });
  }
  if (!entitlement) {
    return operationOutcome("DENIED", { denial_code: "NOT_ENTITLED" });
  }
  if (entitlement.userId !== principal.principalId) {
    return operationOutcome("DENIED", { denial_code: "OWNERSHIP_MISMATCH" });
  }
  if (!entitlementAllowsAccess(entitlement.state)) {
    return operationOutcome("DENIED", { denial_code: `ENTITLEMENT_${String(entitlement.state || "UNKNOWN")}` });
  }
  if (resource.resourceOwnerId && resource.resourceOwnerId !== principal.principalId) {
    return operationOutcome("DENIED", { denial_code: "RESOURCE_OWNERSHIP_MISMATCH" });
  }
  return operationOutcome("SUCCESS", { data: { principalId: principal.principalId, entitlementState: entitlement.state } });
}

/**
 * Owner-only transition. Users cannot approve themselves.
 * @param {{ authenticated: boolean, principalId?: string|null, isOwner?: boolean }} actor
 * @param {{ userId: string, state: string }} entitlement
 * @param {string} action
 */
export function authorizeOwnerEntitlementAction(actor, entitlement, action) {
  if (!actor || actor.authenticated !== true || !actor.principalId) {
    return operationOutcome("DENIED", { denial_code: "UNAUTHENTICATED" });
  }
  if (actor.isOwner !== true) {
    return operationOutcome("DENIED", { denial_code: "OWNER_REQUIRED" });
  }
  if (!OWNER_ACTIONS.includes(action)) {
    return operationOutcome("DENIED", { denial_code: "UNSUPPORTED_ACTION" });
  }
  if (action === "APPROVE" && entitlement.userId === actor.principalId) {
    return operationOutcome("DENIED", { denial_code: "SELF_APPROVAL_FORBIDDEN" });
  }
  return operationOutcome("SUCCESS", {
    data: {
      action,
      fromState: entitlement.state,
      toState: nextState(entitlement.state, action),
    },
  });
}

function nextState(from, action) {
  if (action === "APPROVE") return "ACTIVE";
  if (action === "REJECT") return "PENDING";
  if (action === "REVOKE") return "REVOKED";
  if (action === "BLOCK") return "BLOCKED";
  if (action === "UNBLOCK") return "PENDING";
  return from;
}
