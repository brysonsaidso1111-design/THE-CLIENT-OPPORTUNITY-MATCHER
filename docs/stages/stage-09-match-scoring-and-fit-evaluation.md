# 🔴 Stage 9 — Match Scoring & Fit Evaluation Architecture

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Creator attribution:** by Terrence  
**Repository:** THE-CLIENT-OPPORTUNITY-MATCHER  
**Branch:** main  
**Previous stage:** Stage 8 — Semantic Matching & Fit Architecture  
**Next stage:** Stage 10 — Ranking & Prioritization  
**Status:** STAGE 9 — COMPLETED (ARCHITECTURE CONSOLIDATED; IMPLEMENTATION NOT CLAIMED)  
**Locked decision set:** **D / D / C / D / D**

---

## 1. Purpose and authority

Stage 9 defines how structured, evidence-linked semantic-fit findings become a transparent, multidimensional fit assessment. It establishes the meaning of the score, dimension model, uncertainty controls, explanation requirements, aggregation guardrails, comparability rules, and output contract.

Stage 9 is a **🔴 CRITICAL STAGE** because a misleading score can turn nuanced findings into false confidence and distort every later prioritization or decision-support step.

This is an architecture contract, not an implementation claim. It does not assert that scoring code, UI, production behavior, or numerical calibration has been implemented or tested.

This specification is subordinate to the locked product constitution and upstream contracts. It may operationalize them but must not silently redefine them. A contradiction must be surfaced and resolved before implementation proceeds.

## 2. Stage 9's governing question

**“How well does this opportunity fit the user's current brief, what supports that assessment, and how much should the user rely on the score given the evidence and limitations?”**

The fit score measures the relationship between a freelancer's current intent/capabilities and an opportunity's relevant needs/context. It is not a verdict on whether the opportunity is legitimate, high quality, profitable, safe, or recommended.

The product optimizes for useful, well-informed opportunity decisions—not for producing a number for every record.

## 3. Locked architecture decisions

The user's five Stage 9 decisions are locked as **D / D / C / D / D**.

1. **D — Explainable multidimensional scoring:** produce a transparent composite fit score alongside component dimensions, supporting evidence, and limitations.
2. **D — Defined core plus conditional dimensions:** use a stable core scoring model and activate additional dimensions only when relevant and sufficiently supported.
3. **C — Score with explicit uncertainty controls:** preserve supported findings, identify unknowns and conflicts, and disclose how uncertainty limits interpretation.
4. **D — Evidence-linked scoring explanation:** explain the score, dimension contributions, supporting evidence, missing/conflicting signals, and material limitations.
5. **D — Defined comparability rules and guardrails:** specify when scores may be compared, disclose limitations, and leave ordering/ranking to Stage 10.

These decisions define architecture direction. They do not establish numeric weights, empirical calibration, or production thresholds by themselves.

## 4. Responsibility boundaries

### Stage 9 owns

- the semantic meaning and permitted interpretation of a fit score;
- a defined core plus conditional scoring-dimension architecture;
- rules for applicability, evidence sufficiency, aggregation, and uncertainty disclosure;
- preservation of Stage 8 finding-level detail and Stage 5 provenance/knowledge states;
- explainable dimension contributions and score limitations;
- score availability, qualification, and comparability semantics;
- versioning and auditability requirements for scoring policy;
- a structured fit-assessment output contract and acceptance criteria.

### Stage 9 does not own

- opportunity discovery or source routing (Stage 4);
- evidence acquisition, source-truth adjudication, or provenance policy (Stage 5);
- canonicalization, identity resolution, or normalization (Stage 6);
- hard-constraint eligibility or eligibility policy (Stage 7);
- semantic interpretation and structured fit findings (Stage 8);
- ordering, rank positions, tie-breaking between opportunities, or search-result prioritization (Stage 10);
- full opportunity-intelligence orchestration (Stage 11);
- opportunity-quality verdicts, risk disposition, or recommendations (Stage 12 and its downstream contracts);
- user-controlled actions, feedback/learning, lifecycle, cross-system recovery, security, observability, production integration, or final launch readiness (Stages 13–20).

## 5. Cross-stage analysis and reconciliation

