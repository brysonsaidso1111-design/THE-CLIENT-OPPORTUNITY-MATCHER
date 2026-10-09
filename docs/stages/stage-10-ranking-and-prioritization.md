# 🔴 Stage 10 — Ranking & Prioritization Architecture

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Creator attribution:** by Terrence  
**Repository:** THE-CLIENT-OPPORTUNITY-MATCHER  
**Branch:** main  
**Previous stage:** Stage 9 — Match Scoring & Fit Evaluation  
**Next stage:** Stage 11 — Opportunity Intelligence  
**Status:** STAGE 10 — COMPLETED (ARCHITECTURE CONSOLIDATED; IMPLEMENTATION NOT CLAIMED)  
**Locked decision set:** **C / C / C / C / D**

---

## 1. Purpose and authority

Stage 10 defines how the system orders and prioritizes discovered opportunities for user attention after receiving the upstream eligibility state, semantic-fit findings, and Stage 9 fit assessment. Its purpose is to make the ordering useful, explainable, policy-governed, and honest about uncertainty.

Stage 10 is a **🔴 CRITICAL STAGE** because ranking determines what receives attention first. A ranking defect can hide relevant opportunities, elevate incomparable or uncertain records, distort upstream assessments, or make ordering appear to be a quality verdict.

This is an architecture contract. It does not claim that ranking code, user interface, production behavior, ranking calibration, or runtime tests are complete.

Stage 10 is subordinate to the product constitution and all locked upstream contracts. It may order eligible opportunities under explicit policy; it must not redefine evidence, eligibility, fit, opportunity quality, recommendation, or user decision.

## 2. Governing question

**“Among the opportunities that can responsibly be compared, which should receive the user's attention first, why, and what limitations must remain visible?”**

Ranking is an ordering mechanism for attention. It is not a declaration that an opportunity is legitimate, high quality, safe, profitable, recommended, or certain to succeed. Rank position is not a user decision.

## 3. Locked architecture decisions

The five Stage 10 decisions are locked as **C / C / C / C / D**.

1. **C — Evidence-backed fit priority:** prioritize using Stage 9 fit assessments while respecting Stage 7 eligibility, score state, evidence limitations, uncertainty, and comparability. Opportunity quality remains distinct and is not silently imported into ranking.
2. **C — Separate eligibility states:** rank confirmed Eligible opportunities in the normal eligible ranking experience; preserve Uncertain, Ineligible, Not Evaluated, and Degraded outcomes in separately labeled states or views as appropriate. Never promote a non-confirmed state into the ordinary eligible list.
3. **C — Hierarchical ranking rules:** apply eligibility and comparability guards first, then the declared primary fit signal and documented tie-breakers. Avoid opaque blending of signals.
4. **C — Qualified ordering under uncertainty:** order only where the policy permits a defensible comparison; preserve uncertainty and incomparability and separate or withhold misleading ordering.
5. **D — Evidence-aware ranking explanation:** explain ranking factors, primary reasons, tie-breakers where material, eligibility state, uncertainty and comparability limitations, and the fact that rank is not a quality verdict or recommendation.

These decisions define architecture direction. They do not establish numeric weights, universal tie-breaker values, empirical calibration, or production thresholds.

## 4. Responsibility boundaries

### Stage 10 owns

- the meaning and permitted interpretation of rank and priority;
- ranking eligibility-state handling, using Stage 7 outcomes as authoritative inputs;
- policy-governed ordering of comparable opportunities;
- the hierarchy of primary ranking signals and documented tie-breakers;
- ordering behavior for qualified, incomparable, incomplete, or degraded assessments;
- evidence-aware explanations of rank position and ordering limitations;
- stable, auditable ranking-policy/version metadata;
- structured ranked-set and non-ranked/separated-set output contracts.

### Stage 10 does not own

