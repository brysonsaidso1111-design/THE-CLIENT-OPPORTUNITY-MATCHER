# 🔴 Stage 11 — Opportunity Intelligence Architecture

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Creator attribution:** by Terrence  
**Repository:** THE-CLIENT-OPPORTUNITY-MATCHER  
**Branch:** main  
**Previous stage:** Stage 10 — Ranking & Prioritization  
**Next stage:** Stage 12 — Opportunity Quality, Risk & Recommendation  
**Status:** STAGE 11 — COMPLETED (ARCHITECTURE CONSOLIDATED; IMPLEMENTATION NOT CLAIMED)  
**Assistant-selected decision set:** **D / D / C / D / D**

---

## 1. Responsibility

Stage 11 turns an individual canonical opportunity and its upstream assessments into a coherent, evidence-aware intelligence view that helps the user understand the opportunity. It assembles relevant context, claims, source evidence, eligibility, semantic-fit findings, scoring, ranking, limitations, and unresolved questions into a structured explanation.

Stage 11 is a **🔴 CRITICAL STAGE** because it is the user's main understanding layer. If it merges evidence with inference, hides uncertainty, or confuses fit with quality, risk, or recommendation, it can distort the user's decision.

Stage 11 is an architecture contract, not a claim that the intelligence page, API, orchestration, or production behavior has been implemented or runtime-tested.

## 2. Governing question

**“What can the user responsibly understand about this specific opportunity, what supports each important statement, what remains unknown or conflicting, and what should be examined further?”**

Opportunity intelligence explains the opportunity and the system's reasoning. It does not decide for the user, make the Stage 12 quality/risk/recommendation verdict, or rewrite upstream assessments.

## 3. Five architecture questions and selected answers

The five design questions were answered by selecting the options that best preserve the locked Stages 1–10 blueprint.

1. **How should the intelligence view be assembled? — D: Layered evidence-first intelligence dossier.** Build a coherent overview from canonical opportunity data, evidence-backed claims, Stage 7 eligibility, Stage 8 findings, Stage 9 fit assessment, and Stage 10 ranking context, while preserving each layer's authority.
2. **How should claims and evidence be represented? — D: Claim-centric evidence and provenance links.** Important claims retain source/evidence references, knowledge state, freshness, conflicts, and limitations; sources, claims, and evidence remain distinct.
3. **How should depth and readability work? — C: Concise decision-oriented summary with expandable structured detail.** Start with a clear overview and key findings, then expose supporting evidence, reasoning, caveats, and provenance without overwhelming the primary journey.
4. **How should unknowns and conflicts be handled? — D: Explicit multi-state preservation.** Show verified/supported/inferred/unknown/conflicting/stale/unsupported/incomplete distinctions as applicable; never silently resolve conflicts or fill gaps with invented facts.
5. **Where is the boundary with quality and recommendation? — D: Strict responsibility separation.** Stage 11 explains evidence and upstream assessments; Stage 12 owns opportunity-quality/risk disposition and recommendation semantics; Stage 13 owns user-controlled actions; the user remains final decision-maker.

These are architecture choices, not implementation claims or assertions that every opportunity will have complete evidence.

## 4. Cross-stage analysis

**Result: PASS WITH BINDING GUARDRAILS** against the locked Stages 1–10 architecture and Stage 10 → Stage 11 handoff.

