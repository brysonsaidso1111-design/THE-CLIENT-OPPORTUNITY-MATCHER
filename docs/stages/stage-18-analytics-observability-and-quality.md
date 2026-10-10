# Stage 18 — Analytics, Observability & Quality Architecture

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Creator attribution:** by Terrence  
**Brand mark:** The Exploded T  
**Repository:** THE-CLIENT-OPPORTUNITY-MATCHER  
**Branch:** main  
**Previous stage:** Stage 17 — Security, Privacy & Trust  
**Next stage:** Stage 19 — Integration & Production  
**Status:** STAGE 18 — ARCHITECTURE CONSOLIDATED; INSTRUMENTATION, DASHBOARDS, AND RUNTIME VALIDATION NOT CLAIMED

---

## 1. Purpose and responsibility boundary

Stage 18 defines how the product measures operational health, pipeline completeness, evidence integrity, assessment quality, user experience, and the reliability of the buyer-only product journey. It establishes which events and metrics must exist, what they mean, which dimensions they may use, how telemetry is protected, and how measurements become actionable quality signals.

Its governing principle is:

**Measure what actually happened, preserve the difference between system health and opportunity quality, and never let analytics manufacture truth or override a domain decision.**

Stage 18 provides the observability and quality contract consumed by Stage 19 implementation and Stage 20 launch evaluation. It does not implement the full monitoring stack, decide match-scoring formulas, own authentication, change opportunity lifecycle states, or independently declare the product ready for launch.

Stage 18 owns:
- event and metric semantics;
- correlation across a user request and its pipeline operations;
- operational, data-quality, assessment-quality, and user-journey measurement definitions;
- freshness, completeness, coverage, and failure-rate indicators;
- privacy-safe telemetry requirements;
- alert intent and severity definitions;
- testable quality signals and reporting expectations.

Stage 18 does not own:
- failure taxonomy, retries, fallback, or recovery semantics (Stage 16);
- authorization, secret management, privacy policy, and abuse controls (Stage 17);
- opportunity discovery strategy (Stage 4), evidence truth/provenance (Stage 5), canonicalization (Stage 6), eligibility (Stage 7), matching (Stage 8), scoring (Stage 9), ranking (Stage 10), intelligence (Stage 11), quality/risk/recommendation (Stage 12), user decisions (Stage 13), feedback learning (Stage 14), or opportunity lifecycle (Stage 15);
- production adapters, deployment, monitoring-vendor selection, and runtime wiring (Stage 19);
- final release approval (Stage 20).

A metric can reveal that a stage is behaving unexpectedly; it cannot silently redefine that stage's semantics.

---

## 2. The five governing architecture questions — answered

### Question 1: What must be measured so that we can tell whether the product is working correctly?

**Decision: D — Use a layered measurement model: operational health, pipeline integrity, assessment quality, user-journey health, and business/product outcomes.**

A single uptime metric is insufficient for an evidence-based matching product. The service could be online while discovery is incomplete, source evidence is stale, a user sees an invalid ranking, or a paid buyer cannot activate access.

The measurement layers are:

1. **Operational health:** request success/failure, latency, timeouts, dependency health, persistence reliability, retry volume, resource saturation, and recovery.
2. **Pipeline integrity:** discovery coverage, provider completeness, evidence availability, source freshness, normalization/deduplication outcomes, contract-validation failures, and processing-stage completion.
3. **Assessment integrity:** proportion of results with sufficient evidence, unknown/missing-input rates, score completeness, ranking comparability, recommendation support, and reproducibility of assessment inputs/version.
4. **User-journey health:** purchase-to-activation success, activation failure categories, authorized-session establishment, search completion, result usefulness feedback, save/action persistence, and recovery from failed actions.
5. **Product outcomes:** voluntary feedback, confirmed user-reported actions/outcomes, repeat use, and progression through the product's intended workflow—interpreted without claiming that the app caused client acquisition or revenue.

