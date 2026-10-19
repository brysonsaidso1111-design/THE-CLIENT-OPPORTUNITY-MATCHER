# Stage Completion & Handoff Playbook — THE CLIENT OPPORTUNITY MATCHER™

**Status:** Supplemental execution control for the approved 20-stage architecture  
**Applies to:** `implementation/ready-to-code-foundation` and implementation branches derived from it  
**Authority:** The 20 files under `docs/stages/`, the Stage Implementation Matrix, the Implementation Readiness Plan, and the Testing, Environment & Release Evidence Plan remain authoritative. This playbook operationalizes their completion discipline; it does not replace, rename, reorder, or weaken them.

## 1. Non-negotiable rules

1. Build one coherent application across the existing 20 stages. Do not split it into separate apps or redesign the architecture as a shortcut.
2. Preserve the authoritative stage names, order, responsibilities, contracts, dependencies, and handoffs.
3. Read the complete authoritative stage specification and its existing GitHub handoff issue before implementation.
4. Implement the complete approved scope of a stage. Do not declare a stage complete merely because a document exists, a file was added, code compiles, or a mock test passes.
5. A stage is **VERIFIED COMPLETE** only when its required implementation exists, all mandatory acceptance criteria pass, evidence is recorded against a named commit/environment, and its outgoing handoff is usable by the next stage.
6. A failed check or missing evidence remains **OPEN**, **BLOCKED**, or **NOT VERIFIED** as appropriate. Never silently pass a blocker downstream.
7. Ordinary internal fixes are allowed when they preserve approved contracts. Changes to product behavior, shared contracts, security boundaries, data ownership, or the locked technology stack require explicit review and reconciliation.
8. Distinguish deterministic mocks, test/sandbox integrations, and live integrations. A mock result is never evidence that a live service works.
9. Keep source/provenance, eligibility, semantic fit, score, rank, intelligence, quality/risk/recommendation, user intent, lifecycle, and technical execution as distinct concepts.
10. The Opportunity Verdict is included within **Stage 12 — Opportunity Quality, Risk & Recommendation**. It is not a new stage and must not duplicate or override upstream domain rules.
11. Stage 19 integrates and implements the approved system. Stage 20 independently verifies the release candidate and records a justified GO/NO-GO decision.
12. Keep the full approved product scope. Resolve defects or record blockers; do not reduce features to manufacture progress.

## 2. Required completion record for every stage

Before marking any stage complete, record:

- **Stage and existing issue:** authoritative stage name and handoff issue.
- **Starting state:** exact upstream artifacts/contracts consumed and prerequisite status.
- **Implementation:** actual code, UI, schema, configuration, tests, and documentation delivered.
- **Acceptance criteria:** each criterion from the authoritative stage spec, marked pass/fail/not verified.
- **Verification:** exact command or reproducible procedure, result, date, commit SHA, environment, and dependency mode (mock, sandbox/test, or live).
- **Failure and boundary coverage:** relevant empty, partial, unknown, invalid, denied, failed, timeout, retry, concurrency, and recovery cases.
- **Security/privacy checks:** applicable access, ownership, secret handling, data minimization, and logging checks.
- **Known gaps and defects:** stable defect IDs, severity, owner, and next action.
- **Outgoing handoff:** versioned/defined outputs, evidence links, and explicit next-stage dependencies.
- **Status:** NOT IMPLEMENTED, PARTIALLY IMPLEMENTED, BLOCKED, IMPLEMENTED, or VERIFIED, using the repository's status definitions accurately.

A checked box is not evidence by itself. Link to the actual test result, artifact, PR/commit, or reproducible manual verification.

## 3. The 20-stage execution map

### Stage 1 — Product Definition & System Contract
**Start with:** Approved product scope, user needs, trust principles, and the existing Stage 1 specification.  
**Work:** Define the product promise, target users, in-scope behavior, non-claims, terminology, cross-stage invariants, and testable acceptance criteria. Preserve the rule that the user makes the final decision and that the app must not claim an application or client outcome occurred when it did not.  
**Finish when:** Product behavior and boundaries are explicit, testable, and traceable to the approved specification.  
**Handoff:** Stable product/system invariants and acceptance criteria for Stage 2.  
**Existing issue:** #1.