The selected decisions were analyzed against the locked Stage 1–8 specifications and the Stage 8 → Stage 9 handoff before this specification was drafted.

**Cross-stage analysis result: PASS WITH BINDING GUARDRAILS.**

### Stage 1 — Product Definition & System Contract

- Fit is a reasoned relationship, not textual similarity alone.
- Evidence, reasoning, budget, eligibility, fit, opportunity quality, risk, recommendation, and user decision remain distinct.
- Strong fit cannot erase opportunity risk or guarantee client success.
- The product must not invent facts or confidence and must keep the user as final decision-maker.
- A score must serve decision quality rather than maximizing score availability or result volume.

### Stage 2 — User Journey & Experience Architecture

- The score and its explanation must be understandable in the established results/intelligence journey.
- Missing, stale, conflict, uncertain, empty, and degraded states must be expressible without disguising them as ordinary results.
- Stage 9 defines scoring semantics; Stage 2's locked journey and decision categories are not redesigned here.
- Presentation may simplify detail but must not discard material uncertainty or the underlying category distinctions.

### Stage 3 — Domain, Data & System Contracts

- Preserve the conceptual distinctions among User Profile, Hunt, opportunity, source, evidence, claim, eligibility, match, ranking, opportunity quality, recommendation, and user decision.
- Stage 9 owns fit scoring; Stage 10 owns ranking.
- This specification defines semantic requirements for a fit-assessment output, not a new global domain model or implementation schema.
- Unknown remains distinct from negative; inferred remains distinct from verified; stale remains distinct from current; conflict remains distinct from certainty.

### Stage 4 — Opportunity Source & Discovery Architecture

- Discovery relevance, source capability, source routing, and query priority are not fit scores.
- A source's ability to return a candidate or a discovery system's confidence does not establish opportunity fit.
- Search budget and source selection policies cannot be smuggled into Stage 9 score dimensions.

### Stage 5 — Evidence & Provenance Architecture

- Evidence, claim, source, knowledge state, freshness, and provenance lineage must remain traceable.
- Evidence quality is not fit itself. It limits how confidently a fit claim can be supported.
- Verified, Supported, Inferred, Unknown, Conflicting, and Stale states must not be collapsed.
- Conflicting evidence must not be silently discarded, and no numerical result may create false precision merely because calculation is possible.

### Stage 6 — Opportunity Normalization & Canonicalization

- Canonical fields are usable representations, not automatic proof of truth.
- Scoring must preserve source/evidence lineage and the uncertainty of transformations.
- Normalization, deduplication, or a convenient preferred field cannot silently resolve a material truth conflict for scoring purposes.

### Stage 7 — Eligibility & Constraint Evaluation

- Stage 7 remains authoritative for hard constraints. Stage 9 must not recompute, weaken, or override its outcome.
- A high fit score cannot promote an Ineligible opportunity into ordinary eligible results.
- An Uncertain eligibility result must remain explicitly qualified. Not Evaluated / Degraded must remain an incomplete/unavailable evaluation, not a negative-fit verdict or confirmed eligibility.
- Preferences remain non-gating. A preference mismatch may inform fit only under the declared scoring policy; it must not become a hidden eligibility gate.
- Unknown, unresolved conflict, or materially stale evidence affecting a critical hard requirement cannot be made to pass through scoring.

### Stage 8 — Semantic Matching & Fit Architecture

- Consume structured aligned, missing, conflicting, partial, unknown, stale, inferred, unsupported, and context-dependent findings.
- Preserve dimension-level explanations, evidence/provenance references, eligibility state, applicability, and completeness/limitation metadata.
- Do not replace Stage 8 findings with a score or use model similarity/confidence as a substitute for the final fit assessment.
- A semantic finding remains an input signal with its own qualifiers; it is not automatically a verified fact.

### Binding reconciliation for Decision 3

Choice A from the initial uncertainty question was not retained. The locked choice is **C — Score with explicit uncertainty controls**.

This means:
- missing information is not automatically negative evidence;
- uncertainty is not silently ignored;
- uncertainty is not converted into an arbitrary penalty;
- supported compatibility may be assessed when the scoring policy permits it;
- material uncertainty must qualify, limit, or in specified cases prevent a score from being issued;
- a numeric score cannot imply stronger certainty than the underlying findings support.