- product definition, user goals, or user decision authority (Stage 1);
- the established user journey and Apply / Save / Pass / Verify decisions (Stage 2);
- global domain definitions or upstream ownership (Stage 3);
- discovery queries, source routing, or discovery prioritization (Stage 4);
- source truth, evidence acquisition, or provenance policy (Stage 5);
- canonicalization, identity resolution, or truth adjudication (Stage 6);
- hard-constraint eligibility policy or reevaluation (Stage 7);
- semantic interpretation and structured fit findings (Stage 8);
- score meaning, dimension evaluation, score availability, or scoring policy (Stage 9);
- full opportunity intelligence, opportunity-quality/risk disposition, or recommendations (Stage 11–12);
- user actions, feedback/learning, lifecycle, recovery, security/privacy, observability, production integration, or final launch readiness (Stages 13–20).

## 5. Cross-stage analysis and reconciliation

The selected decisions were analyzed against the locked Stage 1–9 architecture and the Stage 9 → Stage 10 handoff before this specification was drafted.

**Cross-stage analysis result: PASS WITH BINDING GUARDRAILS.**

### Stage 1 — Product Definition & System Contract
- Ranking serves better opportunity decisions, not engagement, result volume, or a visually satisfying complete list.
- The user remains the decision-maker.
- Rank, fit, evidence reliability, eligibility, opportunity quality, risk, recommendation, and likely outcome remain distinct.
- No ranking position may imply guaranteed success, legitimacy, or recommendation.

### Stage 2 — User Journey & Experience Architecture
- Ranking supports the existing journey: Welcome → short explanation → Brief; results show title, match strength, key reasons, opportunity quality, and key risk; the intelligence page supports Apply / Save / Pass / Verify.
- Ranking must not replace or redefine the established user-facing decision categories.
- Separately labeled uncertainty and eligibility states must be expressible without redesigning the journey or disguising incomplete results as ordinary results.

### Stage 3 — Domain, Data & System Contracts
- Preserve all distinctions: User Profile ≠ Hunt; User Constraint ≠ Opportunity Requirement; Hard Requirement ≠ Preference; Source ≠ Evidence; Evidence ≠ Claim; Eligibility ≠ Match; Match ≠ Ranking; Match ≠ Opportunity Quality; Opportunity Quality ≠ Recommendation; Recommendation ≠ User Decision; Unknown ≠ Negative; Inferred ≠ Verified; Stale ≠ Current; Conflict ≠ Certainty.
- Stage 10 consumes upstream assessments and orders records; it does not rewrite upstream facts or states.

### Stage 4 — Opportunity Source & Discovery Architecture
- Source capability, discovery routing, query order, discovery yield, and candidate arrival time do not establish user-facing rank.
- Discovery-system convenience or provider order cannot silently become ranking policy.

### Stage 5 — Evidence & Provenance Architecture
- Ranking explanations must retain links to evidence, claims, source provenance, freshness, and relevant knowledge states.
- Evidence quality limits what can be claimed about ordering; it is not itself a proxy for fit.
- Verified, Supported, Inferred, Unknown, Conflicting, and Stale remain distinct.

### Stage 6 — Opportunity Normalization & Canonicalization
- Canonical records and deduplication do not establish truth or fit.
- Ranking must use canonical identity while preserving lineage and material conflicts; it must not create multiple ranked entries for one resolved canonical opportunity when identity resolution says they are duplicates.

### Stage 7 — Eligibility & Constraint Evaluation
- Stage 7 remains authoritative. Stage 10 must consume, not recalculate, eligibility.
- Only Eligible opportunities enter the ordinary confirmed-eligible ranking set.
- Ineligible opportunities cannot be promoted by a high fit score.
- Uncertain eligibility must remain qualified and separate from confirmed eligible ranking.
- Not Evaluated / Degraded is incomplete or unavailable evaluation, not business ineligibility, confirmed eligibility, or poor fit.
- Preferences remain non-gating; ranking cannot turn preference mismatch into an undeclared hard gate.

### Stage 8 — Semantic Matching & Fit
- Stage 8 structured findings remain traceable beneath Stage 9 scoring and Stage 10 ordering.
- Semantic similarity or textual overlap cannot substitute for the fit assessment or determine rank by itself.

