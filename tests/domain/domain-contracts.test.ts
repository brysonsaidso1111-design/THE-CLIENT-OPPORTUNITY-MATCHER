import { describe, expect, it } from "vitest";
import { evaluateEligibility } from "../../src/domain/eligibility";
import { validateEvidenceBundle } from "../../src/domain/evidence";
import { isValidMoneyRange, normalizeCurrencyCode, type UserConstraint } from "../../src/domain/opportunity";
import { validateDiscoveryRequest } from "../../src/ports/discovery-provider";

const constraint = (
  id: string,
  mode: UserConstraint["mode"],
  desiredValue: unknown,
): UserConstraint => ({ id, subject: "budgetCurrency", mode, desiredValue, source: "USER_BRIEF" });

describe("evidence and provenance contracts", () => {
  it("rejects unsupported claims without evidence and broken source references", () => {
    const issues = validateEvidenceBundle({
      sources: [],
      evidence: [{
        id: "ev_1",
        sourceId: "source_missing",
        capturedAt: "2026-10-10T00:00:00.000Z",
        freshness: "CURRENT",
        limitations: [],
      }],
      claims: [{
        id: "claim_1",
        subjectId: "opp_1",
        predicate: "budget",
        value: 500,
        knowledgeState: "VERIFIED",
        evidenceIds: [],
        assessedAt: "2026-10-10T00:00:00.000Z",
      }],
    });

    expect(issues.map((issue) => issue.code)).toContain("MISSING_EVIDENCE_SOURCE");
    expect(issues.map((issue) => issue.code)).toContain("UNSUPPORTED_CLAIM_WITHOUT_EVIDENCE");
  });

  it("allows unknown claims to remain unknown without fabricated evidence", () => {
    expect(validateEvidenceBundle({
      sources: [],
      evidence: [],
      claims: [{
        id: "claim_unknown",
        subjectId: "opp_1",
        predicate: "budget",
        knowledgeState: "UNKNOWN",
        evidenceIds: [],
        assessedAt: "2026-10-10T00:00:00.000Z",
      }],
    })).toEqual([]);
  });
});

describe("canonical opportunity helpers", () => {
  it("validates currency and money range bounds", () => {
    expect(normalizeCurrencyCode(" usd ")).toBe("USD");
    expect(normalizeCurrencyCode("US")).toBeNull();
    expect(isValidMoneyRange({ minimum: 100, maximum: 200, currency: "USD" as never, knowledgeState: "VERIFIED", sourceClaimIds: [] })).toBe(true);
    expect(isValidMoneyRange({ minimum: 300, maximum: 200, currency: "USD" as never, knowledgeState: "VERIFIED", sourceClaimIds: [] })).toBe(false);
  });
});

describe("eligibility semantics", () => {
  it("blocks a known failed hard requirement", () => {
    const result = evaluateEligibility(
      [constraint("currency", "HARD_REQUIREMENT", "USD")],
      { budgetCurrency: { value: "EUR", knowledgeState: "VERIFIED" } },
    );
    expect(result.eligible).toBe("INELIGIBLE");
    expect(result.hardFailureIds).toEqual(["currency"]);
  });

  it("keeps an unknown hard requirement indeterminate, not failed", () => {
    const result = evaluateEligibility(
      [constraint("currency", "HARD_REQUIREMENT", "USD")],
      { budgetCurrency: { value: null, knowledgeState: "UNKNOWN" } },
    );
    expect(result.eligible).toBe("INDETERMINATE");
    expect(result.hardFailureIds).toEqual([]);
    expect(result.unresolvedHardConstraintIds).toEqual(["currency"]);
  });

  it("does not make a known preference failure ineligible", () => {
    const result = evaluateEligibility(
      [constraint("currency", "PREFERENCE", "USD")],
      { budgetCurrency: { value: "EUR", knowledgeState: "VERIFIED" } },
    );
    expect(result.eligible).toBe("ELIGIBLE");
  });

  it("does not claim eligibility when a hard constraint conflicts", () => {
    const result = evaluateEligibility(
      [constraint("currency", "HARD_REQUIREMENT", "USD")],
      { budgetCurrency: { value: "USD", knowledgeState: "CONFLICTING" } },
    );
    expect(result.eligible).toBe("INDETERMINATE");
  });
});

describe("discovery provider contract", () => {
  it("rejects invalid discovery limits and blank queries", () => {
    const issues = validateDiscoveryRequest({
      hunt: {
        id: "hunt_1",
        userId: "user_1",
        brief: "Find work",
        constraints: [],
        createdAt: "2026-10-10T00:00:00.000Z",
        status: "DRAFT",
      },
      query: " ",
      limit: 101,
      deadlineAt: "2026-10-10T00:00:00.000Z",
    });
    expect(issues).toHaveLength(2);
  });
});