## 6. Scoring meaning and interpretation

### 6.1 What the score means

The composite score is a summary of the supported fit relationship between the current user brief and the opportunity across applicable dimensions under a declared scoring-policy version.

It does not mean:
- probability of winning a client;
- probability that the client is legitimate;
- opportunity quality or expected financial value;
- evidence reliability by itself;
- eligibility;
- recommendation strength;
- ranking position;
- guarantee of a successful outcome.

### 6.2 Score availability is not guaranteed

The system must not force a numeric score when required inputs are missing, evaluation is degraded, applicability cannot be determined, or the model cannot produce a defensible result.

The output must be able to represent at least:
- **Scored:** a score was produced under the declared policy and its qualifications remain visible.
- **Qualified:** a score is available but important uncertainty or incomplete coverage limits interpretation.
- **Withheld / Not Scored:** no defensible composite score can be issued under the applicable policy.
- **Evaluation Incomplete / Degraded:** the process did not complete sufficiently to claim a completed score.

The exact machine-readable enum and UI labels belong to implementation contracts later. These meanings are binding now.

A withheld score is not a zero. An unavailable score is not a low-fit result. A technical failure is not a business conclusion.

## 7. Dimension architecture

### 7.1 Core model

The model must have a stable, documented core covering the central relationship between the user's current brief and the opportunity. At minimum, the architecture must support the following conceptual coverage, with final dimension boundaries and calculation rules specified explicitly before implementation:

- **Service / capability alignment:** relationship between the services and capabilities the user offers and the work the opportunity needs.
- **Requirement coverage:** alignment with relevant stated or evidence-supported requirements, without overriding Stage 7's hard-gate result.
- **Goal and intent alignment:** alignment with the user's current Hunt, target, and intended outcome.
- **Context alignment:** relevant sector, client context, engagement setting, and work context where they materially affect fit.

These are scoring coverage concepts, not a claim that each will always have a numeric subscore or identical weight.

### 7.2 Conditional dimensions

Conditional dimensions may be included only when applicable to the current brief/opportunity relationship and sufficiently supported under the scoring policy. They may include:

- relevant experience or specialization;
- location, time zone, language, or work-arrangement compatibility;
- budget or rate compatibility;
- stated preferences;
- other explicitly captured user intent that can be evaluated consistently.

A conditional dimension must declare:
1. the condition that makes it applicable;
2. the user/opportunity inputs it consumes;
3. the kinds of Stage 8 findings it can use;
4. how missing, conflicting, inferred, stale, or unsupported inputs affect it;
5. whether it contributes to the composite score or is shown as contextual information only;
6. how it is explained and versioned.

### 7.3 Applicability is not missingness

- **Applicable and supported:** may contribute according to the declared policy.
- **Applicable but unknown or insufficiently supported:** preserve uncertainty; do not automatically score as mismatch.
- **Conflicting or stale:** preserve the state and apply the documented limitation policy.
- **Not applicable:** exclude from the denominator/aggregation as explicitly defined; do not count it as zero or as a mismatch.
- **Not evaluated / degraded:** represent incomplete processing rather than a fit finding.

The implementation must never change the effective score simply because an irrelevant dimension was added to the model.

## 8. Aggregation, weights, and numeric integrity

A composite score requires an explicit and reviewable aggregation policy. The policy must define dimension contributions, normalization, applicability, missingness, and the circumstances under which a score is withheld or qualified.

However, **this architecture specification does not invent final numeric weights, thresholds, calibration, or empirical performance claims**. Those values must be established and justified before production scoring is enabled. A numerical-looking score without defensible semantics and validation is not best standard.

Before implementation can pass review, the scoring policy must document:
- dimension definitions and directionality;
- any weight or contribution scheme and why it is appropriate;
- normalization to a declared output scale, if a numeric scale is used;
- applicable-dimension and denominator rules;
- safeguards against double-counting correlated or duplicate signals;
- treatment of conditional dimensions;
- treatment of unknown, conflicting, stale, inferred, unsupported, and degraded inputs;
- score withholding/qualification criteria;
- rounding and display rules, where applicable;
- policy/model version and reproducibility requirements.