### Stage 2 — User Journey & Experience Architecture
**Start with:** Stage 1's approved product/system contract.  
**Work:** Define and implement the approved journeys, routes, screen states, accessible interaction patterns, source-selection experience, profile/brief setup, discovery, results, evidence details, verdict review, actions, feedback, and failure/empty/degraded states. Preserve the separate Peer Lead Network boundary.  
**Finish when:** Each required journey and non-happy path has a defined interface/state and relevant browser/accessibility checks pass.  
**Handoff:** Approved journey, state, and component contracts for Stage 3.  
**Existing issue:** #2. The separate Sources-page issue is #23.

### Stage 3 — Domain, Data & System Contracts
**Start with:** Product invariants and approved user journeys.  
**Work:** Implement canonical entities, relationships, validation, API contracts, state vocabularies, ownership rules, persistence schemas, versioned migrations, constraints, indexes, and RLS policies as required by the authoritative specification. Preserve unknown/conflicting states and shared operation outcomes.  
**Finish when:** Contract/schema tests pass; migration and recovery behavior is evidenced; ownership and cross-user denial are verified in a non-production database.  
**Handoff:** Versioned data/domain contracts and validated records for Stage 4.  
**Existing issue:** #3.

### Stage 4 — Opportunity Source & Discovery Architecture
**Start with:** Canonical contracts and the approved source policy.  
**Work:** Implement the source registry/capabilities, bounded search/query strategy, provider-neutral adapters, query-attempt traceability, result limits, and typed provider outcomes. Keep prohibited marketplace access disabled unless written authorization for the exact surface and use is documented. Do not use a provider to bypass source restrictions.  
**Finish when:** Deterministic adapter tests cover success, valid empty, partial, denial, timeout, rate limit, malformed responses, and bounded usage; source-policy constraints hold.  
**Handoff:** Candidate records with source and retrieval context for Stage 5.  
**Existing issue:** #4.

### Stage 5 — Evidence & Provenance Architecture
**Start with:** Candidate records and source metadata.  
**Work:** Represent claims, evidence, publisher/source, acquisition provider, freshness, directness/authority, conflicts, and knowledge state. Keep observed statements distinct from inference; retain source references through downstream processing.  
**Finish when:** Provenance round-trip tests pass; material claims can be traced to evidence or explicitly marked as inferred, conflicting, stale, or unknown.  
**Handoff:** Evidence-linked candidate claims for Stage 6.  
**Existing issue:** #5.

### Stage 6 — Opportunity Normalization & Canonicalization
**Start with:** Source-native records and provenance contracts.  
**Work:** Normalize records into the canonical opportunity schema while preserving source-native values, ambiguity, conflicting data, and provenance. Apply safe identity/deduplication rules; quarantine malformed or ambiguous records where required.  
**Finish when:** Fixtures cover missing, ambiguous, conflicting, stale, duplicate, and malformed fields; false merges and implied verification are prevented.  
**Handoff:** Canonical, validated opportunities with retained evidence for Stage 7.  
**Existing issue:** #6.

### Stage 7 — Eligibility & Constraint Evaluation
**Start with:** Canonical opportunities, freelancer requirements, and evidence.  
**Work:** Evaluate hard constraints separately from preferences. Preserve PASS, FAIL, UNKNOWN, and NOT_EVALUATED plus completeness, conflict, stale, and degraded context. Explain each constraint result.  
**Finish when:** Table-driven tests prove that unknown is never silently promoted to pass, hard failures remain authoritative, and incomplete/degraded evaluation is explicit.  
**Handoff:** Typed eligibility results and per-constraint evidence/reasons for Stage 8.  
**Existing issue:** #7.

### Stage 8 — Semantic Matching & Fit
**Start with:** Eligibility results, canonical opportunity data, and the freelancer profile/requirements.  
**Work:** Evaluate service and skill alignment using structured and semantic signals; explain matches and gaps; distinguish observations from inferred findings. Consume Stage 7 eligibility as authoritative.  
**Finish when:** Tests show fit logic does not alter eligibility, invent missing facts, or treat keyword overlap as proof of fit.  
**Handoff:** Fit findings and evidence references for Stage 9.  
**Existing issue:** #8.

### Stage 9 — Match Scoring & Fit Evaluation
**Start with:** Fit findings and the approved scoring contract.  
**Work:** Implement versioned, explainable scoring and factor contributions. Keep fit distinct from eligibility, rank, evidence confidence, and opportunity quality. Handle missingness and uncertainty explicitly.  
**Finish when:** Scores are reproducible under the same inputs and policy version; regression tests pass; unsupported calibration claims are absent.  
**Handoff:** Fit scores, factor explanations, and policy version for Stage 10.  
**Existing issue:** #9.