### Stage 9 — Match Scoring & Fit Evaluation
- Stage 9 owns score meaning and availability; Stage 10 owns ordering.
- Stage 9's score state, dimension findings, eligibility state, uncertainty/completeness, evidence references, comparability metadata, policy version, and qualification/withholding reasons must be consumed.
- A withheld or unavailable score is never treated as zero or silently assigned the bottom rank.
- A qualified score can only participate in an ordering where explicit policy and comparable inputs permit it.
- Scores marked incomparable must not be directly ordered as if they shared a valid scale.
- Ranking may use declared tie-breakers only after eligibility and comparability guards; it cannot invent scoring weights or recalibrate Stage 9 scores.

## 6. Ranking model

### 6.1 Ordered guard sequence

The architecture requires this logical order of operations:

1. **Preserve upstream state:** ingest the authoritative Stage 7 eligibility result and the Stage 9 score state and comparability metadata without recomputing either.
2. **Partition by eligibility:** create the ordinary confirmed-eligible set and preserve non-confirmed states in clearly separate state groups.
3. **Check score availability and comparability:** identify scores that are scored, qualified, withheld/not scored, evaluation-incomplete/degraded, or explicitly incomparable under Stage 9 policy.
4. **Apply declared primary ordering:** for records permitted to be compared, prioritize using the declared evidence-backed fit signal and Stage 9 score under the applicable policy.
5. **Apply documented tie-breakers:** only when the primary ordering cannot distinguish records under policy, use named, justified, versioned tie-breakers. Tie-breakers must not smuggle in opportunity quality, provider preference, freshness, or business goals without an explicit approved rationale and clear semantics.
6. **Attach explanations and limits:** preserve the material factors, tie-breaker use, uncertainty, evidence references, eligibility state, and comparability qualifications that explain the resulting order.
7. **Record policy/version metadata:** retain enough information to reproduce or audit the ordering decision.

This is a hierarchy, not a license to invent a universal formula. Exact tie-breaker precedence and numeric thresholds must be justified and versioned before implementation.

### 6.2 Ordinary eligible ranking set

The ordinary ranked set contains only records whose carried-forward Stage 7 state is **Eligible** and whose Stage 9 assessment can participate in ordering under the declared policy.

Eligible status does not guarantee that a record has a usable score. An Eligible record with a withheld or incomplete score must not be assigned a fabricated score or falsely presented as the lowest-fit opportunity. The product may show it in a clearly qualified, separately ordered, or unranked eligible subsection, provided the reason is explicit and no misleading rank is implied.

### 6.3 Separate state groups

- **Uncertain eligibility:** preserve explicit uncertainty; do not mix with confirmed eligible opportunities as though eligibility were established.
- **Ineligible:** exclude from the ordinary eligible ranking. Preserve only in an appropriate separately labeled explanation/audit context; do not present as eligible or promote based on score.
- **Not Evaluated / Degraded:** present as evaluation incomplete/unavailable where the experience permits; do not treat as business rejection or low fit.
- **Eligible with withheld/incomplete/incomparable fit score:** preserve Eligible status while separately expressing scoring limitations; do not transform scoring failure into eligibility failure.

These groupings communicate different system states, not a universal priority order between those states. Any optional ordering within a non-confirmed group must have its own explicit rationale and must not imply eligibility confirmation.

### 6.4 Comparability and qualified ordering

Ranking is permitted only when the inputs are comparable under the active, declared policy. Comparability may depend on scoring-policy/model version, applicable dimensions, coverage/completeness, score state, and other limitations declared by Stage 9.

- Do not directly compare scores that Stage 9 marks incomparable.
- Do not interpret missing score as zero.
- Do not use uncertainty as an unexplained numeric penalty.
- Do not invent a complete ordering just because the UI or data structure expects a list.
- If only some records are comparable, rank the defensible subset and explicitly separate or qualify the remainder.
- If a defensible order cannot be established, withhold rank or present a tie/equivalence group under a documented policy.
- Staleness and conflicts remain visible. They may affect comparability only through explicit, evidence-aware policy; no hidden penalty is allowed.

