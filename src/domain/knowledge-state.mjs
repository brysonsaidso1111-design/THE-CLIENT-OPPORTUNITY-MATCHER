/**
 * Stage 3 / Stage 5 knowledge-state vocabulary.
 * Pure domain helpers — no I/O.
 */

export const KNOWLEDGE_STATES = Object.freeze([
  "VERIFIED",
  "SUPPORTED",
  "INFERRED",
  "UNKNOWN",
  "CONFLICTING",
  "STALE",
  "UNSUPPORTED",
  "INCOMPLETE",
]);

/**
 * @param {string} state
 * @returns {boolean}
 */
export function isKnowledgeState(state) {
  return KNOWLEDGE_STATES.includes(state);
}

/**
 * Never upgrade weaker states to VERIFIED.
 * @param {string|null|undefined} state
 * @returns {string}
 */
export function normalizeKnowledgeState(state) {
  if (state == null || state === "") return "UNKNOWN";
  const upper = String(state).toUpperCase();
  if (!isKnowledgeState(upper)) {
    throw new TypeError(`Unsupported knowledge state: ${state}`);
  }
  return upper;
}

/**
 * Claim with required evidence linkage when presented as factual.
 * @param {{ id: string, text: string, knowledgeState?: string, evidenceIds?: string[], limitations?: string[] }} input
 */
export function createClaim(input) {
  if (!input || typeof input.id !== "string" || !input.id.trim()) {
    throw new TypeError("Claim requires a non-empty id");
  }
  if (typeof input.text !== "string" || !input.text.trim()) {
    throw new TypeError("Claim requires non-empty text");
  }
  const knowledgeState = normalizeKnowledgeState(input.knowledgeState ?? "UNKNOWN");
  const evidenceIds = Array.isArray(input.evidenceIds)
    ? Object.freeze(input.evidenceIds.filter((id) => typeof id === "string" && id.trim()).map((id) => id.trim()))
    : Object.freeze([]);

  if (["VERIFIED", "SUPPORTED"].includes(knowledgeState) && evidenceIds.length === 0) {
    throw new TypeError("Verified/supported claims require at least one evidence id");
  }

  const limitations = Array.isArray(input.limitations)
    ? Object.freeze(input.limitations.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim()))
    : Object.freeze([]);

  return Object.freeze({
    id: input.id.trim(),
    text: input.text.trim(),
    knowledgeState,
    evidenceIds,
    limitations,
  });
}
