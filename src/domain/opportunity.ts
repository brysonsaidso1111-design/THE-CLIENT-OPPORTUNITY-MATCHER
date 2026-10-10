import type { ClaimRecord, EvidenceRecord, KnowledgeState, SourceReference } from "./evidence";

export type CurrencyCode = string & { readonly __brand: "CurrencyCode" };

export interface MoneyRange {
  minimum?: number;
  maximum?: number;
  currency: CurrencyCode;
  knowledgeState: KnowledgeState;
  sourceClaimIds: readonly string[];
}

export interface UserConstraint<T = unknown> {
  id: string;
  subject: string;
  mode: "HARD_REQUIREMENT" | "PREFERENCE";
  desiredValue: T;
  acceptableAlternatives?: readonly T[];
  importance?: "LOW" | "MEDIUM" | "HIGH";
  source: "USER_BRIEF" | "USER_PROFILE" | "USER_OVERRIDE";
}

export interface UserProfile {
  id: string;
  services: readonly string[];
  capabilities: readonly string[];
  experienceSummary?: string;
  targetClientTypes: readonly string[];
  constraints: readonly UserConstraint[];
  updatedAt: string;
}

export interface Hunt {
  id: string;
  userId: string;
  brief: string;
  constraints: readonly UserConstraint[];
  createdAt: string;
  status: "DRAFT" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
}

export interface CanonicalOpportunity {
  id: string;
  title: string;
  description?: string;
  clientName?: string;
  sourceIds: readonly string[];
  evidenceIds: readonly string[];
  claims: readonly ClaimRecord[];
  budget?: MoneyRange;
  location?: string;
  engagementType?: "PROJECT" | "ONGOING" | "CONTRACT" | "ONE_TIME" | "UNKNOWN";
  discoveredAt: string;
  lastVerifiedAt?: string;
  knowledgeState: KnowledgeState;
  lifecycleState:
    | "DISCOVERED"
    | "SAVED"
    | "PURSUING"
    | "APPLIED"
    | "WON"
    | "LOST"
    | "PASSED"
    | "EXPIRED"
    | "CLOSED";
  revision: number;
}

export interface DiscoveryObservation {
  providerId: string;
  retrievedAt: string;
  nativeRecordId?: string;
  canonicalUrl?: string;
  rawTitle: string;
  rawDescription?: string;
  rawClientName?: string;
  rawBudgetText?: string;
  source: SourceReference;
  evidence: readonly EvidenceRecord[];
}

export function normalizeCurrencyCode(value: string): CurrencyCode | null {
  const normalized = value.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? (normalized as CurrencyCode) : null;
}

export function isValidMoneyRange(range: MoneyRange): boolean {
  if (!Number.isFinite(range.minimum) && range.minimum !== undefined) return false;
  if (!Number.isFinite(range.maximum) && range.maximum !== undefined) return false;
  if (range.minimum !== undefined && range.minimum < 0) return false;
  if (range.maximum !== undefined && range.maximum < 0) return false;
  if (range.minimum !== undefined && range.maximum !== undefined && range.minimum > range.maximum) {
    return false;
  }
  return normalizeCurrencyCode(range.currency) !== null;
}