### 6.5 Primary signal and tie-breakers

The primary ordering signal is the Stage 9 fit assessment where it is available and comparable. Ranking may consider Stage 9 dimension-level or qualification metadata only when the policy explicitly defines that use and the result remains consistent with Stage 9's meaning.

Tie-breakers must be:
- explicitly named and justified;
- applied only after eligibility and comparability guards;
- deterministic for equivalent inputs where feasible;
- versioned and auditable;
- explained when materially affecting rank;
- prevented from overriding hard eligibility or turning preferences into hidden gates.

No fixed numeric weights or universal tie-breaker order is established by this architecture stage.

## 7. Ranking explanations and user interpretation

Each ranked result must expose an appropriately concise explanation with access to detail. Depending on what actually affected the order, the explanation should include:

- the rank/priority and its meaning;
- the primary evidence-backed fit reason;
- relevant Stage 9 dimension or score-state information without redefining the score;
- material tie-breakers, when they affected the order;
- eligibility status, where relevant to the result group;
- uncertainty, missingness, conflict, stale data, incomplete coverage, or comparability limitations;
- evidence/provenance references for material explanations;
- ranking-policy/version metadata for auditability.

The system must make clear, in language appropriate to the interface, that **rank is a relative ordering for attention—not an opportunity-quality verdict, recommendation, legitimacy check, guarantee, or user decision**.

Do not claim that a record ranks first because it is “best,” “safest,” “most profitable,” or “most likely to win” unless the appropriate later-stage contract and evidence actually support that distinct claim.

## 8. Required output contract

The conceptual Stage 10 output must preserve at least:

- canonical opportunity identity and relevant lineage reference;
- carried-forward eligibility state and reason references;
- ranking-set/group classification;
- rank/priority position, qualified rank, tie group, or explicit unranked/withheld state;
- Stage 9 score and score state when available;
- Stage 9 dimension, evidence, and finding references used to explain the order;
- comparability decision and reason;
- primary ranking signal and material tie-breaker references;
- uncertainty, coverage, stale/conflict, and degraded qualifiers;
- concise ranking explanation and limitations;
- ranking-policy/model version and audit reference.

This is a semantic output contract, not a commitment to a specific programming language, database schema, API, or UI.

## 9. Failure and edge-case behavior

- **Empty eligible set:** report that no confirmed eligible opportunities are available; do not fabricate a ranked result.
- **Eligible set with no comparable scores:** preserve eligibility, disclose score limitations, and withhold misleading ordering rather than manufacture rank.
- **Mixed score-policy versions:** compare only if a declared compatibility policy explicitly permits it; otherwise separate or withhold cross-version ordering.
- **Ties:** preserve genuine equivalence where policy cannot justify a distinction; do not manufacture precision.
- **Duplicate canonical opportunities:** use Stage 6 identity/lineage contract to avoid duplicate entries while preserving source provenance.
- **Stale/conflicting evidence:** preserve qualifiers and avoid silent promotion or arbitrary penalties.
- **Partial discovery or provider degradation:** do not imply the ranked set is exhaustive; carry forward relevant Stage 4/5 limitations where available.
- **Ranking execution failure:** report ranking as incomplete/degraded, not as proof of poor opportunity fit or eligibility failure.
- **Policy version change:** record the active version and avoid presenting differently governed rankings as directly comparable without a compatibility rule.
- **User profile/Hunt changes:** treat a changed brief or materially changed inputs as a new ranking context; do not silently reuse a prior order as if it were current.

Stage 10 defines expected behavior; Stage 16 owns cross-system failure/degradation/recovery architecture, Stage 18 owns observability, Stage 19 owns production integration, and Stage 20 owns final readiness tests.

## 10. Versioning, auditability, and change control