Every metric must have a defined name, unit, population, calculation, time window, owner, interpretation, known blind spots, and action if it breaches its threshold. The first release should instrument a small, high-value set comprehensively rather than produce a large dashboard of ambiguous numbers.

### Question 2: What is the correct telemetry model, and how do events connect across stages?

**Decision: D — Use a structured, versioned event envelope with correlation IDs and domain-specific event families.**

Events must be machine-readable and stable enough to compare across releases. Free-form logs alone are not a reliable analytics contract.

Each operational event should include, where applicable:
- `event_name`: stable, documented event identifier;
- `event_schema_version`: version of the event contract;
- `occurred_at`: timestamp with timezone/UTC normalization;
- `environment`: development, test, staging, or production;
- `service_version` / `release_id`: deployed version identifier;
- `operation_id`: ID for the logical operation;
- `correlation_id` / `trace_id`: links related operations in a single request journey;
- `stage_or_component`: stable owner/component label;
- `outcome`: one of Stage 16's normalized statuses: `SUCCESS_WITH_RESULTS`, `SUCCESS_EMPTY`, `SUCCESS_PARTIAL`, `DENIED`, `FAILED`, `CANCELLED`, or `NOT_RUN`;
- `duration_ms`: elapsed time for completed operations;
- `dependency_id`: safe, non-secret provider/dependency identifier where applicable;
- `attempt_count`, `failure_code`, `denial_code`, and `completeness`: when relevant under Stage 16. `failure_code` applies only to `FAILED`; `denial_code` applies only to `DENIED`;
- `assessment_version` and input/evidence snapshot references: when necessary to reproduce an assessment;
- `sampling_or_diagnostic_flags`: where implemented, without weakening required security/audit records.

Use domain-specific event families, including:
- access and entitlement lifecycle;
- discovery operations and per-provider outcomes;
- evidence acquisition and validation;
- normalization/canonicalization;
- eligibility evaluation;
- matching and scoring;
- ranking and recommendation generation;
- user decision/action and confirmed persistence;
- feedback submission and outcome reporting;
- dependency failure, retry, and recovery;
- security-relevant events as defined by Stage 17;
- release, migration, and configuration validation.

The event envelope does not authorize collecting every possible attribute. Stage 17's data minimization and privacy rules take precedence. Prefer internal pseudonymous identifiers and aggregate dimensions; never place credentials or full sensitive content into event payloads.

For a given request, the correlation chain should make it possible to answer: which stage ran, which dependencies were used, what completed, what failed or was partial, which assessment version was produced, and whether the user's action was durably confirmed—without requiring the telemetry system to store the user's entire private record.

### Question 3: How do we measure quality without confusing technical success, evidence quality, and match quality?

**Decision: D — Keep quality dimensions separate and use stage-owned definitions with explicit denominators.**

The product must not collapse health, evidence confidence, fit, eligibility, opportunity quality, risk, and recommendation into one generic quality number. Those concepts have different owners and different consequences.

Required measurement dimensions include:

- **Operational success:** Did the operation complete according to its contract?
- **Discovery completeness:** Did the intended provider/source coverage complete, or was the result partial?
- **Evidence coverage:** What proportion of material claims has usable, traceable support? Which important claims remain unknown or conflicting?
- **Evidence freshness:** How old is the supporting evidence relative to the relevant source-specific freshness policy?
- **Normalization integrity:** How often are records merged, left separate, rejected, or flagged as uncertain—and what is the sampled error rate?
- **Eligibility integrity:** Are required constraints evaluated explicitly, including unknown and conflicting states, rather than hidden in a general score?
- **Match/score integrity:** Are the same versioned inputs and formula reproducible? Are missing inputs disclosed? Are calibration and stability checked against reviewed fixtures?
- **Ranking integrity:** Are compared candidates assessed with sufficiently comparable evidence and completeness? Are tie/uncertainty rules followed?
- **Risk/recommendation integrity:** Are material risks and recommendation reasons traceable to evidence and explicit assumptions?
- **Action integrity:** Does the recorded user action match a confirmed persisted state or verified external outcome?
- **Learning integrity:** Is feedback attributable, consented where required, deduplicated, and separated from unconfirmed outcomes?

