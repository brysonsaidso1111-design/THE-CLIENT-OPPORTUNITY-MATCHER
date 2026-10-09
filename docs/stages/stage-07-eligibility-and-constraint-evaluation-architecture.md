# 🔴 Stage 7 — Eligibility & Constraint Evaluation Architecture

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Stage:** 7  
**Previous stage:** Stage 6 — Opportunity Normalization & Canonicalization  
**Next stage:** Stage 8 — Semantic Matching & Fit Evaluation  
**Status:** STAGE 7 — COMPLETED (ARCHITECTURE CONSOLIDATED; IMPLEMENTATION NOT CLAIMED)
**Architecture decisions:** D / D / D / D / D

---

## 1. 🔴 Critical Stage Responsibility

Stage 7 determines whether a canonical opportunity satisfies the user's **actual requirements** well enough to remain eligible for consideration.

Stage 7 owns:

- representation of evaluable user constraints
- evaluation of canonical opportunity requirements against user constraints
- hard-requirement gating
- explicit separation of hard requirements from preferences
- knowledge-state-aware evaluation
- missing, unknown, stale, and conflicting information handling
- constraint-level reasons
- structured eligibility results
- degraded/partial evaluation states
- provenance references needed to explain an eligibility outcome

Stage 7 does **not** own:

- product definition
- user journey design
- discovery
- evidence collection
- canonicalization
- semantic matching
- broad fit scoring
- ranking
- recommendation
- opportunity quality
- user decision

### Non-negotiable boundary

**Eligibility ≠ Match ≠ Ranking ≠ Recommendation ≠ User Decision**

---

## 2. Cross-Stage Contract

Stage 7 consumes the locked output of Stages 1–6.

### Stage 1 provides

- opportunity definition
- match definition
- user decision authority
- evidence/trust principles
- product boundaries

Stage 7 must not redefine these.

### Stage 2 provides

- user-facing clarity requirements
- visible uncertainty
- understandable reasons
- decision-oriented presentation

Stage 7 therefore produces explainable results rather than opaque machine judgments.

### Stage 3 provides

- User Profile → Hunt → Discovered Opportunities → Evidence → Eligibility / Match / Ranking → Opportunity Intelligence → User Decision
- explicit distinction between eligibility, matching, ranking, recommendation, and decision
- Unknown ≠ Negative
- Inferred ≠ Verified
- Stale ≠ Current
- Conflict ≠ Certainty

Stage 7 is the first stage that operationalizes the eligibility boundary.

### Stage 4 provides

- discovery observations
- source relationships
- discovery freshness/degradation context

Stage 7 must never treat discovery itself as proof of eligibility.

### Stage 5 provides

- claims
- evidence
- provenance
- freshness
- knowledge states
- conflicts
- uncertainty

Stage 7 must evaluate these states explicitly rather than flattening them.

### Stage 6 provides

- canonical opportunity
- normalized fields
- source-native values
- identity relationships
- transformation lineage
- preserved knowledge states and uncertainty

Stage 7 evaluates the canonical representation; it does not rewrite canonicalization.

---

## 3. Locked Architecture Decisions

### Decision 1 — Eligibility Evaluation Model

**D — Hybrid Constraint Evaluation with Explicit Knowledge-State Handling**

Eligibility is evaluated through explicit constraint rules while the evaluation engine remains aware of the knowledge state attached to each relevant opportunity value.

The **core constraint satisfaction result is tri-state: Pass, Fail, or Unknown**. Conflict and Stale are preserved knowledge-state qualifiers that may prevent a reliable result; Not Applicable is an explicit applicability outcome; and Not Evaluated / Degraded describes evaluation completeness rather than business eligibility.

The system must be able to distinguish:

- Pass
- Fail
- Unknown
- Conflict
- Stale / insufficiently current where freshness is material
- Not applicable where a constraint does not apply

Eligibility is therefore not a generic weighted score.

---

### Decision 2 — Hard Requirements vs Preferences

**D — Hybrid Hierarchy: Hard Constraints as Gates, Preferences as Non-Gating Signals**

Hard requirements determine whether an opportunity can remain eligible.

Preferences do not independently make an opportunity ineligible. They remain available to downstream matching and ranking.

