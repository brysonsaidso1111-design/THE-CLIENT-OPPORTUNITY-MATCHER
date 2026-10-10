import type { DiscoveryObservation, Hunt } from "../domain/opportunity";
import type { OperationOutcome } from "../domain/outcome";

export interface DiscoveryRequest {
  hunt: Hunt;
  query: string;
  limit: number;
  deadlineAt: string;
}

export interface DiscoveryProvider {
  readonly providerId: string;
  discover(request: DiscoveryRequest): Promise<OperationOutcome<readonly DiscoveryObservation[]>>;
}

/** Provider errors are mapped to typed failures; they must never become SUCCESS_EMPTY. */
export function validateDiscoveryRequest(request: DiscoveryRequest): string[] {
  const issues: string[] = [];
  if (request.query.trim() === "") issues.push("query must not be empty");
  if (!Number.isInteger(request.limit) || request.limit < 1 || request.limit > 100) {
    issues.push("limit must be an integer between 1 and 100");
  }
  if (request.hunt.id.trim() === "" || request.hunt.userId.trim() === "") {
    issues.push("hunt and user identifiers are required");
  }
  if (Number.isNaN(Date.parse(request.deadlineAt))) {
    issues.push("deadlineAt must be a valid timestamp");
  }
  return issues;
}