- **Stage 1 — Product Definition:** intelligence improves decision quality and preserves user authority; it must not invent certainty or promise outcomes.
- **Stage 2 — Journey & Experience:** preserve Welcome → short explanation → Brief, results with title/match strength/key reasons/opportunity quality/key risk, and the intelligence page leading to Apply / Save / Pass / Verify. Stage 11 supplies understandable intelligence without replacing these choices.
- **Stage 3 — Domain & System Contracts:** keep source, evidence, claim, eligibility, match, ranking, opportunity quality, recommendation, and user decision distinct.
- **Stage 4 — Discovery:** discovery observations and source routing are context, not proof of legitimacy, fit, or quality; partial discovery must not be presented as exhaustive.
- **Stage 5 — Evidence & Provenance:** maintain evidence-to-claim-to-source traceability and distinct knowledge/freshness/conflict states.
- **Stage 6 — Canonicalization:** canonical fields are normalized representations, not automatically verified facts; retain source lineage and transformation context.
- **Stage 7 — Eligibility:** display carried-forward eligibility and reason references; do not recompute or override the authoritative hard-constraint result.
- **Stage 8 — Semantic Matching:** preserve structured aligned, missing, conflicting, partial, inferred, unknown, and context-dependent findings and their evidence references.
- **Stage 9 — Scoring:** present the score only with its state, dimensions, uncertainty, limitations, and comparability qualifiers. Do not change score meaning or convert withheld/incomplete to zero.
- **Stage 10 — Ranking:** display rank/group context as relative attention order only; preserve eligibility partitions, tie/withheld states, ranking explanation, and comparability limits. Do not call rank “best” or treat it as a recommendation.
- **Stage 12:** opportunity quality, risk disposition, and recommendation belong downstream and must not be smuggled into Stage 11's neutral intelligence assembly.
- **Stages 13–20:** actions, learning, lifecycle, recovery, security/privacy, observability, production integration, and final readiness remain owned by their assigned stages.

## 5. Responsibility boundaries

### Stage 11 owns

- intelligence-page data orchestration and structured presentation contract;
- canonical opportunity overview and relevant context assembly;
- claim-centric evidence and provenance presentation;
- accessible explanations of upstream eligibility, semantic findings, fit assessment, and ranking context;
- explicit uncertainty, conflict, freshness, incompleteness, and source-coverage presentation;
- concise overview plus deeper structured evidence/reasoning;
- distinction between known facts, supported claims, inferences, and unresolved questions;
- an intelligence output contract that downstream quality/risk/recommendation and user-action stages can consume.

### Stage 11 does not own

- truth adjudication or source policy (Stage 5);
- canonical identity resolution or normalization (Stage 6);
- eligibility recomputation (Stage 7);
- semantic matching evaluation (Stage 8);
- fit scoring or calibration (Stage 9);
- ranking policy or rank recalculation (Stage 10);
- opportunity-quality verdicts, risk disposition, or recommendation (Stage 12);
- Apply / Save / Pass / Verify execution or user decision (Stage 13);
- feedback learning, lifecycle, cross-system recovery, security/privacy, observability, production integration, or launch readiness (Stages 14–20).

## 6. Intelligence assembly model

The conceptual assembly is:

**Canonical Opportunity + Lineage (Stage 6)**  
+ **Evidence / Claims / Provenance / Knowledge States (Stage 5)**  
+ **Eligibility Result / Reasons (Stage 7)**  
+ **Structured Semantic Findings (Stage 8)**  
+ **Fit Assessment / Score State / Dimensions / Limitations (Stage 9)**  
+ **Ranking / Group / Explanation / Comparability Context (Stage 10)**  
→ **Stage 11 Opportunity Intelligence View and Structured Intelligence Output**

This is an orchestration and explanation layer, not a new source of truth. It must preserve the identity, version, provenance, and limitation metadata of the inputs.

## 7. Claim and evidence integrity

For each material claim presented as factual or as a basis for reasoning, retain as applicable:

- claim text or normalized claim identifier;
- linked evidence references and source identity;
- source publication/update/observation time when available;
- evidence and knowledge state (Verified, Supported, Inferred, Unknown, Conflicting, Stale, Unsupported, or other explicit upstream state);
- provenance and canonical-field lineage;
- confidence/qualification metadata only where grounded in an upstream contract;
- missing evidence, contradiction, or limitation reasons;
- relevant upstream policy/model versions.

A source is not itself proof of every claim it contains. A claim is not the same as evidence. Multiple sources do not automatically mean independent corroboration. Normalized text is not verification. Stage 11 must not invent evidence, silently discard conflicting evidence, or imply a claim was verified when it was only inferred or supported.

If evidence cannot be linked, state that limitation instead of manufacturing provenance.

## 8. Information hierarchy and explanation

The intelligence view should support two connected levels:

### Overview
- canonical opportunity identity and concise description;
- key facts and context with their knowledge state where material;
- carried-forward eligibility state;
- key semantic-fit findings and Stage 9 score/state, if available;
- ranking context and explanation, if applicable;
- material risk/unknown/conflict indicators without making Stage 12's verdict;
- the most important limitations and unanswered questions.

### Detailed inspection
- claims with evidence and provenance;
- source links and timestamps when available;
- relevant Stage 8 findings and explanations;
- Stage 9 dimensions, score state, uncertainty, completeness, and comparability limitations;
- Stage 10 rank/group explanation, material tie-breakers, and ordering limitations;
- conflicts, stale information, unsupported claims, and gaps;
- input and policy/model version references needed for audit.

The overview may simplify wording, but it must not erase a material qualifier that changes interpretation. The detailed view should allow the user to inspect why a statement appears and what supports it.

## 9. State preservation and incomplete intelligence

The view must preserve these distinctions when present:

- **Verified / Supported / Inferred / Unknown / Conflicting / Stale / Unsupported:** do not collapse knowledge states.
- **Eligible / Ineligible / Uncertain / Not Evaluated / Degraded:** carry forward Stage 7 status without reinterpretation.
- **Scored / Qualified / Withheld / Not Scored / Evaluation Incomplete / Degraded:** carry forward Stage 9 score state without substituting zero or a fabricated low score.
- **Ranked / Tied / Separated / Unranked / Withheld:** carry forward Stage 10 ordering limitations.
- **Missing / Partial / Conflicting / Stale / Unavailable:** show the actual limitation instead of presenting a complete-looking dossier.

An opportunity may have strong fit but unresolved quality or risk. An opportunity may be eligible but have incomplete intelligence. A highly ranked item may still have important unknowns. These conditions are not contradictions to be hidden; they are separate dimensions of the decision context.

If upstream inputs are unavailable or inconsistent, the output must identify which sections are incomplete and avoid implying that the whole intelligence view was fully evaluated.

## 10. Output contract

The conceptual Stage 11 output should include:

- canonical opportunity identity and lineage references;
- assembled overview and structured detail sections;
- claim/evidence/provenance links and knowledge-state qualifiers;
- carried-forward eligibility state and reason references;
- Stage 8 finding references and explanations;
- Stage 9 score/state, dimensions, completeness, uncertainty, and comparability metadata;
- Stage 10 rank/group state, explanation, tie-breakers, and limitations;
- missing/conflicting/stale/unsupported/incomplete indicators;
- unresolved questions or evidence gaps;
- source coverage/partial-discovery qualifications where provided upstream;
- input policy/model versions and audit references;
- explicit boundary marker that Stage 12's quality/risk/recommendation decision is a separate downstream assessment.

This is a semantic contract, not a fixed database schema, API, or UI implementation.

## 11. Failure and edge cases

- **No evidence attached to a material claim:** mark the claim as unsupported/unlinked or omit the factual assertion; do not invent provenance.
- **Conflicting sources:** display the conflict and references; do not silently choose a winner.
- **Stale information:** disclose staleness and timestamps when known; do not imply currentness.
- **Partial discovery:** identify coverage limitations where upstream metadata indicates partial discovery; do not claim exhaustive research.
- **Eligible but unscored:** preserve eligibility and explain score unavailability separately.
- **Ineligible but high fit:** preserve Ineligible status; do not visually or verbally imply that fit overrides it.
- **Uncertain eligibility:** label uncertainty explicitly; do not imply confirmed eligibility.
- **Unranked or incomparable result:** preserve Stage 10 state and explanation; do not manufacture rank.
- **High rank with unresolved unknowns:** show both the ranking context and material unknowns.
- **Intelligence assembly failure:** mark affected sections or the view as incomplete/degraded; do not disguise a system failure as lack of opportunity quality.
- **Stale cached view after Hunt change:** identify the relevant context/version mismatch or refresh state; do not present prior intelligence as if it reflected the current brief.
- **Stage 12 assessment not yet available:** leave quality/risk/recommendation as not evaluated or pending; Stage 11 must not fill that boundary itself.

