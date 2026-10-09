# Stage 5 — Evidence & Provenance Architecture

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Creator attribution:** by Terrence  
**Brand mark:** The Exploded T  
**Repository:** THE-CLIENT-OPPORTUNITY-MATCHER  
**Branch:** main  
**Status:** STAGE 5 — COMPLETED (ARCHITECTURE CONSOLIDATED)

---

## 1. Purpose

Stage 5 defines how the system represents, evaluates, traces, and communicates support for material claims about discovered opportunities.

The core responsibility is:

**Turn discovered observations into traceable claims and evidence without pretending that a source, observation, or inference is automatically truth.**

Stage 5 establishes the evidence and provenance architecture between Stage 4 discovery and Stage 6 canonical normalization. It supplies traceable claims, evidence, knowledge states, freshness, conflicts, and lineage to downstream stages. It does not own canonical normalization, eligibility, semantic matching, scoring, ranking, opportunity-quality assessment, recommendation, or user decision.

It defines:

- claim architecture
- evidence architecture
- source to evidence relationships
- evidence provenance
- evidence quality assessment
- knowledge state handling
- freshness at the evidence level
- conflict preservation
- uncertainty representation
- evidence lineage
- corroboration
- evidence traceability

Stage 5 does not implement provider retrieval, canonical opportunity normalization, hard eligibility, semantic matching, scoring, ranking, opportunity quality, or recommendation logic.

---

## 2. Locked architecture decisions

### Decision 1 — Evidence architecture

**D: Hybrid Claim ↔ Evidence ↔ Source model**

The architecture preserves three distinct concepts:

**Claim** = what the system asserts or communicates.

**Evidence** = captured support for a claim.

**Source** = where the evidence originated.

A claim may have zero, one, or multiple evidence records.

An evidence record must identify its source and capture context.

A source may provide evidence for many claims and many opportunities.

The core relationship is:

**Claim ← supported by → Evidence ← originates from → Source**

This preserves the Stage 3 distinction:

**Source ≠ Evidence ≠ Claim**

It also allows one source to support multiple independent claims without forcing all source content to become one undifferentiated fact.

---

### Decision 2 — Evidence quality

**D: Structured evidence assessment**

Evidence quality is represented through explicit dimensions rather than a single unexplained label.

Relevant dimensions may include:

- source authority
- directness
- specificity
- recency
- completeness
- consistency
- corroboration
- accessibility
- capture integrity

Not every dimension will be available for every evidence record.

Unknown quality information must remain unknown.

The architecture must not create false precision merely because a numerical score could be calculated.

If later implementation uses a derived evidence quality value, that value must remain explainable through the underlying dimensions.

Stage 5 defines the assessment structure. It does not define downstream Match, Opportunity Quality, or Recommendation scores.

---

### Decision 3 — Conflict handling

**D: Preserve all evidence + explicitly represent conflict + maintain claim state**

Conflicting evidence must never be silently discarded.

For example:

- Source A states a budget of $1,000.
- Source B states a budget of $1,500.
- The related budget claim becomes **Conflicting** until later evidence resolves or materially changes the state.

The architecture preserves:

- each source
- each evidence record
- each claim
- the relationship between them
- capture times
- evidence assessments
- the resulting knowledge state

Stage 5 does not choose a winner merely because one source appears convenient.

Later validation may determine whether one observation is more current, direct, authoritative, or otherwise suitable, but the underlying conflict remains traceable.

---

### Decision 4 — Knowledge state

**C: Verified / Supported / Inferred / Unknown / Conflicting / Stale**

Stage 5 uses the authoritative Stage 3 knowledge states:

- **Verified**
- **Supported**
- **Inferred**
- **Unknown**
- **Conflicting**
- **Stale**

The state describes the system's current knowledge about a claim or material fact.

It is not a synonym for Match strength, Opportunity Quality, or recommendation.

The system must never silently convert:

- Unknown → Verified
- Inferred → Verified
- Conflicting → Verified
- Stale → Current

without new supporting reasoning and evidence.

---

### Decision 5 — Provenance

**C: Full evidence lineage**

Evidence must remain traceable through the chain:

**Claim → Evidence → Source → Discovery Event → Hunt**

Where available, provenance should preserve:

- source identity
- source reference or URL
- source native record identity
- capture timestamp
- source supplied timestamp
- discovery event
- Hunt
- query or discovery attempt
- evidence location or excerpt reference
- retrieval context
- evidence state
- evidence quality assessment
- related candidate or canonical opportunity reference
- transformation history where material

Provenance is not merely a URL field.

It is the context required to understand where a claim came from, when it was observed, and how it entered the system.

---

## 3. Evidence responsibility boundary

Stage 5 establishes the evidence and provenance layer between discovery observations and downstream eligibility, fit evaluation, and decision intelligence.

The conceptual flow is:

**Hunt**
→ **Source**
→ **Discovery Event**
→ **Candidate Observation**
→ **Evidence**
→ **Claim**
→ **Knowledge State / Evidence Assessment**
→ **Stage 6 Normalization & Canonicalization**
→ **Stage 7 Eligibility & Constraint Evaluation**
→ **Stage 8 Semantic Matching & Fit Evaluation**
→ downstream scoring, ranking, intelligence, recommendation, and user decision stages.

Stage 5 defines evidence architecture.

It does not decide whether an opportunity is a good match or a worthwhile opportunity.

---

## 4. Claim architecture

A Claim represents a material statement the system may rely on or communicate.

Examples include:

- the opportunity requests a website redesign
- the stated budget is $2,000
- the client is a particular organization
- the work is remote
- a deadline is stated
- a particular skill is requested
- the opportunity is still active according to a source observation

A claim should be capable of identifying:

- claim identifier
- related opportunity or candidate
- claim type
- subject
- predicate or asserted property
- value
- unit where applicable
- source-independent normalized meaning where possible
- knowledge state
- supporting evidence references
- conflicting evidence references
- claim creation or observation time
- last evaluated time
- provenance

A claim is an assertion.

It is not automatically true because it exists.

---

## 5. Evidence architecture

Evidence represents captured support for a claim.

Evidence should preserve enough information to allow later review of what was actually observed.

An evidence record should be capable of containing:

- evidence identifier
- related claim
- source
- source native record identity
- captured content or relevant excerpt reference
- evidence location
- capture timestamp
- source supplied timestamp where available
- retrieval context
- discovery event
- evidence quality assessment
- evidence state
- corroboration relationships
- conflict relationships
- integrity or transformation metadata where applicable

Evidence should be as close as practical to the source observation.

The system should distinguish:

**What the source said**

from:

**What the system concluded from what the source said.**

---

## 6. Source relationship

A Source identifies the origin of information.

Stage 4 defines source discovery architecture.

Stage 5 defines how source observations become evidence.

A Source may provide:

- many evidence records
- evidence for multiple claims
- evidence for multiple opportunities
- conflicting observations across time

The same source identity must not automatically imply identical evidence quality for every claim.

Quality is assessed in context.

For example, a source may be highly authoritative for one attribute and incomplete for another.

---

## 7. Evidence provenance contract

The minimum useful provenance chain is:

**Hunt → Discovery Event → Source → Evidence → Claim**

Where canonicalization later creates a normalized opportunity, the lineage must remain recoverable:

**Hunt → Discovery Event → Source Observation → Evidence → Claim → Canonical Opportunity**

Provenance should support questions such as:

- Where did this fact come from?
- When was it observed?
- Which source supplied it?
- Which discovery attempt found it?
- What exactly supports the claim?
- Was the claim directly stated or inferred?
- Is there conflicting evidence?
- Is the evidence stale?
- Was the evidence transformed during normalization?
- Can the original observation still be traced?

If the system cannot answer these questions for a material claim, provenance is incomplete.

---

## 8. Evidence quality dimensions

Stage 5 defines the following quality dimensions as available assessment properties.

### Authority

How authoritative is the source for the specific information being evaluated?

### Directness

Does the evidence directly state the claim, or does the claim require interpretation?

### Specificity

How specifically does the evidence support the exact claim?

### Recency

How recent is the evidence relative to the claim and intended use?

### Completeness

Does the evidence provide enough context to avoid misleading interpretation?

### Consistency

Does the evidence agree with other relevant observations?

### Corroboration

Is the claim independently supported by additional evidence?

### Accessibility

Can the evidence be reliably revisited or inspected when needed?

### Capture integrity

Was the evidence captured without material loss, corruption, or unexplained transformation?

Not every dimension must be known.

The architecture must permit:

**known → assessed**

and:

**unknown → explicitly unknown**

rather than forcing unsupported values.

---

## 9. Knowledge state architecture

### Verified

Evidence sufficiently establishes the claim for its intended system use.

Verified does not mean permanently true.

A verified claim can later become stale or conflicting when new evidence arrives.

### Supported

Evidence meaningfully supports the claim, but the available support does not justify treating it as fully verified.

### Inferred

The system derived the claim from available evidence rather than receiving it directly.

Inferences must remain explicitly labeled.

### Unknown

The required information cannot currently be established.

Unknown is not negative.

Unknown must not be used as an implicit failure unless a later stage explicitly defines that behavior.

### Conflicting

Relevant evidence materially disagrees.

Conflicting claims retain the competing evidence.

### Stale

The evidence or claim may have been valid previously but is no longer sufficiently current for confident use.

Stale does not mean false.

A stale claim may become current again if fresh supporting evidence is obtained.

---

## 10. Direct statements versus inference

The system must distinguish at least three situations:

### Direct evidence

The source explicitly states the relevant information.

### Supported interpretation

The evidence strongly supports the claim but requires limited interpretation or normalization.

### Inference

The system derives a conclusion that the source did not directly state.

Inference must never be presented as though the source explicitly said it.

For example:

Source states:

“Looking for someone to redesign our ecommerce website.”

The system may infer that website redesign capability is relevant.

It must not claim:

“The client requires Shopify expertise”

unless the source actually states it or sufficient evidence supports that specific claim.

---

## 11. Corroboration architecture

Multiple independent evidence records may support the same claim.

The architecture should preserve:

- evidence count
- independent source count
- corroboration relationships
- agreement or disagreement
- source independence where knowable
- capture times

Corroboration can strengthen a claim, but repeated copies of the same underlying information must not be treated as independent confirmation merely because they appear on different pages.

Duplicate source observations should remain distinguishable from genuinely independent corroboration.

---

## 12. Conflict architecture

Conflicts must be explicit.

Examples:

### Budget conflict

Source A: $1,000  
Source B: $1,500

### Timeline conflict

One source says deadline is June 10.  
Another says June 20.

### Status conflict

One observation suggests active.  
Another suggests closed.

### Client identity conflict

Different observations associate the opportunity with different client identities.

When conflicts exist:

1. Preserve all relevant evidence.
2. Preserve source provenance.
3. Mark the affected claim as **Conflicting** where appropriate.
4. Do not silently select a winner.
5. Allow later validation to assess currentness, authority, directness, and other relevant factors.
6. Keep the original evidence lineage intact.

---

## 13. Freshness at evidence level

Stage 4 establishes discovery freshness.

Stage 5 adds evidence-level freshness context.

The architecture must distinguish:

**When the system discovered the information**

from:

**When the source says the information was published or updated**

and:

**When the evidence was captured.**

These may all be different.

Evidence freshness should therefore preserve, where available:

- source published time
- source updated time
- discovery time
- capture time
- freshness assessment
- freshness unknown state

A recently captured old page is not necessarily fresh information.

---

## 14. Evidence transformation and normalization boundary

Evidence should preserve the source observation before later canonical normalization changes its representation.

For example:

Source observation:

“Budget: $1,000–$2,000 USD”

Later normalized Budget object:

**amount range = 1000–2000**  
**currency = USD**

The normalized value must remain traceable back to the original evidence.

Stage 5 owns the provenance requirement.

Stage 6 owns canonical normalization and transformation rules.

Neither stage may erase the distinction between source observation and normalized interpretation.

---

## 15. Evidence gaps

The system must explicitly support evidence gaps.

Examples:

- budget not stated
- client identity unclear
- deadline unavailable
- source content inaccessible
- location ambiguous
- required skill unclear
- opportunity status uncertain

An evidence gap should be represented as missing knowledge, not fabricated information.

Evidence gaps may later contribute to:

- verification requirements
- readiness assessment
- risk assessment
- explanation
- next action

Those downstream decisions belong to later stages.

---

## 16. Evidence traceability

Every material claim should support this trace:

**Claim**
→ **Evidence**
→ **Source**
→ **Discovery Event**
→ **Hunt**

Where applicable:

**Claim**
→ **Conflicting Evidence**
→ **Multiple Sources**

and:

**Claim**
→ **Normalized Field**
→ **Canonical Opportunity**