- Ranking rules and tie-breakers must be explicit, versioned, and auditable.
- Store or reference the input assessment versions and state needed to explain an order.
- A policy change must not silently rewrite the meaning of historic rank records.
- Re-ranking after material changes must be distinguishable from the previous ranking context.
- Ranking logs must not claim that a rule was applied if its inputs were missing or the process degraded.
- Privacy, retention, access control, and secret-handling requirements remain owned by Stage 17 and production integration by Stage 19.

## 11. Acceptance checklist

- [x] Stage 10 responsibility and boundaries are explicit.
- [x] Locked decisions are recorded as **C / C / C / C / D**.
- [x] Cross-stage analysis against Stages 1–9 is documented before drafting.
- [x] Stage 7 eligibility is consumed without recomputation or override.
- [x] Only confirmed Eligible records enter the ordinary eligible ranking set.
- [x] Uncertain, Ineligible, Not Evaluated, and Degraded states remain distinct.
- [x] Stage 9 score meaning and score states remain authoritative.
- [x] Withheld/unavailable scores are never treated as zero.
- [x] Comparability guards precede ranking and tie-breakers.
- [x] No arbitrary weights, unapproved quality signals, or hidden preference gates are introduced.
- [x] Qualified, incomparable, or incomplete records can be separated or left unranked.
- [x] Evidence-aware explanations, material tie-breakers, and limitations are required.
- [x] Rank is explicitly distinct from opportunity quality, recommendation, legitimacy, and user decision.
- [x] Empty sets, ties, duplicates, stale/conflicting evidence, degradation, and policy changes are addressed.
- [x] Versioning and auditability are required.
- [x] Stage 11 and Stage 12 responsibilities remain protected.
- [x] Stage 13–20 responsibilities remain protected.
- [x] Handoff contract will state What I consume → What I create → What I guarantee → What the next stage receives.
- [x] Specification status does not falsely claim implementation or runtime testing.
- [x] Stage 10 is marked critical with an explicit reason.

## 12. Status and next stage

**Stage 10 architecture: PASS / LOCKED at specification-contract level, subject to repository verification.** This is not an application implementation or runtime-test claim.

**Next stage:** Stage 11 — Opportunity Intelligence.

The next stage must define its responsibility and maintain the established boundaries: Stage 11 orchestrates opportunity intelligence and explanations; Stage 12 owns opportunity-quality/risk disposition and recommendation semantics; the user retains final decision authority.


---

## Stage 10 completion and consolidation record

- This document is the authoritative consolidated Stage 10 architecture, with its requirements, evaluation boundaries, edge cases, and downstream contract preserved together.
- Relevant handoff and correction requirements are to be treated as part of this authoritative specification, not separate stage deliverables.
- This status records architecture consolidation only; it does not assert that production application code or runtime tests have been completed.


---

## Stage 10 to Stage 11 operational handoff contract (consolidated)

- **What Stage 10 consumes:** authoritative Stage 7 eligibility and reason references; Stage 9 score and score state; dimension-level results; Stage 8 finding references; Stage 5 evidence/provenance/knowledge states; Stage 6 canonical identity and lineage; current user profile/Hunt; comparability, completeness, uncertainty, and policy-version metadata.
- **What Stage 10 creates:** eligibility-partitioned ranked and separated sets; rank/priority or explicit unranked/withheld state; primary ordering signal and material tie-breaker references; evidence-aware explanation; comparability and limitation metadata; ranking-policy/version and audit references.
- **What Stage 10 guarantees:** no eligibility override; no fabricated score or arbitrary missingness penalty; no direct comparison where Stage 9 says scores are incomparable; no hidden quality/recommendation inference; uncertainty and evidence lineage remain visible; ranking rules are explicit and versioned.
- **What Stage 11 receives:** canonical opportunity and lineage references; carried-forward eligibility state; Stage 9 score/state and dimension metadata; rank/group classification and explanation; evidence/finding references; uncertainty, completeness, freshness/conflict and comparability limitations; ranking-policy version and audit reference.
