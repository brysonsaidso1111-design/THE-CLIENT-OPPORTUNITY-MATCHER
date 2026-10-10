/**
 * Stage 3 and Stage 5 contracts: source, evidence, and claim are distinct.
 * Unknown and conflicting knowledge must remain explicit throughout assessment.
 */

export type KnowledgeState =
  | "VERIFIED"
  | "SUPPORTED"
  | "INFERRED"
  | "UNKNOWN"
  | "CONFLICTING"
  | "STALE";

export type SourceKind =
  | "MARKETPLACE"
  | "CLIENT_WEBSITE"
  | "PUBLIC_PROFILE"
  | "SEARCH_ENGINE"
  | "USER_PROVIDED"
  | "OTHER";

export interface SourceReference {
  id: string;
  kind: SourceKind;
  name: string;
  canonicalUrl?: string;
  publisher?: string;
}

export interface EvidenceRecord {
  id: string;
  sourceId: string;
  capturedAt: string;
  observedAt?: string;
  excerpt?: string;
  contentHash?: string;
  directness?: "DIRECT" | "INDIRECT" | "UNKNOWN";
  authority?: "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
  freshness: "CURRENT" | "STALE" | "UNKNOWN";
  limitations: readonly string[];
}

export interface ClaimRecord<T = unknown> {
  id: string;
  subjectId: string;
  predicate: string;
  value?: T;
  knowledgeState: KnowledgeState;
  evidenceIds: readonly string[];
  assessedAt: string;
  explanation?: string;
}

export interface EvidenceBundle {
  sources: readonly SourceReference[];
  evidence: readonly EvidenceRecord[];
  claims: readonly ClaimRecord[];
}

export type EvidenceValidationIssue =
  | { code: "DUPLICATE_SOURCE_ID"; id: string }
  | { code: "DUPLICATE_EVIDENCE_ID"; id: string }
  | { code: "DUPLICATE_CLAIM_ID"; id: string }
  | { code: "MISSING_EVIDENCE_SOURCE"; evidenceId: string; sourceId: string }
  | { code: "MISSING_CLAIM_EVIDENCE"; claimId: string; evidenceId: string }
  | { code: "UNSUPPORTED_CLAIM_WITHOUT_EVIDENCE"; claimId: string }
  | { code: "INVALID_TIMESTAMP"; recordId: string; field: string };

function isTimestamp(value: string): boolean {
  return value.trim() !== "" && !Number.isNaN(Date.parse(value));
}

function duplicateIds(ids: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return [...duplicates];
}

/** Validate referential integrity without inventing evidence or certainty. */
export function validateEvidenceBundle(bundle: EvidenceBundle): EvidenceValidationIssue[] {
  const issues: EvidenceValidationIssue[] = [];
  for (const id of duplicateIds(bundle.sources.map((x) => x.id))) {
    issues.push({ code: "DUPLICATE_SOURCE_ID", id });
  }
  for (const id of duplicateIds(bundle.evidence.map((x) => x.id))) {
    issues.push({ code: "DUPLICATE_EVIDENCE_ID", id });
  }
  for (const id of duplicateIds(bundle.claims.map((x) => x.id))) {
    issues.push({ code: "DUPLICATE_CLAIM_ID", id });
  }

  const sourceIds = new Set(bundle.sources.map((x) => x.id));
  const evidenceById = new Map(bundle.evidence.map((x) => [x.id, x]));
  const claimIds = new Set(bundle.claims.map((x) => x.id));
  void claimIds;

  for (const record of bundle.evidence) {
    if (!sourceIds.has(record.sourceId)) {
      issues.push({
        code: "MISSING_EVIDENCE_SOURCE",
        evidenceId: record.id,
        sourceId: record.sourceId,
      });
    }
    if (!isTimestamp(record.capturedAt)) {
      issues.push({ code: "INVALID_TIMESTAMP", recordId: record.id, field: "capturedAt" });
    }
    if (record.observedAt !== undefined && !isTimestamp(record.observedAt)) {
      issues.push({ code: "INVALID_TIMESTAMP", recordId: record.id, field: "observedAt" });
    }
  }

  for (const claim of bundle.claims) {
    if (!isTimestamp(claim.assessedAt)) {
      issues.push({ code: "INVALID_TIMESTAMP", recordId: claim.id, field: "assessedAt" });
    }
    if (
      (claim.knowledgeState === "VERIFIED" || claim.knowledgeState === "SUPPORTED") &&
      claim.evidenceIds.length === 0
    ) {
      issues.push({ code: "UNSUPPORTED_CLAIM_WITHOUT_EVIDENCE", claimId: claim.id });
    }
    for (const evidenceId of claim.evidenceIds) {
      if (!evidenceById.has(evidenceId)) {
        issues.push({ code: "MISSING_CLAIM_EVIDENCE", claimId: claim.id, evidenceId });
      }
    }
  }
  return issues;
}