Each metric must identify its denominator. For example, “provider failure rate” should count provider operations that were attempted, not all user sessions. “Evidence coverage” should define the set of material claims assessed, not the number of arbitrary text fragments. “Activation success rate” should distinguish legitimate activation attempts from bots or repeat requests and should not be optimized by loosening authorization.

Do not use aggregate quality metrics to conceal subgroup or source-specific failures. Where sample sizes permit and privacy policy allows, inspect quality by source/provider, opportunity type, geography/market, device class, and product version. Avoid demographic or sensitive-personal-data segmentation unless specifically justified, lawful, approved, and necessary.

Metrics are diagnostic signals, not ground truth. They require sampled record review, deterministic test fixtures, and user feedback where appropriate. A high success rate does not prove the correctness of the underlying assessment.

### Question 4: What should be alerted on, retained, and exposed to operators versus users?

**Decision: D — Alert on actionable risk to trust or service; keep user messaging and protected operator diagnostics separate.**

Alerts should be tied to an action and owner, not merely a surprising graph. Initial alert families should include:

- sustained failure of a critical protected user journey;
- elevated provider timeouts, authentication/configuration errors, rate limits, or broad dependency unavailability;
- discovery returning unexplained empty outcomes or partial coverage above an agreed baseline;
- persistence errors or unconfirmed user actions;
- broken or missing telemetry from a critical pipeline stage;
- evidence/assessment contract violations or unexpected increases in unknown/incomplete assessments;
- activation anomalies, suspected abuse, or entitlement reconciliation failures;
- secret exposure indicators or unauthorized cross-user access signals;
- data migration or deployment regressions;
- material degradation after a release.

Each alert definition must specify severity, threshold/window, minimum sample size where relevant, deduplication/suppression behavior, owner, first response, escalation path, and recovery/closure criteria. Exact thresholds should be chosen from expected traffic, measured baseline, provider quota, and launch risk—not invented before observing the deployed system. Critical security signals may require immediate handling independent of statistical thresholds.

Use separate channels for:
- **Buyer-facing status:** plain language, minimum necessary detail, safe next step.
- **Operator diagnostics:** access-controlled, redacted, correlated details that help authorized staff investigate.
- **Product analytics:** minimized and, where practical, aggregated or pseudonymous information for product improvement.
- **Security/audit records:** separately protected events with retention and access rules defined by Stage 17.

Do not reveal a Tavily configuration issue, secret name/value, internal hostname, stack trace, raw provider payload, other user's identity, or security detection logic to an ordinary buyer. Conversely, do not make operator diagnostics so vague that authorized operators cannot distinguish a configuration failure from a genuine empty search.

Retention must be purpose-limited and documented. High-cardinality traces and verbose diagnostics may be retained for a shorter period than aggregated product metrics; security/audit retention follows Stage 17 policy. Redaction and minimization must occur before data reaches the telemetry sink wherever feasible, not only at dashboard display time.

### Question 5: How will measurement and quality signals prove readiness without gaming the system?

**Decision: D — Combine deterministic contract tests, representative quality review, telemetry validation, and explicit release evidence.**

Stage 20 must not accept “dashboard exists” or “all green” as proof that the product is trustworthy. Stage 18 requires a defined evidence set:

1. Event schemas and metric definitions are version-controlled and have clear owners.
2. Critical pipeline operations emit the required structured outcomes, including empty success, partial success, failure, cancellation, and recovery.
3. Correlation IDs link discovery through evidence, assessment, result presentation, and confirmed user action without exposing private payloads.
4. Tavily missing-key, invalid-key, rate-limit, timeout, partial response, valid empty response, and recovery cases are distinguishable in telemetry.
5. Secret scanning or equivalent checks demonstrate that telemetry and logs do not contain platform credentials, activation credentials, session tokens, or authorization headers.
6. User data isolation and access checks cover telemetry, exports, background jobs, and dashboards.
7. Stage 16 failure events and recovery signals are instrumented and reconciled against test outcomes.
8. Deterministic fixtures verify that eligibility, matching, score, ranking, risk, and recommendation outputs are reproducible under a recorded version and evidence snapshot.
9. A sample of real or appropriately anonymized test cases is reviewed for provenance, freshness, uncertainty, and misleading claims.
10. Activation and entitlement metrics are reconciled against trusted purchase/entitlement records; metrics never become the authority that grants access.
11. Persisted action/outcome metrics are based on confirmed durable records, not UI clicks alone.
12. Feedback metrics separate self-reported outcomes from independently verified outcomes and do not imply causal attribution.
13. Dashboard queries have known denominators, time windows, and handling of missing telemetry.
14. Alerts are tested using safe simulations or controlled fault injection, and responders know the action to take.
15. Release comparisons account for version changes and avoid interpreting small or biased samples as proof of improvement.
16. Known blind spots, data gaps, unresolved risks, and unmeasured behaviors are documented for Stage 20.

Metrics must not create incentives to mislead. Do not optimize for raw result count, low unknown rate, high activation success, or user conversion in isolation if doing so can encourage fabricated evidence, weak authorization, hidden uncertainty, or coercive UX. Quality indicators should be balanced with safety constraints and reviewed for gaming.

A passing architecture document does not prove instrumentation is deployed. Stage 19 implements and validates the telemetry path; Stage 20 assesses the resulting evidence.

---

## 3. Measurement architecture and ownership

### 3.1 Operational telemetry
Measures request/operation health, latency, retries, provider availability, persistence, and recovery. Event outcome semantics come from Stage 16. Production transport, storage, dashboards, and alert wiring are Stage 19 responsibilities.

### 3.2 Product analytics
Measures the product journey and voluntary interaction with key capabilities. Collect the minimum necessary data. Product analytics cannot grant access, update canonical opportunity truth, or serve as the only record of a user action.

### 3.3 Data and assessment quality
Measures evidence coverage/freshness, normalization anomalies, missing inputs, reproducibility, and stage-contract violations. Domain semantics remain owned by Stages 5–12. A quality metric may identify suspicious behavior but must not silently change a match score, eligibility decision, rank, or recommendation.

### 3.4 Security and audit telemetry
Stage 17 defines which security events are required, access-controlled, and retained. Stage 18 may define their safe operational measurement and alerting but must not weaken security policy or duplicate sensitive secrets into general product analytics.

### 3.5 Release and change telemetry
Tracks application version, configuration/schema version, migrations, and relevant deployments so a regression can be correlated with a change. It must not record secret values or expose deployment credentials.

---

## 4. Canonical event and metric rules

