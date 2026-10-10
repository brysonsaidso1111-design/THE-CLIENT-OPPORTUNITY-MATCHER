/**
 * Canonical operation outcome contract from Stage 16.
 *
 * Keep expected authorization denials separate from technical failures.
 * Never translate provider/configuration failures into successful empty results.
 */

export type OperationStatus =
  | "SUCCESS_WITH_RESULTS"
  | "SUCCESS_EMPTY"
  | "SUCCESS_PARTIAL"
  | "DENIED"
  | "FAILED"
  | "CANCELLED"
  | "NOT_RUN";

export type FailureCode =
  | "CONFIGURATION_MISSING"
  | "AUTHENTICATION_FAILED"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "NETWORK_UNAVAILABLE"
  | "DEPENDENCY_UNAVAILABLE"
  | "PARTIAL_RESULT"
  | "INVALID_RESPONSE"
  | "VALIDATION_FAILED"
  | "PERSISTENCE_FAILED"
  | "PROCESSING_FAILED"
  | "UNKNOWN_FAILURE";

export type DenialCode =
  | "AUTHENTICATION_REQUIRED"
  | "INVALID_CREDENTIAL"
  | "ENTITLEMENT_INACTIVE"
  | "RESOURCE_NOT_OWNED"
  | "POLICY_BLOCKED"
  | "ABUSE_LIMITED"
  | "UNTRUSTED_EVENT"
  | "UNKNOWN_DENIAL";

export type DegradationReason =
  | "PARTIAL_RESULT"
  | "STALE_SOURCE"
  | "SOURCE_UNAVAILABLE"
  | "LOW_CONFIDENCE"
  | "OPTIONAL_ENRICHMENT_SKIPPED";

export interface OperationMeta {
  operationId: string;
  occurredAt: string;
  warnings?: readonly string[];
}

export type OperationOutcome<T> =
  | (OperationMeta & {
      status: "SUCCESS_WITH_RESULTS";
      data: T;
      completeness: "complete";
    })
  | (OperationMeta & {
      status: "SUCCESS_EMPTY";
      data: T;
      completeness: "complete";
    })
  | (OperationMeta & {
      status: "SUCCESS_PARTIAL";
      data: T;
      completeness: "partial";
      degradationReasons: readonly DegradationReason[];
    })
  | (OperationMeta & {
      status: "DENIED";
      denialCode: DenialCode;
    })
  | (OperationMeta & {
      status: "FAILED";
      failureCode: FailureCode;
      retryable: boolean;
    })
  | (OperationMeta & {
      status: "CANCELLED";
      reason?: "USER_REQUESTED" | "PARENT_CANCELLED" | "DEADLINE_EXCEEDED";
    })
  | (OperationMeta & {
      status: "NOT_RUN";
      reason: "POLICY_SKIPPED" | "USER_SKIPPED" | "DEPENDENCY_SKIPPED";
    });

export function isSuccessful<T>(
  outcome: OperationOutcome<T>,
): outcome is Extract<
  OperationOutcome<T>,
  { status: "SUCCESS_WITH_RESULTS" | "SUCCESS_EMPTY" | "SUCCESS_PARTIAL" }
> {
  return (
    outcome.status === "SUCCESS_WITH_RESULTS" ||
    outcome.status === "SUCCESS_EMPTY" ||
    outcome.status === "SUCCESS_PARTIAL"
  );
}

/**
 * Runtime guard for data received across trust boundaries.
 * TypeScript types alone do not validate external JSON.
 */
export function hasValidOutcomeShape(value: unknown): value is OperationOutcome<unknown> {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.operationId !== "string" ||
    candidate.operationId.trim() === "" ||
    typeof candidate.occurredAt !== "string" ||
    Number.isNaN(Date.parse(candidate.occurredAt)) ||
    typeof candidate.status !== "string"
  ) {
    return false;
  }

  switch (candidate.status) {
    case "SUCCESS_WITH_RESULTS":
    case "SUCCESS_EMPTY":
      return (
        "data" in candidate &&
        candidate.completeness === "complete" &&
        !("failureCode" in candidate) &&
        !("denialCode" in candidate)
      );
    case "SUCCESS_PARTIAL":
      return (
        "data" in candidate &&
        candidate.completeness === "partial" &&
        Array.isArray(candidate.degradationReasons) &&
        candidate.degradationReasons.length > 0 &&
        !("failureCode" in candidate) &&
        !("denialCode" in candidate)
      );
    case "DENIED":
      return (
        typeof candidate.denialCode === "string" &&
        candidate.denialCode.trim() !== "" &&
        !("failureCode" in candidate)
      );
    case "FAILED":
      return (
        typeof candidate.failureCode === "string" &&
        candidate.failureCode.trim() !== "" &&
        typeof candidate.retryable === "boolean" &&
        !("denialCode" in candidate)
      );
    case "CANCELLED":
      return !("failureCode" in candidate) && !("denialCode" in candidate);
    case "NOT_RUN":
      return (
        typeof candidate.reason === "string" &&
        !("failureCode" in candidate) &&
        !("denialCode" in candidate)
      );
    default:
      return false;
  }
}