Weights must not be selected merely because they produce attractive-looking results. No universal score meaning may be claimed without evidence that the model supports that interpretation.

## 9. Uncertainty and evidence controls

### 9.1 Required distinctions

The scoring pipeline must preserve, where applicable:
- direct evidence versus inference;
- Verified / Supported / Inferred / Unknown / Conflicting / Stale knowledge states;
- missing evidence versus evidence of mismatch;
- partial alignment versus contradiction;
- not applicable versus not evaluated;
- incomplete processing versus a completed negative result.

### 9.2 Permitted effects on scoring

Uncertainty can affect:
- whether a dimension is scorable;
- the score's qualification or availability;
- coverage/completeness indicators;
- explanation and verification guidance;
- comparability with other assessments.

Uncertainty must not be transformed into an unexplained automatic penalty. A negative contribution requires a supported mismatch or a declared, defensible scoring rule—not merely absence of information.

### 9.3 Materiality and withholding

Before implementation, the scoring policy must identify which missing/conflicting/stale signals are material enough to qualify or withhold a score. These policies must align with Stage 7 hard-gate requirements and must not bypass its decisions.

The architecture must support a case where the known fit signals are strong but important information is absent. The result may report supported alignment while making the uncertainty visible; it must not invent a negative mismatch or imply a fully settled assessment.

### 9.4 Eligibility-state carry-through

- **Eligible:** may receive a fit score subject to Stage 9's evidence and completeness requirements.
- **Ineligible:** must not be promoted to an ordinary eligible match by score. If an internal/audit score is retained, it must be segregated and clearly marked as non-eligible context, not normal result ranking input.
- **Uncertain:** any permitted score must be explicitly qualified by the uncertain eligibility state and its reasons. It must not be presented as confirmed eligible.
- **Not Evaluated / Degraded:** a partial fit assessment, if allowed at all, must be clearly marked incomplete and must not be represented as a completed ordinary score. It cannot be interpreted as proof of poor fit or confirmed eligibility.

## 10. Budget and preferences

Budget is a first-class fit signal where relevant, but it must retain the distinctions established upstream:
- stated budget;
- inferred budget;
- unknown/missing budget;
- conflicting budget;
- budget compatibility as an interpretation rather than a raw fact.

A stated budget may be compared with the user's relevant pricing expectations when both are sufficiently understood. An inferred budget must not be displayed or scored as if the client stated it. Missing budget must not automatically lower the fit score. Budget incompatibility may contribute only when supported by the inputs and the declared policy.

Preferences remain non-gating. They can inform fit when relevant, but must not silently become hard requirements or override Stage 7.

## 11. Score explanation contract

Each score output must be explainable enough for downstream presentation and audit. It must preserve, as applicable:

- overall score and score state;
- declared scale and interpretation limitations;
- scoring-policy/model version;
- core and conditional dimension results;
- dimension applicability and contribution/aggregation details;
- supporting Stage 8 finding identifiers;
- evidence/provenance references inherited from upstream;
- aligned, partial, missing, conflicting, stale, inferred, unsupported, or uncertain signals;
- score coverage/completeness and uncertainty qualifications;
- withheld/qualified reasons;
- eligibility state and reason references;
- any comparison limitations.

Explanations must not fabricate evidence, claim independent verification where none occurred, or imply a causal precision that the scoring method cannot support. The score must not be the only surviving output; its contributing findings and reasons must remain recoverable.

## 12. Comparability contract

Two scores are not automatically comparable merely because they use the same nominal scale.

The scoring contract must define comparability conditions, including:
- compatible scoring-policy/model versions or an explicit, validated migration rule;
- compatible dimension semantics and aggregation policy;
- known applicability and material coverage differences;
- uncertainty, freshness, and evidence limitations that materially affect interpretation;
- any context differences that invalidate direct comparison.

Where comparability is limited, the system must disclose that limitation. It must not imply that a score difference is meaningful if model version, dimension coverage, or evidence sufficiency makes the comparison unreliable.

Stage 9 may provide comparability metadata or a safe-to-compare assessment under explicit rules. It must not order opportunities, assign rank positions, decide result placement, or introduce Stage 10 ranking weights.

A score is not a recommendation. A score is not a ranking. A score is not opportunity quality.