- Event names are stable, documented, and action-oriented (for example, `discovery.operation_completed`, `assessment.completed`, `user_action.persisted`, `entitlement.activation_denied`, `dependency.recovered`).
- Event names and fields are versioned. Incompatible changes require an explicit schema-version change and a migration/compatibility plan.
- Use timestamps with consistent timezone handling and account for clock skew where cross-service ordering matters.
- Use monotonic duration measurement for latency when the runtime supports it; wall-clock timestamps are for chronology, not elapsed-time arithmetic.
- Record event outcomes from the authoritative layer. A button click is not equivalent to a saved action; a checkout redirect is not equivalent to verified entitlement; a provider response is not equivalent to verified evidence.
- Include operation IDs and trace/correlation IDs to connect related steps, but do not use them as public authorization tokens.
- Prefer bounded-cardinality labels. Do not use raw user IDs, full URLs, free-text queries, opportunity descriptions, or exception messages as metric labels.
- Keep high-cardinality identifiers in protected traces/events when needed for debugging, not as unbounded metric dimensions.
- Treat external strings and provider responses as untrusted; sanitize log fields against newline/control-character injection and do not blindly render them in dashboards.
- Do not record full request/response bodies by default. Capture allowlisted, redacted fields only when there is a documented operational need.
- If telemetry delivery fails, core product behavior should continue when safe; telemetry loss must be visible as a monitoring blind spot and must not change domain outcomes.
- Security-critical audit events may have stricter durability requirements than ordinary product analytics; Stage 17 and Stage 19 define the specific implementation.
- **Preserve Stage 16 outcome semantics exactly.** Keep operation `status`, `failure_code`, and `denial_code` separate. A failed operation carries its normalized technical failure code; a correctly refused protected operation carries `DENIED` plus a denial code; a successful empty operation is not a failure; partial success carries explicit completeness context. Do not create a competing failure or denial taxonomy in analytics.
- The minimum normalized status set must distinguish `SUCCESS_WITH_RESULTS`, `SUCCESS_EMPTY`, `SUCCESS_PARTIAL`, `DENIED`, `FAILED`, `CANCELLED`, and `NOT_RUN`. Use Stage 16's technical failure codes (`CONFIGURATION_MISSING`, `AUTHENTICATION_FAILED`, `RATE_LIMITED`, `TIMEOUT`, `NETWORK_UNAVAILABLE`, `DEPENDENCY_UNAVAILABLE`, `INVALID_RESPONSE`, `VALIDATION_FAILED`, `PERSISTENCE_FAILED`, `PROCESSING_FAILED`, and `UNKNOWN_FAILURE`) only for `FAILED` operations. Use its denial codes (`AUTHENTICATION_REQUIRED`, `INVALID_CREDENTIAL`, `ENTITLEMENT_INACTIVE`, `RESOURCE_NOT_OWNED`, `POLICY_BLOCKED`, `ABUSE_LIMITED`, `UNTRUSTED_EVENT`, and `UNKNOWN_DENIAL`) only for `DENIED` outcomes. `PARTIAL_RESULT` is a coverage/degradation reason, not a failure code when valid partial output is returned: record `SUCCESS_PARTIAL` plus the structured reason. Only use it as `failure_code` when an explicit minimum-coverage contract makes the operation `FAILED`. `CANCELLED` is a status, not a failure code.
- A recovery event must link to the affected operation or incident without overwriting or deleting the original failure event. Retries and recovery must remain observable, and repeated delivery must be idempotently deduplicated.
- Sampling may be used for high-volume traces only if required events, critical failures, security/audit events, and release-gate evidence are not accidentally sampled away.
- Deduplicate retried event delivery using stable event IDs or idempotent ingestion semantics where appropriate.
- Keep telemetry distinct from the canonical domain database and never use analytics as the sole source of truth for entitlements, lifecycle, evidence, or user decisions.

---

## 5. Minimum first-release signal set

Stage 19 should implement the smallest signal set that allows the team to detect dangerous failures and diagnose them. The following are mandatory semantic signals; exact tool/vendor and numerical alert thresholds remain implementation decisions.