Examples:

**Hard requirement:** Remote-only  
→ Onsite-only opportunity can fail eligibility.

**Preference:** Prefer remote  
→ Onsite opportunity may remain eligible but receive weaker fit later.

This prevents preference weighting from silently becoming eligibility logic.

---

### Decision 3 — Unknown / Missing Information

**D — Three-State Evaluation with Criticality-Aware Policy**

Unknown is a first-class evaluation result and must never be silently converted into Pass or Fail.

Use this decision rule:

- **Pass:** the available evidence, under the applicable policy, establishes that the constraint is satisfied.
- **Fail:** the available evidence, under the applicable policy, establishes that the constraint is violated.
- **Unknown / Uncertain:** the available evidence is insufficient to establish satisfaction or violation.
- **Conflict:** material evidence disagrees and cannot be resolved under the applicable policy.
- **Not Applicable:** the constraint's explicit semantics establish that it does not apply.

For a material hard requirement, Unknown, unresolved Conflict, or materially Stale evidence prevents a confirmed Eligible outcome unless an explicit, documented policy for that constraint permits a different result. Unknown is not a pass. A confirmed hard-requirement failure remains decisive for Ineligible status.

The evaluation policy must account for the criticality and semantics of each constraint.

Examples:

- A confirmed violation of a hard requirement → **Fail**
- A required fact that cannot be established → **Unknown**
- A missing preference signal → does not create ineligibility
- A constraint explicitly marked as non-applicable → **Not Applicable**

The system must preserve the difference between:

**not satisfied** and **not known**.

---

### Decision 4 — Conflicting or Stale Evidence

**D — Preserve Conflict and Evaluate According to Explicit Knowledge-State Policy**

The evaluator does not silently select a convenient value when evidence conflicts.

It preserves:

**Constraint → evaluated value(s) → evidence state → provenance**

If conflicting or stale information prevents a reliable hard-constraint decision, the result remains explicitly uncertain rather than being converted into a false Pass or Fail.

Freshness policy is constraint-specific because some requirements are inherently time-sensitive while others are comparatively stable.

---

### Decision 5 — Eligibility Output

**D — Structured Eligibility Result**

The output is a structured result containing, at minimum:

- overall eligibility status
- constraint-level evaluations
- hard-requirement outcomes
- preference observations that are relevant but non-gating
- reasons
- unknowns
- conflicts
- stale-information flags where material
- supporting evidence/provenance references
- evaluation policy/version metadata
- evaluation completeness/degradation state

The human-facing layer can simplify this structure without destroying its auditability.

---

## 4. Eligibility State Model

The evaluator must distinguish:

### Eligible

All material hard requirements are satisfied.

### Ineligible

At least one material hard requirement is confirmed to fail.

### Uncertain

One or more material hard requirements cannot be reliably determined because the relevant information is Unknown, Conflicting, materially Stale, or otherwise insufficient.

### Not Evaluated / Degraded

The evaluation could not be completed sufficiently because required inputs or evaluation capabilities were unavailable.

These states must not be collapsed into one Boolean.

---

## 5. Constraint Evaluation Contract

Each evaluable constraint should carry enough structure to establish:

- constraint identity
- constraint type
- criticality
- operator/semantics
- user-specified value
- opportunity value(s)
- knowledge state
- freshness requirement where applicable
- evaluation result
- reason
- evidence/provenance references
- policy/version information

Conceptually:

**User Constraint + Canonical Opportunity Field + Knowledge State + Policy → Constraint Evaluation**

Then:

**Constraint Evaluations → Overall Eligibility**

---

## 6. Hard-Requirement Gate

A confirmed hard-constraint failure is decisive for eligibility.

However:

**Unknown hard constraint ≠ confirmed failure.**

This prevents the system from deleting potentially relevant opportunities simply because a source omitted information.

The engine must distinguish:

1. **Confirmed violation**
2. **Confirmed satisfaction**
3. **Cannot determine**
4. **Conflicting evidence**
5. **Stale information**
6. **Not applicable**

---

## 7. Preference Boundary

Preferences are deliberately kept outside the hard eligibility gate.

They may later influence:

- semantic matching
- fit explanation
- ranking
- recommendation

