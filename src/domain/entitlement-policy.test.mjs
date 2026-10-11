import test from "node:test";
import assert from "node:assert/strict";
import { authorizeProtectedAccess, authorizeOwnerEntitlementAction } from "./entitlement-policy.mjs";

test("protected access fails closed without auth or active entitlement", () => {
  assert.equal(authorizeProtectedAccess({ authenticated: false }, null).status, "DENIED");
  assert.equal(
    authorizeProtectedAccess({ authenticated: true, principalId: "u1" }, null).denial_code,
    "NOT_ENTITLED",
  );
  assert.equal(
    authorizeProtectedAccess(
      { authenticated: true, principalId: "u1" },
      { userId: "u1", state: "PENDING" },
    ).denial_code,
    "ENTITLEMENT_PENDING",
  );
  assert.equal(
    authorizeProtectedAccess(
      { authenticated: true, principalId: "u1" },
      { userId: "u1", state: "ACTIVE" },
    ).status,
    "SUCCESS",
  );
});

test("users cannot read another user's resource even with active entitlement", () => {
  const result = authorizeProtectedAccess(
    { authenticated: true, principalId: "u1" },
    { userId: "u1", state: "ACTIVE" },
    { resourceOwnerId: "u2" },
  );
  assert.equal(result.status, "DENIED");
  assert.equal(result.denial_code, "RESOURCE_OWNERSHIP_MISMATCH");
});

test("owner approval cannot be self-granted", () => {
  const denied = authorizeOwnerEntitlementAction(
    { authenticated: true, principalId: "owner1", isOwner: true },
    { userId: "owner1", state: "PENDING" },
    "APPROVE",
  );
  assert.equal(denied.denial_code, "SELF_APPROVAL_FORBIDDEN");

  const ok = authorizeOwnerEntitlementAction(
    { authenticated: true, principalId: "owner1", isOwner: true },
    { userId: "buyer1", state: "PENDING" },
    "APPROVE",
  );
  assert.equal(ok.status, "SUCCESS");
  assert.equal(ok.data.toState, "ACTIVE");
});

test("non-owners cannot approve", () => {
  const result = authorizeOwnerEntitlementAction(
    { authenticated: true, principalId: "u1", isOwner: false },
    { userId: "u2", state: "PENDING" },
    "APPROVE",
  );
  assert.equal(result.denial_code, "OWNER_REQUIRED");
});