| Signal | Definition | Why it matters | Primary owner |
|---|---|---|---|
| Protected request outcome | Authorized/denied/failed by normalized reason category | Detects access and service failure without equating denial with outage | Stages 17–19 |
| Activation funnel outcome | Verified purchase/entitlement, activation attempt, activation success/denial, session established | Reveals buyer access friction without weakening entitlement | Stages 17–19 |
| Discovery outcome | Complete success, valid empty success, partial success, failed, cancelled | Prevents outages being misread as no opportunities | Stages 4, 16, 18–19 |
| Per-provider latency/failure | Attempted calls by dependency and normalized result | Identifies a broken provider such as Tavily | Stages 4, 16, 18–19 |
| Evidence completeness/freshness | Material evidence coverage and source-specific age bands | Shows whether recommendations are grounded and current | Stages 5, 11–12, 18 |
| Pipeline stage completion | Started/completed/failed with correlated operation ID | Finds silent drop-offs and broken handoffs | Stages 3–12, 16, 18–19 |
| Assessment reproducibility | Output can be regenerated from recorded version and input/evidence references | Supports regression diagnosis and deterministic evaluation | Stages 7–12, 18–20 |
| User action persistence | Requested versus confirmed durable outcome | Prevents false “saved/applied” states | Stages 13, 15–16, 18–19 |
| Feedback integrity | Accepted/rejected/deduplicated/failed, with consent and source semantics | Avoids learning from invalid or duplicate outcomes | Stage 14, 17–19 |
| Telemetry pipeline health | Event delivery lag, ingestion failure, missing critical event family | Prevents false confidence from a silent monitoring failure | Stages 18–19 |
| Release/configuration change | Version, schema/migration version, deployment outcome | Correlates regressions with changes | Stages 18–20 |

Metrics must not retain raw API keys, buyer activation credentials, session cookies/tokens, payment details, unnecessary personal data, or unredacted private opportunity notes.

---

## 6. Quality review method

The product should use three complementary review methods:

1. **Deterministic fixtures:** Known inputs and evidence snapshots with expected behavior for eligibility, match, score, rank, risk, and recommendation. These catch unintended changes and support regression tests.
2. **Representative case review:** Human review of a stratified sample of opportunities to assess evidence provenance, source freshness, missing/conflicting information, normalization, misleading certainty, and usefulness. Include difficult cases, not only successful examples.
3. **Production signal review:** Trends in failures, partial coverage, unknowns, user corrections, stale records, and confirmed action outcomes. Investigate rather than automatically treating a correlation as causation.

Where a metric indicates possible systematic bias or a quality regression, route the issue to the owning domain stage. Stage 18 must not unilaterally change algorithmic weights or suppress a source because its metrics are inconvenient. Any algorithmic or policy change requires the relevant stage's explicit decision, versioning, tests, and downstream review.

A high user click-through or positive rating is not proof of factual correctness. A low complaint rate may reflect poor reporting affordances rather than good quality. User-reported outcomes must be labeled as self-reported unless independently verified.

---

## 7. Privacy, security, and access-control requirements

Stage 17 is authoritative for security and privacy policy. Stage 18 must comply with and operationalize it.

- Minimize event attributes; collect no sensitive field merely because it is available.
- Pseudonymize user identifiers in product analytics when individual-level tracing is not required.
- Keep security/audit logs, product analytics, and operational traces under appropriate separate access controls.
- Restrict dashboards and drill-down views by role and operational need.
- Do not expose one buyer's behavior, searches, opportunities, or decisions to another buyer or to community members.
- Do not send activation keys, session tokens, provider credentials, authorization headers, or raw secrets to telemetry.
- Avoid raw search text and private opportunity details in general-purpose logs; use safe classifications or protected references instead.
- Apply documented retention/deletion rules to event stores, backups, exports, and derived datasets.
- Ensure user deletion or account closure is propagated to analytics/derived stores as required by Stage 17 policy and applicable obligations.
- Protect dashboards and alert destinations; alerts themselves can contain sensitive operational context.
- Do not use analytics identifiers as authentication or entitlement credentials.
- If external analytics vendors are used, Stage 19 must document data flow, configuration, retention, access, and any cross-border processing for Stage 20 review.

---

## 8. Handoff contracts

### From Stages 1–3
Stage 18 inherits product trust/accessibility principles, the user journey, and canonical domain/system contracts. It must not invent new domain state or treat telemetry as the authoritative domain record.