### Stage 10 — Ranking & Prioritization
**Start with:** Fit evaluations and the approved ranking policy.  
**Work:** Order opportunities using approved, defensible criteria; define tie-breaking, comparability, incomplete/uncertain records, and stable ordering. Never hide a hard eligibility failure behind a high score.  
**Finish when:** Repeatability, tie, incomplete, incomparable, and eligibility cases pass tests and ranking explanations are available.  
**Handoff:** Ordered opportunities with priority factors for Stage 11.  
**Existing issue:** #10.

### Stage 11 — Opportunity Intelligence
**Start with:** Canonical opportunities, evidence, eligibility, fit, scoring, and ranking outputs.  
**Work:** Assemble an evidence-first intelligence dossier. Link material claims to source/evidence, freshness, conflict, and knowledge state. Preserve missing/conflicting context and disclose degraded intelligence.  
**Finish when:** Claim-to-evidence and degraded/partial behavior tests pass; the system does not present unsupported inferences as facts.  
**Handoff:** Structured intelligence and unresolved questions for Stage 12.  
**Existing issue:** #11.

### Stage 12 — Opportunity Quality, Risk & Recommendation
**Start with:** Eligibility, fit, scoring, ranking, intelligence, provenance, and the approved recommendation matrix.  
**Work:** Implement opportunity quality and risk as distinct dimensions; integrate **THE OPPORTUNITY VERDICT** as the user-facing, evidence-based decision-support feature. The verdict must explain fit, eligibility, supporting evidence, material risks, unknowns/conflicts, reasoning, and the next sensible verification/action step. Define the verdict labels and rules against the authoritative contract before coding. Do not create a competing eligibility or scoring engine, double-count factors, or allow a high fit score to override a hard constraint failure. Recommendations advise; they do not claim the freelancer has applied or guarantee a client outcome.  
**Finish when:** Matrix and regression tests cover eligible, ineligible, uncertain, not-evaluated, conflicting, and degraded states; every material claim is traceable or explicitly uncertain; the verdict remains distinct from match score and rank.  
**Handoff:** Structured quality/risk/recommendation and Opportunity Verdict payload, with explanation/evidence references, for Stage 13.  
**Existing issue:** #12.

### Stage 13 — User Decision & Action Controls
**Start with:** The approved Stage 12 assessment/recommendation contract.  
**Work:** Implement supported actions and controls; record explicit user intent separately from app-recorded state and externally confirmed outcomes. Protect against duplicate actions and unauthorized data access. Opening a source must not be represented as an application submission.  
**Finish when:** Action state and idempotency tests pass; UI/browser tests distinguish open, intended, submitted, and externally confirmed states as applicable.  
**Handoff:** Accurate, attributable user decision/action events for Stage 14.  
**Existing issue:** #14. Note: GitHub issue #13 is a separate cross-stage audit, not Stage 13.

### Stage 14 — Feedback & Learning
**Start with:** User decisions/actions and approved feedback/privacy rules.  
**Work:** Capture attributable feedback, separate user-specific preference updates from shared learning, and gate model/scoring changes through versioned evaluation. Do not silently mutate live policy or rewrite historical assessment snapshots.  
**Finish when:** Duplicate/untrusted feedback, consent/privacy, reproducibility, versioning, and rollback tests pass.  
**Handoff:** Validated feedback and approved improvement signals for Stage 15.  
**Existing issue:** #15.

### Stage 15 — Opportunity Lifecycle
**Start with:** Opportunity identity, user actions, and feedback contracts.  
**Work:** Implement the lifecycle state machine and valid transitions. Keep lifecycle separate from eligibility, assessment, user intent, external events, and technical execution. Preserve history and make repeated transitions safe.  
**Finish when:** Transition, concurrency, duplicate event, stale context, terminal/reactivation, and history tests pass.  
**Handoff:** Versioned lifecycle events/state for Stage 16.  
**Existing issue:** #16.

### Stage 16 — Failure, Degradation & Recovery
**Start with:** Shared operation outcomes and all pipeline/component contracts.  
**Work:** Implement typed failures, retry/cancel rules, idempotency, reconciliation, and safe degraded behavior across the pipeline. A provider outage must never become fabricated evidence or a successful empty result.  
**Finish when:** Fault-injection tests distinguish valid empty/partial/denied/failed outcomes; uncertain writes are reconciled before unsafe retries; recovery behavior is documented.  
**Handoff:** Shared failure/recovery behavior and runbook requirements for Stage 17.  
**Existing issue:** #17.

