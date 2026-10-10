import { describe, expect, it } from "vitest";
import {
  hasValidOutcomeShape,
  isSuccessful,
  type OperationOutcome,
} from "../../src/domain/outcome";

const meta = {
  operationId: "op_test_01",
  occurredAt: "2026-10-10T00:00:00.000Z",
};

describe("operation outcomes", () => {
  it("treats a successful empty search as success, not failure", () => {
    const outcome: OperationOutcome<string[]> = {
      ...meta,
      status: "SUCCESS_EMPTY",
      data: [],
      completeness: "complete",
    };

    expect(isSuccessful(outcome)).toBe(true);
    expect(hasValidOutcomeShape(outcome)).toBe(true);
  });

  it("requires a denial code for expected access denials", () => {
    expect(
      hasValidOutcomeShape({
        ...meta,
        status: "DENIED",
        denialCode: "ENTITLEMENT_INACTIVE",
      }),
    ).toBe(true);

    expect(
      hasValidOutcomeShape({
        ...meta,
        status: "DENIED",
      }),
    ).toBe(false);
  });

  it("requires a failure code and retryability for technical failures", () => {
    expect(
      hasValidOutcomeShape({
        ...meta,
        status: "FAILED",
        failureCode: "CONFIGURATION_MISSING",
        retryable: false,
      }),
    ).toBe(true);

    expect(
      hasValidOutcomeShape({
        ...meta,
        status: "FAILED",
        denialCode: "ENTITLEMENT_INACTIVE",
      }),
    ).toBe(false);
  });

  it("requires explicit degradation reasons for partial success", () => {
    expect(
      hasValidOutcomeShape({
        ...meta,
        status: "SUCCESS_PARTIAL",
        data: [{ id: "opp_1" }],
        completeness: "partial",
        degradationReasons: ["SOURCE_UNAVAILABLE"],
      }),
    ).toBe(true);

    expect(
      hasValidOutcomeShape({
        ...meta,
        status: "SUCCESS_PARTIAL",
        data: [],
        completeness: "partial",
        degradationReasons: [],
      }),
    ).toBe(false);
  });

  it("rejects unknown statuses and malformed timestamps", () => {
    expect(
      hasValidOutcomeShape({
        ...meta,
        status: "MAYBE",
      }),
    ).toBe(false);

    expect(
      hasValidOutcomeShape({
        operationId: "op_test_02",
        occurredAt: "not-a-date",
        status: "CANCELLED",
      }),
    ).toBe(false);
  });
});