### From Stages 4–6
Stage 18 receives provider identity, discovery coverage, retrieval timestamps, original-source provenance, evidence lineage, freshness, canonicalization decisions, and duplicate/uncertain-identity outcomes. Provider health is not evidence credibility.

### From Stages 7–12
Each stage remains authoritative for its eligibility, matching, scoring, ranking, intelligence, quality, risk, and recommendation semantics. Stage 18 measures completeness, reproducibility, anomalies, and reviewed quality; it does not redefine those algorithms.

### From Stages 13–15
Distinguish user intent, action request, confirmed persistence, feedback/outcome reporting, and opportunity lifecycle transitions. A click is not a persisted action; a saved opportunity is not proof of external application; an application report is not independently verified unless supported.

### From Stage 16
Use the normalized failure taxonomy, operation-result envelope, completeness states, correlation identifiers, retry/recovery events, and safe degradation semantics. Stage 18 may add metrics but must not invent conflicting failure categories.

### From Stage 17
Use privacy minimization, access control, secret redaction, retention, audit separation, and buyer-entitlement semantics. Analytics must never grant access or become a backdoor around authorization.

### To Stage 19
Provide implementable event schemas, minimum signal set, metric definitions, safe dimensions, retention needs, alert intent, and telemetry health requirements. Stage 19 chooses the stack and wires instrumentation while preserving these semantics.

### To Stage 20
Provide acceptance evidence requirements, quality-review method, dashboard/alert validation criteria, known blind spots, and release-comparison expectations. Stage 20 decides whether evidence is sufficient for launch.

---

## 9. Required acceptance criteria

Stage 18 is architecturally acceptable only when:

- [ ] Measurement layers and their owners are explicit.
- [ ] Critical events have stable names, schema versions, timestamps, and correlation semantics.
- [ ] Success-with-results, valid-empty, partial, failed, cancelled, and not-run outcomes remain distinguishable.
- [ ] Metrics have defined units, denominators, windows, owners, and interpretations.
- [ ] Operational health is not conflated with evidence quality, match fit, opportunity quality, or user outcomes.
- [ ] Minimum first-release signals cover buyer access, discovery, evidence, assessment, persistence, failure/recovery, and telemetry health.
- [ ] Tavily configuration failure is distinguishable from valid empty discovery.
- [ ] Provider metadata is not treated as evidence credibility.
- [ ] Assessment outputs can be tied to versioned inputs/evidence for reproducibility.
- [ ] User actions and external outcomes are measured only at the correct confirmation level.
- [ ] Telemetry cannot grant entitlement or alter canonical domain state.
- [ ] Secret and personal-data minimization rules are explicit and consistent with Stage 17.
- [ ] Alert thresholds have owners and are based on observed baselines and risk; ungrounded numbers are not fabricated.
- [ ] Telemetry loss itself is detectable.
- [ ] Deterministic fixtures and representative case reviews are required.
- [ ] Stage 19 has implementation/test ownership and Stage 20 has explicit evidence gates.
- [ ] The document does not claim deployed instrumentation, validated dashboards, or passing runtime tests.

---

## 10. Final architecture decision

**Selected: D — A layered, privacy-preserving observability and quality system using versioned structured events, explicit denominators, domain-owned quality semantics, actionable alerts, and evidence-based release review.**

This is the strongest fit because THE CLIENT OPPORTUNITY MATCHER™ is not merely a search interface. Its trustworthiness depends on knowing whether discovery actually completed, whether the evidence is current and traceable, whether assessments are reproducible, whether access remained secure, and whether user actions were truly persisted. A layered measurement model can expose those failures without collapsing them into one misleading score or introducing an oversized analytics stack before traffic justifies it.

**Completion boundary:** Stage 18 architecture is specified here. Instrumentation, dashboards, alerts, retention enforcement, telemetry security, and runtime quality validation remain implementation and verification work for Stage 19 and the Stage 20 release gate.