## 13. Versioning, reproducibility, and auditability

Every completed scoring assessment must be traceable to:
- the scoring-policy/model version;
- the input brief/Hunt version or reference;
- the Stage 8 findings consumed;
- the relevant evidence/provenance references and knowledge-state qualifiers;
- dimension applicability decisions;
- the score state, composite result if issued, and explanations;
- the policy reasons for qualification or withholding.

When the scoring policy changes, the version must change. The system must not silently compare scores from materially different policies as if their meaning were unchanged. Reproducibility means the recorded policy and inputs explain how the assessment was produced; it does not mean the underlying external opportunity facts remain current forever.

## 14. Failure and degraded evaluation boundary

Stage 9 must expose its own incomplete or failed evaluation state clearly enough for Stage 16 to handle cross-system recovery later.

- A scoring exception is not evidence of poor fit.
- Missing inputs caused by a technical failure are not automatically negative fit signals.
- Partial dimension results must be labeled partial and must not be presented as a complete composite assessment.
- A fallback must not silently change score semantics or eligibility status.
- The system must preserve already established Stage 7 eligibility and Stage 8 findings when scoring cannot complete.

Stage 9 defines scoring-specific semantics. Stage 16 owns cross-system failure/recovery policy.

## 15. Relationship to downstream stages

### Stage 10 — Ranking & Prioritization

Receives fit assessments with score state, dimension details, comparability/coverage metadata, uncertainty, eligibility state, and version references. Stage 10 owns ordering and prioritization policy. It must not treat a fit score as a complete recommendation or opportunity-quality verdict.

### Stage 11 — Opportunity Intelligence & Explanation

Receives score reasoning and preserved Stage 8 findings so that the broader opportunity explanation can distinguish fit, evidence, risk, uncertainty, and opportunity quality.

### Stage 12 — Opportunity Quality, Risk & Recommendation

May later combine fit with opportunity quality, risk, budget, evidence, and other factors under its own contract. Stage 9 must not make the recommendation.

### Stages 13–20

User actions, feedback/learning, lifecycle, cross-system recovery, security/privacy/trust, analytics/observability, production integration, and final launch readiness remain owned by their respective stages. This specification defines their scoring inputs and limitations without prematurely implementing those responsibilities.

## 16. Operational contract

### What Stage 9 consumes

- Stage 8 structured semantic-match findings, explanations, dimension/subdimension references, and knowledge-state qualifiers;
- Stage 7 authoritative eligibility status, hard-gate results, reasons, and completeness/degradation metadata;
- Stage 6 canonical opportunity fields and transformation/identity lineage;
- Stage 5 claims, evidence, source/provenance references, freshness, and conflict relationships;
- the current user profile, constraints, capabilities, preferences, goals, and Hunt/brief version;
- the declared scoring-policy/model version and applicable policy configuration.

### What Stage 9 creates

- a structured multidimensional fit assessment;
- a composite score only when permitted by the declared policy;
- per-dimension results and applicable contribution information;
- score state, coverage/completeness, uncertainty and qualification metadata;
- evidence/finding-linked explanations;
- score withholding or qualification reasons;
- comparability metadata/limitations;
- policy/model version and audit references.

### What Stage 9 guarantees

- fit is not confused with eligibility, ranking, opportunity quality, recommendation, or user decision;
- Stage 7 eligibility is never recomputed or overridden;
- Stage 8 findings and Stage 5 provenance/knowledge states remain traceable;
- unknown, conflicting, stale, inferred, unsupported, and incomplete states are not silently converted into certainty;
- missing information is not automatically treated as negative fit;
- conditional and inapplicable dimensions do not silently distort aggregation;
- no numeric score is presented as a probability of winning, legitimacy, quality, or success;
- no score alone triggers ranking, recommendation, or user action;
- every issued score is versioned and accompanied by explanation and material limitations.

### What Stage 10 receives

- composite score and score state, where available;
- dimension-level results and contribution metadata;
- applicable-dimension and coverage/completeness information;
- uncertainty, conflict, stale, inferred, and unsupported qualifiers;
- evidence and Stage 8 finding references;
- authoritative Stage 7 eligibility state and reason references;
- comparability limitations and scoring-policy/model version;
- withheld/qualified/degraded reasons.

