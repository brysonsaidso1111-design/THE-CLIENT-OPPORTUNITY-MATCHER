import type { CanonicalOpportunity } from "./opportunity";

export type LifecycleState = CanonicalOpportunity["lifecycleState"];

export type LifecycleEvent =
  | "DISCOVERY_ACCEPTED"
  | "USER_SAVED"
  | "USER_PURSUING"
  | "APPLICATION_CONFIRMED"
  | "USER_WON"
  | "USER_LOST"
  | "USER_PASSED"
  | "SOURCE_EXPIRED"
  | "USER_REOPENED";

export interface LifecycleTransition {
  from: LifecycleState;
  event: LifecycleEvent;
  to: LifecycleState;
}

const transitions: readonly LifecycleTransition[] = [
  { from: "DISCOVERED", event: "USER_SAVED", to: "SAVED" },
  { from: "DISCOVERED", event: "USER_PURSUING", to: "PURSUING" },
  { from: "DISCOVERED", event: "USER_PASSED", to: "PASSED" },
  { from: "DISCOVERED", event: "SOURCE_EXPIRED", to: "EXPIRED" },
  { from: "SAVED", event: "USER_PURSUING", to: "PURSUING" },
  { from: "SAVED", event: "USER_PASSED", to: "PASSED" },
  { from: "SAVED", event: "SOURCE_EXPIRED", to: "EXPIRED" },
  { from: "PURSUING", event: "APPLICATION_CONFIRMED", to: "APPLIED" },
  { from: "PURSUING", event: "USER_PASSED", to: "PASSED" },
  { from: "PURSUING", event: "SOURCE_EXPIRED", to: "EXPIRED" },
  { from: "APPLIED", event: "USER_WON", to: "WON" },
  { from: "APPLIED", event: "USER_LOST", to: "LOST" },
  { from: "APPLIED", event: "SOURCE_EXPIRED", to: "EXPIRED" },
  { from: "PASSED", event: "USER_REOPENED", to: "DISCOVERED" },
  { from: "EXPIRED", event: "USER_REOPENED", to: "DISCOVERED" },
  { from: "LOST", event: "USER_REOPENED", to: "DISCOVERED" },
];

export type TransitionResult =
  | { accepted: true; transition: LifecycleTransition }
  | { accepted: false; reason: "INVALID_TRANSITION" | "UNCONFIRMED_EXTERNAL_OUTCOME" };

export function requestLifecycleTransition(
  current: LifecycleState,
  event: LifecycleEvent,
  externalOutcomeConfirmed = false,
): TransitionResult {
  if (
    (event === "APPLICATION_CONFIRMED" || event === "USER_WON" || event === "USER_LOST") &&
    !externalOutcomeConfirmed
  ) {
    return { accepted: false, reason: "UNCONFIRMED_EXTERNAL_OUTCOME" };
  }

  const transition = transitions.find((item) => item.from === current && item.event === event);
  if (!transition) return { accepted: false, reason: "INVALID_TRANSITION" };
  return { accepted: true, transition };
}

/** Exposed for contract tests and documentation; callers must not mutate it. */
export function allowedLifecycleTransitions(): readonly LifecycleTransition[] {
  return transitions;
}
