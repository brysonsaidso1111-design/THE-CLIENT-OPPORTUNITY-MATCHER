# Stage 6 — Opportunity Normalization & Canonicalization

**Project:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Stage:** 6  
**Previous stage:** Stage 5 — Evidence & Provenance Architecture  
**Next stage:** Stage 7 — Eligibility & Constraint Evaluation Architecture  
**Status:** STAGE 6 — COMPLETED (ARCHITECTURE CONSOLIDATED; IMPLEMENTATION NOT CLAIMED)
---

## 1. Responsibility

Stage 6 converts structurally different opportunity data from different sources into a consistent canonical opportunity representation while preserving source-native information, uncertainty, conflicts, and transformation lineage.

Stage 6 owns:

- canonical opportunity representation
- provider-to-canonical field mapping
- structural and controlled semantic normalization
- cross-source identity inputs and deduplication relationships
- missing, ambiguous, and conflicting field handling
- canonical identity construction
- transformation lineage
- preservation of source-native values
- explicit distinction between canonical representation and validation

Stage 6 does not own:

- source discovery strategy
- query construction
- provider retrieval
- evidence truth validation
- hard eligibility
- semantic or capability matching
- scoring
- ranking
- recommendation
- opportunity quality assessment
- user decision
- production frontend
- later decision intelligence

---

## 2. Core architectural principles

### 2.1 Canonical ≠ Verified

A canonical opportunity may contain fields whose knowledge states remain Verified, Supported, Inferred, Unknown, Conflicting, or Stale.

Canonicalization does not establish truth.

### 2.2 Normalized ≠ Validated

A normalized value is a standardized representation of source information. Validation is a separate downstream responsibility.

### 2.3 Source data ≠ canonical data

Source-native values remain recoverable. Canonicalization must not destroy the original representation.

### 2.4 Transformation ≠ evidence

A transformation explains how a representation changed. It does not become evidence merely because the system performed the transformation.

### 2.5 Deduplication ≠ truth resolution

Determining that two observations may refer to the same opportunity does not determine which observation is true.

### 2.6 Unknown remains unknown

The system must never manufacture a canonical value simply because a schema contains a field.

### 2.7 Human complexity stays inside the system

The internal architecture may be sophisticated, but the human-facing opportunity representation should remain coherent, readable, and decision-oriented.

---

## 3. Locked architecture decisions

### Decision 1 — Canonical Opportunity Model

**D — Hybrid Canonical Model**

The system uses a coherent canonical opportunity entity with structured attribute groups and explicit relationships to source observations and provenance where required.

The user experiences one understandable opportunity rather than a fragmented internal data model.

The model must support:

- identity
- organization
- title and description
- opportunity type/category
- location
- timing/deadlines
- funding/budget
- requirements
- application information
- status
- source relationships
- evidence/knowledge state references
- uncertainty
- transformation lineage

Complex observation and provenance structures remain internal rather than being imposed on the user.

---

### Decision 2 — Cross-Source Identity & Deduplication

**D — Hybrid Identity & Deduplication**

Identity resolution proceeds from strongest available signals to weaker signals:

1. deterministic external/provider identifiers where available
2. composite identity signals where appropriate
3. similarity/probabilistic reasoning only where ambiguity requires it
4. explicit uncertainty when identity cannot be established safely

Useful identity signals may include:

- provider identifier
- canonicalized URL
- organization
- normalized title
- deadline
- location
- opportunity type
- other stable source-native identifiers

The system must distinguish:

**same opportunity**  
from  
**similar opportunity**  
from  
**insufficient evidence to determine identity**

False merges are more damaging than unresolved duplicates, so ambiguity must not be silently collapsed.

---

### Decision 3 — Normalization Semantics

**D — Layered Hybrid Normalization**

Normalization occurs in layers:

**Layer 1 — Structural normalization**

Standardize representation and format.

Examples:

- date formats
- whitespace
- casing where safe
- currency formatting
- units
- structured URLs

**Layer 2 — Controlled semantic normalization**

Map genuinely equivalent provider concepts into canonical concepts using explicit, reviewable mappings.

Examples:

- application deadline → deadline
- closing date → deadline
- grant → controlled opportunity type where the mapping is justified

**Layer 3 — Source-native preservation**

Retain the original source representation and its provenance.

Semantic normalization must not invent meaning or silently convert inference into fact.

---

### Decision 4 — Missing, Ambiguous & Conflicting Fields

**D — Contextual Hybrid Handling**

The system selects handling according to the information state:

- clearly equivalent values may be safely resolved
- missing values remain Unknown
- ambiguous values remain explicitly ambiguous
- genuine conflicts preserve multiple observations/values
- stale information remains distinguishable from current information
- source-specific values remain traceable

Examples:

**Missing:**  
No deadline found → deadline remains Unknown.

**Ambiguous:**  
“Deadline: October 31” with no year → unresolved ambiguity is preserved.

**Conflict:**  
Source A reports $10,000 and Source B reports $15,000 → both observations remain available; canonical representation does not silently choose one as truth.

Canonicalization may expose a preferred representation for usability only when the underlying transformation is justified and its uncertainty/provenance remains available.

---

### Decision 5 — Provenance Through Transformation

**D — Full Lineage + Transformation Semantics**

Every material canonical transformation must be traceable through:

**Source → Discovery Observation → Evidence → Source-Native Value → Transformation → Canonical Value**

Where applicable, lineage must also preserve:

- transformation type
- transformation inputs
- transformation output
- transformation rationale/rule
- transformation timestamp/version
- source reference
- evidence reference
- knowledge state
- uncertainty/conflict relationship

This allows the system to answer:

- where a canonical value came from
- what the source originally said
- what transformation occurred
- why the transformation was applied
- what uncertainty remains
- whether the value is merely normalized or also validated

---

## 4. Canonicalization pipeline

The authoritative Stage 6 conceptual flow is:

**Discovery Observation → Evidence → Source-Native Representation → Canonical Mapping → Normalization → Identity Resolution → Canonical Opportunity**

with provenance and uncertainty preserved throughout.

Canonicalization must not replace the Stage 5 evidence chain.

---

## 5. Canonical opportunity structure

The canonical opportunity should present a stable internal contract organized around meaningful attribute groups rather than provider-specific schemas.

Recommended conceptual groups:

- **Identity**
- **Core Description**
- **Organization**
- **Opportunity Classification**
- **Location**
- **Timing**
- **Funding / Budget**
- **Requirements**
- **Application**
- **Status**
- **Canonical Relationships**
- **Knowledge / Uncertainty References**
- **Provenance / Transformation References**

The canonical structure is an internal system contract. Human-facing presentation may expose only the fields necessary for the user's current decision.

---

## 6. Identity model

Canonical identity must be composed from available identity signals rather than assuming one universal identifier exists.

The system should preserve:

- provider-native identifiers
- source URLs
- canonical URL representations where safely derived
- organization identity signals
- normalized title signals
- relevant temporal signals
- other stable identity attributes

Identity resolution outcomes must be distinguishable:

- **Confirmed same opportunity**
- **Probable same opportunity**
- **Possible relationship**
- **Distinct opportunities**
- **Unresolved**

Identity confidence must never be treated as truth validation.

---

## 7. Normalization rules

Normalization rules must be:

- deterministic where possible
- explicit
- testable
- reversible or traceable where practical
- versionable
- domain-scoped
- conservative when semantic equivalence is uncertain

Examples of safe normalization:

- date representation
- whitespace normalization
- known currency-code normalization
- known unit normalization
- controlled category mappings
- provider field aliases with established equivalence

Examples requiring caution:

- interpreting vague dates
- inferring eligibility
- resolving conflicting amounts
- inferring organization identity from weak signals
- turning descriptions into requirements
- inferring opportunity status

Those actions belong to validation or later intelligence unless explicitly supported by the Stage 6 contract.

---

## 8. Uncertainty contract

Stage 6 preserves Stage 5 knowledge states:

**Verified / Supported / Inferred / Unknown / Conflicting / Stale**

Canonical fields may therefore have:

- a canonical representation
- one or more source observations
- a knowledge state
- uncertainty metadata
- provenance references

The canonical representation must never erase the state of knowledge attached to the underlying information.

---

## 9. Conflict contract

When source observations disagree:

**Do not silently overwrite.**

Instead preserve:

**Canonical Field → Competing Observations → Sources → Evidence → Knowledge States**

A downstream stage may later resolve, qualify, or explain the conflict.

Stage 6 may identify that two values conflict; it does not decide truth merely by normalization.

---

## 10. Human experience contract

The internal architecture must optimize for human cognitive simplicity.

Users should encounter:

- one coherent opportunity
- clear canonical fields
- understandable uncertainty indicators
- concise explanations where needed
- source traceability when useful
- no unnecessary exposure to internal data structures

The desired experience is:

**System complexity → Human clarity**

rather than:

**System complexity → User complexity**

---

## 11. Stage boundaries

### Stage 5 provides

- claims
- evidence
- sources
- knowledge states
- provenance
- conflicts
- freshness
- evidence gaps
- discovery traceability

### Stage 6 consumes

