/**
 * Pure authorization policy. A server route must obtain these facts from
 * trusted session/database/provider verification—not from browser payloads.
 */

export type EntitlementStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "REVOKED"
  | "REFUNDED"
  | "DISPUTED"
  | "EXPIRED";

export interface AuthorizationContext {
  authenticatedUserId?: string;
  sessionValid: boolean;
  entitlement?: {
    id: string;
    ownerUserId: string;
    productId: string;
    status: EntitlementStatus;
    validUntil?: string;
  };
  requiredProductId: string;
  resourceOwnerUserId?: string;
  now: string;
}

export type AuthorizationDecision =
  | { allowed: true; entitlementId: string; userId: string }
  | {
      allowed: false;
      denialCode:
        | "AUTHENTICATION_REQUIRED"
        | "ENTITLEMENT_INACTIVE"
        | "RESOURCE_NOT_OWNED"
        | "POLICY_BLOCKED";
    };

/**
 * Authorization fails closed. Missing or untrusted facts must be resolved by
 * the caller before this policy is invoked; no browser-supplied entitlement
 * state is accepted as an input.
 */
export function authorizeProtectedOperation(
  context: AuthorizationContext,
): AuthorizationDecision {
  if (!context.sessionValid || !context.authenticatedUserId) {
    return { allowed: false, denialCode: "AUTHENTICATION_REQUIRED" };
  }

  const entitlement = context.entitlement;
  if (
    !entitlement ||
    entitlement.status !== "ACTIVE" ||
    entitlement.productId !== context.requiredProductId
  ) {
    return { allowed: false, denialCode: "ENTITLEMENT_INACTIVE" };
  }

  if (
    entitlement.validUntil !== undefined &&
    (Number.isNaN(Date.parse(entitlement.validUntil)) ||
      Date.parse(entitlement.validUntil) <= Date.parse(context.now))
  ) {
    return { allowed: false, denialCode: "ENTITLEMENT_INACTIVE" };
  }

  if (entitlement.ownerUserId !== context.authenticatedUserId) {
    return { allowed: false, denialCode: "POLICY_BLOCKED" };
  }

  if (
    context.resourceOwnerUserId !== undefined &&
    context.resourceOwnerUserId !== context.authenticatedUserId
  ) {
    return { allowed: false, denialCode: "RESOURCE_NOT_OWNED" };
  }

  return {
    allowed: true,
    entitlementId: entitlement.id,
    userId: context.authenticatedUserId,
  };
}