The trace should allow the system to explain:

- what it knows
- why it knows it
- how current that knowledge is
- where uncertainty remains
- whether evidence conflicts
- whether information was directly stated or inferred

---

## 17. Evidence lifecycle

A material claim may move through states as new evidence arrives.

Example:

**Unknown**
→ evidence captured
→ **Supported**
→ stronger direct evidence
→ **Verified**
→ later contradictory observation
→ **Conflicting**
→ conflict resolved by stronger/current evidence
→ appropriate updated state

Another path:

**Verified**
→ information ages
→ **Stale**
→ fresh evidence captured
→ **Supported** or **Verified**

State changes must be explainable through evidence and provenance.

---

## 18. Stage boundaries

### Stage 5 owns

- claim architecture
- evidence architecture
- source to evidence relationships
- provenance architecture
- evidence quality dimensions
- knowledge states
- direct versus inferred information
- corroboration representation
- conflict preservation
- evidence freshness
- evidence gaps
- evidence lineage
- evidence lifecycle

### Stage 5 does not own

- source discovery strategy
- query construction
- provider implementation
- live search execution
- canonical opportunity normalization algorithms
- hard eligibility
- semantic matching
- capability matching
- scoring
- ranking
- recommendation
- opportunity quality scoring
- production frontend
- final observability implementation
- final security architecture

Those responsibilities remain with the appropriate later stages.

---

## 19. Downstream contracts

### Stage 6 — Opportunity Normalization & Canonicalization

Consumes evidence backed observations and converts provider-specific representations into canonical domain objects while preserving provenance.

### Stage 7 — Eligibility & Constraint Evaluation Architecture

Consumes evidence-backed canonical facts and their knowledge states to evaluate constraints without upgrading evidence certainty.

### Stage 8 — Semantic Matching & Fit Evaluation

Uses evidence-backed opportunity requirements and user capability information to evaluate semantic fit after eligibility.

### Stage 9 — Match Scoring & Fit Evaluation

Uses evidence-backed inputs to produce a transparent multidimensional fit assessment.

### Stage 10 — Ranking & Prioritization

Uses fit signals and explicit policy to prioritize opportunities without redefining evidence quality.

### Stage 11 — Opportunity Intelligence & Explanation

Uses claims, evidence, provenance, knowledge states, gaps, conflicts, and freshness to explain findings and limitations.

### Stage 12 — Recommendation & Decision Support

Uses evidence-backed intelligence to support recommendations while preserving uncertainty and user authority.

### Stage 14 — Feedback & Learning

May consume explicit user feedback as a learning signal but must not rewrite source evidence or claim truth.

### Stage 16 — Failure, Degradation & Recovery

Uses evidence completeness, source failures, and uncertainty metadata to represent partial or degraded intelligence honestly.

### Stage 19 — Integration & Production Architecture

Connects the evidence and provenance contracts to live discovery providers and the production execution chain.

---

## 20. Stage 4 traceability

Stage 5 must preserve the Stage 4 contracts:

- Discovery finds candidates; it does not prove truth.
- Source capability remains distinct from evidence quality.
- Discovery traceability remains intact.
- Source conflicts are preserved.
- Freshness observations remain available.
- Duplicate relationships remain available.
- Partial and degraded discovery remain distinguishable from no useful candidates.
- Discovery budget and query history remain traceable.
- Candidate source observations must remain connected to their discovery events.

The evidence architecture adds a new layer:

**Discovery observation → Evidence → Claim**

without replacing the Stage 4 discovery architecture.

---

## 21. Stage 3 traceability

Stage 5 preserves all foundational Stage 3 distinctions:

**User Profile ≠ Hunt**

**User Constraint ≠ Opportunity Requirement**

**Hard Requirement ≠ Preference**

**Source ≠ Evidence**

**Evidence ≠ Claim**

**Eligibility ≠ Match**

**Match ≠ Ranking**

**Match ≠ Opportunity Quality**

**Opportunity Quality ≠ Recommendation**

**Recommendation ≠ User Decision**

**Unknown ≠ Negative**

**Inferred ≠ Verified**

**Stale ≠ Current**

**Conflict ≠ Certainty**

The authoritative knowledge states remain:

**Verified / Supported / Inferred / Unknown / Conflicting / Stale**

---

## 22. Acceptance criteria