Stage 16 owns cross-system recovery architecture, Stage 17 owns security/privacy/trust, Stage 18 owns observability, Stage 19 owns production integration, and Stage 20 owns final launch verification.

## 12. Versioning, auditability, privacy, and accessibility

- Preserve references to input snapshots or versions needed to explain the assembled view.
- Track relevant upstream policy/model versions and the intelligence assembly version.
- Do not rewrite history silently when upstream assessments change; distinguish refreshed intelligence from a prior view.
- Present source details and evidence in a usable, accessible hierarchy; concise summaries must remain consistent with detailed evidence.
- Apply least-privilege access and data minimization under Stage 17; do not expose internal provider credentials or secrets.
- Retention, analytics, and operational event behavior remain governed by Stages 17–19.

## 13. Acceptance checklist

- [x] Stage 11 responsibility and boundaries are explicit.
- [x] Assistant-selected decision set is recorded as **D / D / C / D / D**.
- [x] Cross-stage analysis against locked Stages 1–10 is documented before drafting.
- [x] Claim, evidence, source, and provenance remain distinct and traceable.
- [x] Stage 7 eligibility is carried forward without recomputation.
- [x] Stage 8 findings and their qualifiers remain available.
- [x] Stage 9 score meaning, state, dimensions, uncertainty, and comparability remain authoritative.
- [x] Stage 10 rank/group states and explanations remain authoritative.
- [x] Unknown, inferred, conflicting, stale, unsupported, and incomplete states remain explicit.
- [x] Overview and detailed inspection provide layered explanation without hiding material caveats.
- [x] Stage 12 quality/risk/recommendation boundary is protected.
- [x] User remains final decision-maker; no user action is executed by Stage 11.
- [x] Partial discovery, missing evidence, conflicts, stale views, and assembly failures are addressed.
- [x] Versioning, lineage, auditability, privacy, and accessibility requirements are explicit.
- [x] No implementation, UI completion, or runtime tests are falsely claimed.
- [x] Handoff defines What I consume → What I create → What I guarantee → What the next stage receives.
- [x] Stage 11 is marked critical with an explicit reason.

## 14. Status and next stage

**Stage 11 architecture: PASS / LOCKED at specification-contract level, subject to repository verification.** This is not an implementation or runtime-test claim.

**Next stage:** Stage 12 — Opportunity Quality, Risk & Recommendation.

Stage 12 must preserve the boundaries between fit, evidence reliability, eligibility, ranking, opportunity quality, risk disposition, recommendation, and user decision.


---

## Stage 11 completion and consolidation record

- This document is the authoritative consolidated Stage 11 architecture, including the stage-specific decisions, interfaces, failure cases, separation of responsibilities, and downstream contract.
- Relevant handoff and audit resolutions belong to this authoritative specification; redundant standalone stage documents are not part of the consolidated architecture deliverable.
- This completion records architecture consolidation, not implementation or runtime-test completion.


---

## Stage 11 to Stage 12 operational handoff contract (consolidated)

- **What Stage 11 consumes:** Stage 6 canonical opportunity and lineage; Stage 5 claims/evidence/provenance/knowledge states; Stage 7 eligibility and reasons; Stage 8 structured semantic findings; Stage 9 score/state/dimensions/limitations; Stage 10 ranking/group/explanation/comparability metadata; current user Hunt and relevant version metadata.
- **What Stage 11 creates:** a concise opportunity overview; structured detailed intelligence; claim-to-evidence/source links; preserved eligibility, fit, score, and rank context; uncertainty/conflict/freshness/completeness indicators; unresolved evidence gaps; assembly and audit/version references.
- **What Stage 11 guarantees:** no invented facts or provenance; no silent conflict resolution; no eligibility/score/rank recomputation; no conflation of fit, ranking, quality, risk, recommendation, or user decision; material caveats remain visible.
- **What Stage 12 receives:** canonical opportunity and lineage; intelligence sections and material claims; supporting evidence/provenance and knowledge states; carried-forward eligibility, fit, score, and rank context; limitations and unresolved questions; relevant policy/model/version references.