### Stage 17 — Security, Privacy & Trust
**Start with:** Data ownership rules, auth/session contracts, entitlement policy, and threat requirements.  
**Work:** Enforce server-side session verification, current entitlement checks, owner-only manual approval/revoke/block actions, RLS and user isolation, secret isolation, privacy/retention, abuse prevention, and safe cache/session behavior. Only ACTIVE entitlement may access protected features; failures must fail closed. Never expose protected functionality before its relevant security gate passes.  
**Finish when:** Non-production database, two-user isolation, session lifecycle, unauthorized access, stale/revoked entitlement, forged flags, owner privilege, replay, cache, and secret-leak checks pass.  
**Handoff:** Verified security controls and evidence for Stage 18.  
**Existing issue:** #18.

### Stage 18 — Analytics, Observability & Quality
**Start with:** Authoritative outcomes, security/privacy constraints, and operational requirements.  
**Work:** Define and emit versioned events/metrics with correct semantics, safe bounded dimensions, redacted structured logs, and detectable telemetry loss. Distinguish operational success from evidence or match quality.  
**Finish when:** Event correctness, redaction, cardinality, telemetry-loss, and diagnostic checks pass; monitoring/runbook needs are documented.  
**Handoff:** Instrumented application behavior and operational evidence for Stage 19.  
**Existing issue:** #19.

### Stage 19 — Integration & Production
**Start with:** Verified upstream contracts and the remaining compatibility-spike gates.  
**Work:** Integrate the complete application through approved adapters; implement runtime/deployment, auth/session, persistence/migrations, entitlement workflow, discovery, configuration, CI, runbooks, observability, recovery, and rollback. Resolve contract mismatches explicitly. Verify real Supabase behavior, RLS/two-user isolation, server-only secret injection, manual approval/revocation persistence, and live Tavily connectivity when safe test credentials are available. Keep marketplace access disabled without documented authorization.  
**Finish when:** The integrated release candidate builds and deploys in the intended test/staging environment; required database, session, secret, adapter, end-to-end, accessibility, and recovery checks pass. A green build alone is insufficient.  
**Handoff:** Exact release-candidate commit, integration/test evidence, deployment/recovery instructions, known issues, and risk register for Stage 20.  
**Existing issue:** #20.

### Stage 20 — Final Readiness & Launch Gate
**Start with:** One identified release-candidate commit, all stage handoffs, and the evidence/defect registers.  
**Work:** Independently audit all 20 stages, traceability, core journeys, source/evidence integrity, Opportunity Verdict, access controls, resilience, accessibility, telemetry, deployment, recovery, and known limitations. Re-run critical checks against the exact candidate and record unresolved defects or any formally approved limitations.  
**Finish when:** All mandatory release criteria pass; release-blocking defects are fixed and retested; evidence supports an explicit GO decision for the exact commit and environment. Otherwise record NO-GO and the specific blockers.  
**Final handoff:** Evidence-backed release decision, release scope, known limitations, and operational handover.  
**Existing issue:** #21.

## 4. Global pipeline acceptance

Before Stage 20 can issue GO, verify the integrated flow:

**Discovery → Evidence/Provenance → Normalization → Eligibility → Semantic Fit → Scoring → Ranking → Intelligence → Quality/Risk/Recommendation and Opportunity Verdict → User Decision/Actions → Feedback → Lifecycle**, with failure/recovery, security/privacy, and observability controls operating across the relevant boundaries.

At each handoff, verify that identifiers, evidence references, uncertainty, conflicts, completeness, status, and failure semantics survive. No component may silently upgrade UNKNOWN, turn a provider failure into an empty success, erase conflicting evidence, or claim an external action occurred without confirmation.

## 5. Release-blocking evidence rules

- Missing evidence means **NOT VERIFIED**, not PASS.
- A build pass does not prove live provider connectivity, correct database policies, user isolation, durable entitlement, or the complete user journey.
- Mocked tests do not replace required live/sandbox integration evidence.
- P0/P1 security, data-isolation, entitlement, provenance, lifecycle-integrity, or release-critical contract defects block release.
- Stage 20 must not approve itself based on documentation or a green build alone.
- Each completion record must identify the commit, environment, test mode, command/procedure, actual result, unresolved gaps, and outgoing handoff.
- Update the existing handoff issue with PR/commit and evidence. Keep the separate cross-stage audit issue separate from the Stage 13 handoff.