but Stage 7 must not convert preference strength into a hidden eligibility threshold.

This protects the architectural distinction between:

**“Does this opportunity qualify?”**

and

**“How well does this opportunity fit?”**

---

## 8. Knowledge-State Policy

Stage 7 preserves the Stage 5 knowledge states:

**Verified / Supported / Inferred / Unknown / Conflicting / Stale**

Canonicalization does not upgrade them.

Evaluation does not upgrade them either.

Examples:

- Verified requirement satisfied → Pass
- Verified requirement violated → Fail
- Unknown requirement → Unknown
- Conflicting values affecting a hard constraint → Conflict / Uncertain
- Stale value where freshness is required → Uncertain unless an explicit policy permits use
- Inferred value → must remain identifiable as inferred and must not be silently presented as verified fact

---

## 9. Explainability Contract

Every material eligibility outcome must be explainable at the constraint level.

Bad:

> ❌ Not eligible

Better:

> ❌ Fails location requirement — opportunity requires onsite attendance; user requires remote work.

Or:

> ⚠️ Eligibility uncertain — work arrangement is not stated in available evidence.

The system should answer:

- What requirement was evaluated?
- What information was used?
- What was the result?
- Why?
- How certain is that result?
- Where did the information come from?

This is essential for user trust.

---

## 10. Human Experience Principle

The internal evaluator may be sophisticated.

The user experience must remain simple.

**System complexity → Human clarity**

The user should primarily see:

- eligible
- not eligible
- uncertain
- why
- what is known
- what is unknown
- what they can verify

The complete provenance structure remains available when useful without overwhelming the primary decision.

---

## 11. Failure and Degraded Evaluation

The system must distinguish:

**Opportunity is ineligible**

from

**System could not reliably evaluate the opportunity.**

Examples of degraded evaluation:

- canonical field unavailable
- evidence service unavailable
- evaluation rule unavailable
- required source information inaccessible
- evaluation version mismatch

A technical failure must never be converted into a business-level eligibility failure.

---

## 12. Stage 7 Output Contract

Stage 7 produces:

**Eligibility Result**

containing:

- overall status
- constraint evaluations
- hard-gate outcome
- uncertainty indicators
- conflict indicators
- stale-data indicators
- reasons
- evidence/provenance references
- evaluation policy/version
- completeness/degradation metadata

Stage 8 may consume the result for semantic matching.

Stage 7 must not pre-compute Stage 8's overall fit.

---

## 13. Authoritative Flow

**User Constraints**  
↓  
**Canonical Opportunity**  
↓  
**Relevant Evidence / Knowledge States**  
↓  
**Constraint Evaluation**  
↓  
**Hard-Requirement Gate**  
↓  
**Structured Eligibility Result**  
↓  
**Stage 8 — Semantic Matching & Fit Evaluation**

Preferences remain available as non-gating inputs for later fit evaluation.

---

## 14. Acceptance Criteria

Stage 7 passes only when:

- hard requirements are explicitly represented
- preferences are separated from hard requirements
- eligibility is rule-based and explainable
- Unknown is distinct from Fail
- conflict is preserved
- stale information remains distinguishable
- knowledge states survive evaluation
- technical/degraded failure is distinct from business ineligibility
- constraint-level reasons are recoverable
- provenance remains traceable
- eligibility does not become matching
- eligibility does not become ranking
- eligibility does not become recommendation
- canonicalization remains owned by Stage 6
- evidence/provenance remains owned by Stage 5
- the user remains the final decision-maker
- the architecture is consistent with Stages 1–6
- human-facing complexity remains controlled

---

## 15. Architecture Decision Record

**Q1 — Eligibility evaluation model:** D — Hybrid Constraint Evaluation with Explicit Knowledge-State Handling

**Q2 — Hard requirements vs preferences:** D — Hard Constraints as Gates, Preferences as Non-Gating Signals

**Q3 — Unknown / missing information:** D — Three-State Evaluation with Criticality-Aware Policy

**Q4 — Conflicting / stale evidence:** D — Preserve Conflict and Evaluate According to Explicit Knowledge-State Policy

**Q5 — Eligibility output:** D — Structured Eligibility Result

### Final decision set

**D / D / D / D / D**

---