Stage 5 can only PASS when:

- Claim, Evidence, and Source remain distinct.
- Evidence can support one or more claims.
- Claims can have multiple supporting evidence records.
- Source provenance is preserved.
- Evidence capture context is preserved.
- Evidence quality is structured rather than reduced to an unexplained binary.
- Quality dimensions can remain unknown where appropriate.
- Direct evidence is distinguishable from inference.
- Conflicting evidence is preserved.
- Conflicting claims are explicitly represented.
- Unknown information remains unknown.
- Inferred information remains explicitly inferred.
- Stale information remains distinguishable from current information.
- Corroboration is distinguishable from duplicated information.
- Evidence freshness distinguishes capture time from source supplied timing.
- Normalized information remains traceable to source evidence.
- Evidence gaps are represented without fabrication.
- The complete provenance chain is recoverable.
- Stage 4 discovery architecture remains intact.
- Stage 6 and later responsibilities are not prematurely implemented.
- The architecture supports evidence-backed eligibility evaluation, downstream fit assessment, and decision-ready intelligence without treating evidence quality as a single readiness Boolean.
- The architecture supports transparent explanations without creating false certainty.

---

## 23. Handoff navigation

**Previous stage:**  
[Stage 4 — Opportunity Source & Discovery Architecture](./stage-04-opportunity-source-and-discovery-architecture.md)

**Next stage:**  
[Stage 6 — Opportunity Normalization & Canonicalization](./stage-06-opportunity-normalization-and-canonicalization.md)

---

## 24. Execution gate

After Stage 5 architecture is accepted, implementation follows the permanent project cycle:

**Inspect → Analyze → Build → Test → Review → Commit → Push → Handoff**

Stage 6 must not begin until Stage 5 passes its acceptance gate.

---

## 25. Implementation and review record

### Architecture decisions

**D / D / D / C / C**

### Implementation scope

Stage 5 implementation is the authoritative Evidence & Provenance Architecture specification. No live provider, normalization, matching, scoring, ranking, recommendation, or production UI implementation was introduced.

### Verification completed

- Stage 3 Claim → Evidence → Source contract was preserved.
- Stage 4 discovery observations and provenance requirements were preserved.
- Evidence quality was expanded into structured dimensions.
- Knowledge states remain authoritative.
- Conflicts remain explicit and traceable.
- Direct evidence and inference remain distinct.
- Evidence freshness distinguishes capture time from source timing.
- Evidence gaps remain explicit.
- Canonical normalization remains a later-stage responsibility.
- Later matching, ranking, quality, and recommendation responsibilities remain outside Stage 5.
- The specification was reviewed against the locked Stage 3 and Stage 4 contracts.

### Review result

**PASS — Stage 5 is internally consistent with the locked Stage 1, Stage 2, Stage 3, and Stage 4 contracts and is ready to hand off to Stage 6.**

### Status

**Architecture decisions locked: D / D / D / C / C**

**STAGE 5 — COMPLETED**


---

## Stage 5 completion and consolidation record

- This document is the authoritative consolidated Stage 5 specification, including its decisions, boundaries, edge cases, and downstream contract.
- Necessary requirements formerly held in a separate handoff are retained in this stage's authoritative contract; redundant stage-specific documents are excluded from the consolidated history.
- This completion records architecture consolidation, not a claim that application code or runtime tests have been implemented for this stage.


---

## Stage 5 → Stage 6 operational handoff contract (consolidated)

- **Consumes:** Stage 4 discovery observations, source references, source limitations, and discovery traceability.
- **Creates:** The Claim ↔ Evidence ↔ Source model, evidence quality semantics, conflict handling, explicit knowledge states, and provenance/lineage contract.
- **Guarantees:** Evidence is not equated with truth; inference remains distinct from observation; freshness and conflicts remain visible; transformation does not become evidence; provenance remains traceable. Stage 5 does not own canonical normalization, eligibility, semantic matching, scoring, ranking, recommendation, or user decision.
- **Stage 6 receives:** Evidence-backed source observations, claims, source-native values, knowledge states, freshness, uncertainty/conflicts, provenance references, and lineage necessary for canonical mapping and normalization.
- **Locked answers:** **D / D / D / C / C**.
- **Status:** Stage 5 PASS / LOCKED. This is the completed historical transition; it does not instruct Stage 6 to restart.
