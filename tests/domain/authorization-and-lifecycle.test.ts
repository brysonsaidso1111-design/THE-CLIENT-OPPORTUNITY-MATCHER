import { describe, expect, it } from "vitest";
import { authorizeProtectedOperation } from "../../src/domain/entitlement";
import { requestLifecycleTransition } from "../../src/domain/lifecycle";

const baseContext = {
  authenticatedUserId: "user_1",
  sessionValid: true,
  requiredProductId: "client-opportunity-matcher",
  now: "2026-10-10T00:00:00.000Z",
  entitlement: {
    id: "ent_1",
    ownerUserId: "user_1",
    productId: "client-opportunity-matcher",
    status: "ACTIVE" as const,
  },
};

describe("server-authoritative entitlement policy", () => {
  it("allows a valid active entitlement for its owner", () => {
    expect(authorizeProtectedOperation(baseContext)).toEqual({
      allowed: true,
      entitlementId: "ent_1",
      userId: "user_1",
    });
  });

  it("denies an absent or invalid session", () => {
    expect(authorizeProtectedOperation({ ...baseContext, sessionValid: false })).toEqual({
      allowed: false,
      denialCode: "AUTHENTICATION_REQUIRED",
    });
  });

  it("denies inactive entitlements", () => {
    expect(authorizeProtectedOperation({
      ...baseContext,
      entitlement: { ...baseContext.entitlement, status: "REFUNDED" },
    })).toEqual({ allowed: false, denialCode: "ENTITLEMENT_INACTIVE" });
  });

  it("denies cross-user resource access", () => {
    expect(authorizeProtectedOperation({
      ...baseContext,
      resourceOwnerUserId: "user_2",
    })).toEqual({ allowed: false, denialCode: "RESOURCE_NOT_OWNED" });
  });

  it("denies expired entitlement even if status says active", () => {
    expect(authorizeProtectedOperation({
      ...baseContext,
      entitlement: { ...baseContext.entitlement, validUntil: "2026-10-09T00:00:00.000Z" },
    })).toEqual({ allowed: false, denialCode: "ENTITLEMENT_INACTIVE" });
  });
});

describe("opportunity lifecycle transition rules", () => {
  it("does not treat an apply intention as a confirmed application", () => {
    expect(requestLifecycleTransition("PURSUING", "APPLICATION_CONFIRMED")).toEqual({
      accepted: false,
      reason: "UNCONFIRMED_EXTERNAL_OUTCOME",
    });
  });

  it("accepts application confirmation only when externally confirmed", () => {
    expect(requestLifecycleTransition("PURSUING", "APPLICATION_CONFIRMED", true)).toEqual({
      accepted: true,
      transition: { from: "PURSUING", event: "APPLICATION_CONFIRMED", to: "APPLIED" },
    });
  });

  it("rejects illegal transitions instead of guessing", () => {
    expect(requestLifecycleTransition("WON", "USER_PURSUING")).toEqual({
      accepted: false,
      reason: "INVALID_TRANSITION",
    });
  });

  it("allows explicit reopen events without erasing history", () => {
    expect(requestLifecycleTransition("EXPIRED", "USER_REOPENED")).toEqual({
      accepted: true,
      transition: { from: "EXPIRED", event: "USER_REOPENED", to: "DISCOVERED" },
    });
  });
});
