import type { CanonicalOpportunity, UserConstraint } from "./opportunity";
import type { KnowledgeState } from "./evidence";

export type ConstraintResult = "PASS" | "FAIL" | "UNKNOWN" | "CONFLICT" | "STALE" | "NOT_APPLICABLE";

export interface ConstraintAssessment {
  constraintId: string;
  mode: UserConstraint["mode"];
  result: ConstraintResult;
  explanation: string;
}

export interface EligibilityAssessment {
  eligible: "ELIGIBLE" | "INELIGIBLE" | "INDETERMINATE";
  complete: boolean;
  assessments: readonly ConstraintAssessment[];
  hardFailureIds: readonly string[];
  unresolvedHardConstraintIds: readonly string[];
}

export interface ConstraintFact {
  value: unknown;
  knowledgeState: KnowledgeState;
}

/**
 * Evaluates hard constraints as gates and preferences as non-gating signals.
 * This deliberately uses exact matching until a later semantic-matching stage
 * supplies an explicit comparator. It never guesses equivalence from text.
 */
export function evaluateEligibility(
  constraints: readonly UserConstraint[],
  facts: Readonly<Record<string, ConstraintFact | undefined>>,
): EligibilityAssessment {
  const assessments: ConstraintAssessment[] = constraints.map((constraint) => {
    const fact = facts[constraint.subject];
    if (!fact) {
      return {
        constraintId: constraint.id,
        mode: constraint.mode,
        result: "UNKNOWN",
        explanation: "No comparable opportunity fact is available.",
      };
    }

    if (fact.knowledgeState === "CONFLICTING") {
      return {
        constraintId: constraint.id,
        mode: constraint.mode,
        result: "CONFLICT",
        explanation: "Available evidence conflicts; the requirement cannot be reliably assessed.",
      };
    }
    if (fact.knowledgeState === "STALE") {
      return {
        constraintId: constraint.id,
        mode: constraint.mode,
        result: "STALE",
        explanation: "The available fact may be outdated.",
      };
    }
    if (fact.knowledgeState === "UNKNOWN") {
      return {
        constraintId: constraint.id,
        mode: constraint.mode,
        result: "UNKNOWN",
        explanation: "The fact is explicitly unknown.",
      };
    }

    const acceptable = [constraint.desiredValue, ...(constraint.acceptableAlternatives ?? [])];
    const result = acceptable.some((value) => Object.is(value, fact.value)) ? "PASS" : "FAIL";
    return {
      constraintId: constraint.id,
      mode: constraint.mode,
      result,
      explanation:
        result === "PASS"
          ? "The known opportunity fact satisfies this constraint."
          : "The known opportunity fact does not match the requested value or accepted alternatives.",
    };
  });

  const hard = assessments.filter((assessment) => assessment.mode === "HARD_REQUIREMENT");
  const hardFailureIds = hard
    .filter((assessment) => assessment.result === "FAIL")
    .map((assessment) => assessment.constraintId);
  const unresolvedHardConstraintIds = hard
    .filter((assessment) =>
      assessment.result === "UNKNOWN" ||
      assessment.result === "CONFLICT" ||
      assessment.result === "STALE"
    )
    .map((assessment) => assessment.constraintId);

  let eligible: EligibilityAssessment["eligible"] = "ELIGIBLE";
  if (hardFailureIds.length > 0) eligible = "INELIGIBLE";
  else if (unresolvedHardConstraintIds.length > 0) eligible = "INDETERMINATE";

  return {
    eligible,
    complete: unresolvedHardConstraintIds.length === 0,
    assessments,
    hardFailureIds,
    unresolvedHardConstraintIds,
  };
}

/** The parameter is intentionally explicit to prevent confusing lifecycle with eligibility. */
export function isOpportunityEligible(
  assessment: EligibilityAssessment,
  _opportunity: Pick<CanonicalOpportunity, "id">,
): boolean {
  return assessment.eligible === "ELIGIBLE";
}