those evidence-backed observations and converts their representations into canonical opportunity structures.

### Stage 6 provides downstream

- canonical opportunity representation
- canonical fields
- identity relationships
- normalization metadata
- source-native references
- transformation lineage
- uncertainty preservation
- conflict preservation

Stage 7 consumes these canonical objects for eligibility and constraint evaluation. Later stages may then use the resulting eligibility contract for semantic matching, ranking, explanation, and intelligence.

---

## 12. Stage 6 acceptance criteria

Stage 6 can PASS only when:

- canonical opportunity representation is defined
- source-native representations remain recoverable
- provider-specific mappings are explicit
- structural normalization is deterministic where possible
- semantic normalization is controlled
- identity resolution distinguishes certainty from ambiguity
- duplicate relationships do not become truth claims
- missing values remain unknown
- ambiguous values remain ambiguous
- conflicting values remain traceable
- stale values remain distinguishable
- knowledge states remain intact
- canonicalization does not perform evidence validation
- canonicalization does not perform eligibility or matching
- transformation lineage is recoverable
- transformation semantics are explicit
- Stage 5 provenance is preserved
- human-facing complexity is minimized
- the architecture is internally consistent with Stages 1–5
- no later-stage responsibility is prematurely implemented

---

## 13. Architecture decision record

**Q1 — Canonical Opportunity Model:** D — Hybrid Canonical Model

**Q2 — Cross-Source Identity & Deduplication:** D — Hybrid Identity & Deduplication

**Q3 — Normalization Semantics:** D — Layered Hybrid Normalization

**Q4 — Missing, Ambiguous & Conflicting Fields:** D — Contextual Hybrid Handling

**Q5 — Provenance Through Transformation:** D — Full Lineage + Transformation Semantics

### Final decision set

**D / D / D / D / D**

---

## 14. Verification against prior stages

### Stage 1
Preserves the distinction between opportunity, match, evidence, ranking, recommendation, and user decision.

### Stage 2
Supports a coherent opportunity experience without exposing internal normalization complexity unnecessarily.

### Stage 3
Preserves:

- Source ≠ Evidence
- Evidence ≠ Claim
- Unknown ≠ Negative
- Inferred ≠ Verified
- Stale ≠ Current
- Conflict ≠ Certainty
- Match ≠ Ranking
- Opportunity Quality ≠ Recommendation

### Stage 4
Preserves:

- discovery observation ≠ truth
- source capability ≠ evidence quality
- duplicate relationship ≠ corroboration
- partial/degraded discovery ≠ no useful candidates

### Stage 5
Preserves:

- Claim → Evidence → Source
- evidence quality
- knowledge states
- conflicts
- freshness
- evidence gaps
- full provenance

### Result

**PASS — The Stage 6 architecture is internally consistent with the locked Stage 1–5 contracts.**

---

## 15. Execution gate

Implementation follows the permanent project cycle:

**Inspect → Analyze → Build → Test → Review → Commit → Push → Handoff**

The Stage 6 architecture is now locked. Implementation must remain inside the Stage 6 responsibility boundary.

---

## 16. Status

**STAGE 6 — ARCHITECTURE LOCKED**

**Decision set: D / D / D / D / D**

**Canonical ≠ Verified**

**Normalized ≠ Validated**

**Human complexity stays inside the system; human experience remains clear.**


---

## Stage 6 completion and consolidation record

- This document is the authoritative consolidated Stage 6 specification, including its decisions, boundaries, edge cases, and downstream contract.
- Necessary requirements formerly held in a separate handoff are retained in this stage's authoritative contract; redundant stage-specific documents are excluded from the consolidated history.
- This completion records architecture consolidation, not a claim that application code or runtime tests have been implemented for this stage.


---

## Stage 6 → Stage 7 operational handoff contract (consolidated)

- **Consumes:** Stage 5's evidence/provenance contract and evidence-backed source observations.
- **Creates:** The canonical opportunity model, cross-source identity/deduplication relationships, layered normalization, explicit missing/ambiguous/conflicting-field treatment, and transformation lineage.
- **Guarantees:** Canonical does not mean verified; normalized does not mean validated; deduplication does not mean corroboration or truth resolution; source-native values and transformation lineage remain recoverable; uncertainty is not silently removed.
- **Stage 7 receives:** Canonical opportunity records with normalized attributes, identity relationships, source-native references, evidence/provenance links, knowledge states, freshness, conflicts, and transformation metadata.
- **Locked answers:** **D / D / D / D / D**.
- **Status:** Stage 6 PASS / LOCKED. This is the completed historical transition; it does not instruct Stage 7 to restart.