## 16. Final Cross-Stage Verification

Stage 7 was analyzed against the locked Stage 1–6 architecture before implementation.

**Result: PASS.**

No Stage 7 decision redefines an earlier stage.

The critical distinctions remain intact:

- Opportunity ≠ Match
- Evidence ≠ Claim
- Canonical ≠ Verified
- Normalized ≠ Validated
- Unknown ≠ Fail
- Eligibility ≠ Match
- Match ≠ Ranking
- Ranking ≠ Recommendation
- Recommendation ≠ User Decision

---

## 17. Status

**🔴 STAGE 7 — PASS / LOCKED**

**Architecture decisions: D / D / D / D / D**

**Stage 7 implementation scope: approved**

**Next stage: Stage 8 — Semantic Matching & Fit Evaluation**


---

## Stage 7 completion and consolidation record

- This is the authoritative consolidated Stage 7 architecture, including binding decisions, separation of responsibilities, edge cases, and the downstream handoff contract.
- Necessary handoff requirements are retained with the stage architecture rather than maintained as redundant standalone documents.
- This status means the architecture specification is consolidated; it does not claim production code or runtime tests have been completed.


---

## Stage 7 → Stage 8 operational handoff contract (consolidated)

- **Consumes:** Stage 6 canonical opportunities and the user's explicit constraints, with Stage 5 evidence/provenance and knowledge-state lineage preserved.
- **Creates:** Structured eligibility results, constraint-level evaluations, hard-gate outcomes, explicit unknown/conflict/staleness handling, reasons, policy/version references, and completeness/degradation metadata.
- **Guarantees:** Hard requirements gate eligibility; preferences remain non-gating; Unknown never silently becomes Pass or Fail; technical/degraded evaluation is not business ineligibility; Stage 8 cannot recompute or override Stage 7's hard-gate decisions.
- **Stage 8 receives:** Overall status, constraint evaluations, gate outcomes, uncertainty/conflict/stale indicators, reasons, provenance refs, policy/version, and completeness/degradation state. Ineligible items cannot be promoted as eligible matches; Uncertain remains explicitly uncertain; Not Evaluated/Degraded is not silently converted to Eligible or Ineligible.
- **Locked answers:** **D / D / D / D / D**.
- **Status:** Stage 7 PASS / LOCKED. The Stage 8 gate was closed only after its five decisions were locked, cross-stage analysis passed, the Stage 8 specification passed acceptance review, and a distinct Stage 8 → Stage 9 handoff was created. See the authoritative [Stage 8 specification](./stage-08-semantic-matching-and-fit-architecture.md). The Stage 8 → Stage 9 interface is governed by the consolidated Stage 8 and Stage 9 specifications; no separate handoff file is required.


---

## 18. Deterministic Evaluation Semantics

This section closes implementation ambiguities that could otherwise cause two implementations to return different eligibility outcomes for the same inputs.

### 18.1 Required constraint record

Every constraint used in eligibility evaluation must have a stable identity and explicit semantics. The implementation record must support:

- `constraint_id` and `constraint_version`;
- a controlled `constraint_type` and field/path reference;
- `criticality`: `hard` or `preference`;
- an explicit operator and comparison semantics;
- the user's declared value, units, scope, and any permitted tolerance;
- the opportunity-side canonical value or values;
- knowledge state and evidence/provenance references;
- freshness policy and evaluation timestamp where freshness matters;
- applicability state;
- outcome and machine-readable reason code;
- policy version and evaluation completeness.

Do not infer criticality, units, comparison rules, or acceptable tolerances from wording at evaluation time. These must be represented in the constraint definition or resolved through an explicit, versioned policy.

### 18.2 Constraint-level outcome vocabulary

Each constraint evaluation must return exactly one primary outcome from this controlled set:

| Outcome | Meaning |
|---|---|
| `PASS` | Available admissible information establishes satisfaction under the declared comparison policy. |
| `FAIL` | Available admissible information establishes a violation. |
| `UNKNOWN` | Required information is absent or insufficient to establish satisfaction or violation. |
| `CONFLICT` | Material evidence disagrees and no permitted resolution rule resolves the disagreement. |
| `STALE` | Information fails the freshness requirement for this constraint. |
| `NOT_APPLICABLE` | The constraint's defined semantics establish that it does not apply. |
| `NOT_EVALUATED` | Evaluation was not performed or could not finish. This is not a business result. |