Stage 10 receives inputs for ranking; it does not receive permission to reinterpret an unavailable score as zero, erase eligibility restrictions, or assume that scores are comparable when Stage 9 says they are not.

## 17. Acceptance criteria

Stage 9 may be marked **PASS / LOCKED** only after review confirms:

- [x] The locked decision set is recorded exactly as **D / D / C / D / D**.
- [x] Cross-stage analysis against Stages 1–8 is documented and has no unresolved contradiction.
- [x] The fit-score meaning is explicit and does not imply eligibility, ranking, opportunity quality, recommendation, legitimacy, probability of winning, or guaranteed success.
- [x] A defined core plus conditional dimension model is specified.
- [x] Applicability, missingness, not-applicable, not-evaluated, and degraded states are distinct.
- [x] Aggregation requirements and numeric integrity guardrails are explicit; unsupported weights, thresholds, and calibration claims are not invented.
- [x] Unknown, conflicting, stale, inferred, unsupported, and incomplete signals remain visible and traceable.
- [x] Missing information is not automatically treated as a negative fit signal or arbitrary penalty.
- [x] Score qualification and withholding semantics are defined.
- [x] Stage 7 eligibility outcomes are carried forward and never recomputed or overridden.
- [x] Budget's stated, inferred, unknown, and conflicting states are preserved.
- [x] Preferences remain non-gating.
- [x] Score explanations retain dimension details, findings, evidence/provenance references, uncertainty, and limitations.
- [x] Comparability conditions and limitations are explicit.
- [x] Stage 10 owns ranking and receives sufficient metadata to avoid unsafe comparisons.
- [x] Versioning, reproducibility, auditability, and scoring-specific degraded states are defined.
- [x] The specification explicitly states what Stage 9 consumes, creates, guarantees, and what Stage 10 receives.
- [x] No production implementation, numerical calibration, or runtime testing is claimed without evidence.

## 18. Specification review record

The five decisions are locked as **D / D / C / D / D**. The cross-stage architecture analysis is **PASS WITH BINDING GUARDRAILS**.

The specification was reviewed against the acceptance checklist above after publication and retrieval verification. All 18 architecture acceptance criteria are marked satisfied at the specification-contract level. **Review result: PASS / LOCKED.** This status confirms the architecture specification and handoff contract only; it does not claim application code, visual UI, numerical calibration, production behavior, or runtime tests are complete.

---

**Next stage:** Stage 10 — Ranking & Prioritization  
**Next permitted action after Stage 9 acceptance:** follow the autonomous architecture workflow for Stage 10: define responsibility → independently select five decisions against locked Stages 1–9 → cross-check all relevant stage contracts → resolve contradictions → draft the specification and handoff → re-fetch and verify the saved artifacts. Do not ask the user to answer A/B/C/D architecture questions unless the user volunteers.


---

## Stage 9 completion and consolidation record

- This document is the authoritative consolidated Stage 9 architecture, with its requirements, evaluation boundaries, edge cases, and downstream contract preserved together.
- Relevant handoff and correction requirements are to be treated as part of this authoritative specification, not separate stage deliverables.
- This status records architecture consolidation only; it does not assert that production application code or runtime tests have been completed.


---

## Stage 9 to Stage 10 operational handoff contract (consolidated)

- **Consumes:** Stage 8 structured semantic-fit findings; Stage 7 eligibility and hard-gate outcomes; Stage 6 canonical opportunity and lineage; Stage 5 evidence/provenance/knowledge states; current user profile and Hunt; declared scoring-policy version.
- **Creates:** explainable multidimensional fit assessment; composite score when permitted; dimension results; score state; uncertainty/completeness metadata; evidence-linked explanation; comparability metadata; version and audit references.
- **Guarantees:** fit remains distinct from eligibility, ranking, opportunity quality, recommendation, and user decision; Stage 7 is never overridden; missing information is not automatically negative; evidence and uncertainty remain traceable; score limitations are disclosed.
- **Stage 10 receives:** score and score state, dimension results, eligibility state, evidence/finding references, completeness and uncertainty metadata, comparability guardrails, policy version, and withholding/qualification reasons.