Knowledge-state qualifiers remain separately available even when the primary outcome is PASS or FAIL. For example, a policy may permit an adequately supported value to be used for a stable attribute, but the source's knowledge state must not be rewritten as Verified.

### 18.3 Overall hard-gate aggregation precedence

Apply this aggregation policy to material hard constraints:

1. If at least one material hard constraint is `FAIL`, overall eligibility is `INELIGIBLE`, with all other constraint outcomes retained. A confirmed violation is not hidden by unrelated unknowns.
2. Otherwise, if any material hard constraint is `UNKNOWN`, `CONFLICT`, or `STALE`, overall eligibility is `UNCERTAIN`.
3. Otherwise, if any required hard constraint is `NOT_EVALUATED`, or a required dependency/policy is unavailable, overall eligibility is `NOT_EVALUATED / DEGRADED`.
4. Otherwise, if all material hard constraints are `PASS` or legitimately `NOT_APPLICABLE`, overall eligibility is `ELIGIBLE`.
5. If no hard constraints are configured, the result must state `NO_HARD_CONSTRAINTS_CONFIGURED`; the product policy must explicitly decide whether this is eligible for consideration or requires user confirmation. It must never be silently treated as evidence of strong fit.

The order above is deliberate: a confirmed hard failure remains decisive; absent a confirmed failure, unresolved material requirements prevent a confirmed Eligible result; a technical inability to evaluate is not a business failure. Store the complete outcome vector so aggregation can be audited and reproduced.

Preferences never change this overall hard-gate result. They are passed forward as non-gating observations.

### 18.4 Applicability and exception rules

- A constraint may be marked `NOT_APPLICABLE` only when its explicit domain semantics justify that conclusion. Missing source data is not non-applicability.
- A user-declared exception or tolerance must be explicit, scoped, and auditable; do not infer exceptions to hard requirements.
- Contradictory user constraints must be surfaced as a user-configuration conflict. Do not resolve them by silently selecting whichever value makes an opportunity eligible.
- If a required policy, operator, unit conversion, or schema version is unknown, return `NOT_EVALUATED / DEGRADED` or `UNCERTAIN` according to whether evaluation was technically blocked or evidence itself was insufficient. Never invent a comparison rule.
- If a source value cannot be mapped to the canonical field without changing meaning, preserve the unresolved value and return an appropriately uncertain or unevaluated result.
- An opportunity's own published eligibility criteria and the user's search constraints are separate concepts. Stage 7 evaluates the user's declared constraints against the opportunity evidence; it must not claim to determine the opportunity issuer's final acceptance decision.

---

## 19. Reference Evaluation Procedure

The implementation should follow this logical procedure, regardless of whether the eventual code uses functions, rules, a database query, or a service:

1. Validate the user constraint set and its version. Detect contradictory or malformed hard constraints before evaluating opportunities.
2. Confirm the canonical opportunity and referenced evidence are available and version-compatible.
3. For each constraint, resolve the canonical field and its lineage without upgrading the knowledge state.
4. Apply the constraint's explicit applicability rule.
5. Check required freshness and unresolved evidence conflicts.
6. Apply the declared operator, normalized units, and tolerance only when their semantics are defined.
7. Emit one primary constraint outcome, a reason code, a human-readable explanation, evidence/provenance references, and policy/version metadata.
8. Aggregate hard constraints using the precedence in Section 18.3.
9. Preserve preferences as separate, non-gating outputs.
10. Emit completeness/degradation metadata and a stable evaluation identifier so the result can be inspected or reproduced.
11. Pass the eligibility result to Stage 8 without allowing Stage 8 to rewrite the gate outcome.

The same input snapshot, constraint set, evidence snapshot, and policy version should produce the same result. If nondeterministic or model-assisted interpretation is introduced in a future implementation, its output must be bounded by the explicit constraint semantics and recorded with enough metadata to audit it; model confidence must not replace the declared rules.

---

## 20. Reason Codes and Explanation Quality

Use stable machine-readable reason codes alongside plain-language explanations. At minimum, the implementation contract must support:

- `HARD_REQUIREMENT_SATISFIED`
- `HARD_REQUIREMENT_VIOLATED`
- `REQUIRED_VALUE_MISSING`
- `EVIDENCE_CONFLICT_UNRESOLVED`
- `REQUIRED_VALUE_STALE`
- `CONSTRAINT_NOT_APPLICABLE`
- `CONSTRAINT_CONFIGURATION_INVALID`
- `USER_CONSTRAINTS_CONTRADICTORY`
- `EVALUATION_DEPENDENCY_UNAVAILABLE`
- `POLICY_OR_SCHEMA_VERSION_MISMATCH`
- `PREFERENCE_OBSERVATION_ONLY`
- `NO_HARD_CONSTRAINTS_CONFIGURED`

An explanation must name the relevant requirement, state what was established and what was not, explain the outcome, and identify the evidence/source when available. It must not overstate the source's meaning. Avoid explanations that merely restate an opaque status.

For an uncertain result, give the user a useful next step when one exists, such as checking the original listing or supplying a missing constraint. Do not imply that user verification has already occurred.

---

## 21. Edge-Case Decision Matrix

| Scenario | Required result | Guardrail |
|---|---|---|
| A hard requirement is explicitly violated; another requirement is unknown | `INELIGIBLE` | Preserve the unknown as a separate finding; do not hide it. |
| All hard requirements are satisfied; a preference is missed | `ELIGIBLE` | Preference may affect later fit, never eligibility. |
| A hard requirement is absent from the source | `UNCERTAIN` | Missing is not pass, fail, or not applicable. |
| Two credible sources disagree on a material hard requirement | `UNCERTAIN` | Preserve both claims and provenance unless an authorized resolution policy applies. |
| A time-sensitive hard-requirement value is stale | `UNCERTAIN` | Do not silently reuse stale information. |
| A stable value is inferred rather than verified | Policy-dependent outcome with inference retained | Never relabel inference as verified. |
| A required evaluator or policy service is unavailable | `NOT_EVALUATED / DEGRADED` | Technical failure is not ineligibility. |
| The opportunity field is explicitly irrelevant to the constraint | `NOT_APPLICABLE` | Applicability must be justified by domain semantics. |
| User hard constraints contradict each other | Configuration conflict / evaluation blocked | Ask for correction through the experience layer; do not guess. |
| Budget is missing but budget is only a preference | Eligibility unchanged | Report the missing budget for downstream fit/intelligence. |
| Currency or units cannot be converted safely | `UNKNOWN` or `NOT_EVALUATED`, based on cause | Never compare unlike units as if equivalent. |
| An opportunity looks semantically relevant but fails a hard constraint | `INELIGIBLE` | Semantic similarity cannot override the hard gate. |
| An opportunity is eligible but poorly aligned with preferences | `ELIGIBLE` | Fit/scoring/ranking remain downstream responsibilities. |
| The eligibility result is based on an older policy version | Re-evaluate or mark version mismatch/degraded | Do not mix results from incompatible policy versions without disclosure. |

---

## 22. Versioning, Auditability, and Re-evaluation

Every overall eligibility result must be associated with a stable evaluation ID and enough metadata to reproduce or explain it, including:

- opportunity canonical ID and relevant canonical-record version;
- user constraint-set ID/version;
- evidence/provenance snapshot references;
- eligibility policy and evaluator version;
- evaluation timestamp;
- per-constraint outcomes and reason codes;
- overall gate outcome;
- completeness/degradation state;
- re-evaluation trigger or reason, where applicable.

Re-evaluation is required when a material input changes, including a user's hard constraints, a relevant canonical field, supporting evidence, freshness state, or eligibility policy version. The prior result should remain traceable as a historical result rather than being silently overwritten without lineage.

Do not store more personal information than necessary to explain the eligibility decision. Retention, access controls, deletion, and consent are owned by the relevant later security/privacy and lifecycle stages.

---

## 23. Implementation Verification Matrix

The following cases are mandatory tests for the eventual implementation. Architecture documentation does not itself pass these tests.

| Test ID | Setup | Expected assertion |
|---|---|---|
| ELI-01 | Every material hard constraint passes | Overall result is `ELIGIBLE`. |
| ELI-02 | One material hard constraint fails | Overall result is `INELIGIBLE`. |
| ELI-03 | One hard constraint fails and another is unknown | Overall result remains `INELIGIBLE`; both reasons survive. |
| ELI-04 | No hard failure, one material hard constraint unknown | Overall result is `UNCERTAIN`. |
| ELI-05 | No hard failure, unresolved material conflict | Overall result is `UNCERTAIN` and both evidence paths remain traceable. |
| ELI-06 | Material hard value is stale under its policy | Overall result is `UNCERTAIN`. |
| ELI-07 | A preference fails while hard constraints pass | Overall result remains `ELIGIBLE`. |
| ELI-08 | Required evaluation dependency is unavailable and no hard failure is established | Result is `NOT_EVALUATED / DEGRADED`. |
| ELI-09 | Missing field is incorrectly proposed as not applicable | Test rejects the implicit conversion. |
| ELI-10 | Semantic match is high but a hard constraint fails | Stage 8 cannot promote the opportunity to eligible. |
| ELI-11 | Input/policy versions differ incompatibly | Result is blocked or explicitly marked degraded; no silent mixing. |
| ELI-12 | Same versioned inputs are evaluated twice | Outcomes and reason codes are deterministic. |
| ELI-13 | An inferred value is used under an allowed policy | Inference qualifier remains visible in the result. |
| ELI-14 | User hard constraints contradict one another | Configuration conflict is surfaced; no arbitrary winner. |
| ELI-15 | Currency or unit conversion is unavailable | No unsafe comparison; result is uncertain or unevaluated with reason. |

The implementation team must add provider/domain-specific tests when new constraint types or sources are introduced. Any change to aggregation precedence requires an explicit architecture decision and regression tests.

---

## 24. Revised Cross-Stage Contract and Ownership

- **Stage 5** owns evidence, provenance, freshness, and knowledge-state semantics. Stage 7 consumes these without changing them.
- **Stage 6** owns canonicalization, field mapping, identity, and transformation lineage. Stage 7 evaluates canonical values without rewriting them.
- **Stage 7** alone owns hard-constraint evaluation and the overall eligibility gate.
- **Stage 8** owns semantic-match findings. It consumes and preserves eligibility and cannot override it.
- **Stage 9** owns fit scoring. A fit score cannot make an ineligible opportunity eligible.
- **Stage 10** owns ranking. Ranking cannot bypass the eligibility gate.
- **Stages 11–12** own intelligence, quality, risk, and recommendation. None may rewrite eligibility.
- **Stage 13** owns the user's decision and action controls. The user remains the final decision-maker.
- **Stages 16–18** must cover recovery/degradation, security/privacy, and observability/audit requirements in their respective architecture contracts.
- **Stage 20** verifies the implemented eligibility gate, its cross-stage invariants, and the required tests before launch.

If downstream output conflicts with the authoritative Stage 7 result, the inconsistency must be surfaced as a system defect, not resolved by allowing a downstream stage to silently change eligibility.

---

## 25. Stage 7 Final Qualification Gate

Stage 7 qualifies as **architecture-ready for implementation** only when all of the following are true:

1. Constraint definitions have explicit, versioned semantics.
2. Hard requirements and preferences remain distinct end-to-end.
3. Constraint outcomes and overall eligibility states are not collapsed into a Boolean.
4. The aggregation precedence is deterministic and documented.
5. Unknown, conflict, stale, not-applicable, and not-evaluated states have separate meanings.
6. Evidence, provenance, and knowledge states survive the evaluation.
7. Each material outcome has a reason code and understandable explanation.
8. Evaluation results can be audited and tied to versioned inputs.
9. Downstream stages cannot override the eligibility gate.
10. The implementation verification matrix is executed and its evidence is recorded before claiming runtime pass.
11. Cross-stage references resolve to existing authoritative documents.
12. The 20-stage architecture is respected; no Stage 21 dependency is introduced.

**Current qualification:** The architecture specification is strengthened and internally defined for implementation. Runtime qualification remains pending until the implementation exists and the required tests are executed.

This is a quality gate, not a numerical score. No “10/10” claim is made from documentation alone.
