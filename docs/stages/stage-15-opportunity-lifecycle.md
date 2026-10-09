# Stage 15 — Opportunity Lifecycle Architecture

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Creator attribution:** by Terrence  
**Repository:** THE-CLIENT-OPPORTUNITY-MATCHER  
**Branch:** main  
**Previous stage:** Stage 14 — Feedback & Learning  
**Next stage:** Stage 16 — Failure, Degradation & Recovery  
**Status:** STAGE 15 — ARCHITECTURE CONSOLIDATED; IMPLEMENTATION AND RUNTIME VALIDATION NOT CLAIMED  
**Architecture decision set:** D / D / D / D / D

---

## 1. Responsibility and criticality

Stage 15 defines the lifecycle of an opportunity as it moves through discovery, assessment, presentation, user decisions, follow-up, outcome reporting, and eventual closure or reactivation. It specifies canonical lifecycle states, legal transitions, transition triggers, stale-context behavior, history, and interactions with assessment and user-action states.

Lifecycle is the long-lived record of where an opportunity stands in the user's workflow. It is not a substitute for eligibility, match score, rank, quality, risk, recommendation, a user action, an external application outcome, or the technical health of the system. Each remains an independently owned state.

Stage 15 is a critical stage because conflating these states can make an opportunity disappear, falsely imply an application was submitted, mark a user-declined opportunity as objectively poor, or present expired information as actionable. This document defines architecture and test requirements; it does not claim a functioning lifecycle engine or production persistence.

## 2. Governing question

**How should each canonical opportunity progress through a user's workflow while preserving the distinction between system assessment, user intent, external events, and technical execution?**

The lifecycle must be deterministic, explainable, recoverable, and reversible where policy allows. It must preserve history rather than silently rewriting what the user previously saw or chose.

## 3. Five architecture decisions

1. **What is the lifecycle unit? — D: A versioned user–opportunity relationship linked to a canonical opportunity.** The source opportunity is globally identified through Stage 6; lifecycle is scoped to the relevant user's workflow and context. A single canonical opportunity may be new to one user and already saved, passed, or closed by another. Do not put user-specific lifecycle state on a globally shared source record.

2. **How are lifecycle states represented? — D: A finite state machine with explicit transition contracts.** Each state has a definition, entry criteria, permitted transitions, required evidence, actor/trigger, and audit event. Unknown, invalid, or unsupported transitions must be rejected or quarantined with a reason rather than guessed.

3. **How do user actions and outcomes affect lifecycle? — D: Explicit event-driven transitions with confirmation-aware outcomes.** Stage 13 action records may request transitions; only observed, authorized results may establish action completion or external outcomes. Apply intent does not equal submitted application, and a user-reported outcome remains reported unless appropriately verified.

4. **How are stale, expired, duplicated, or changed opportunities handled? — D: Preserve identity/history and represent material change explicitly.** Re-normalization and deduplication follow Stage 6; evidence freshness and claims follow Stage 5; lifecycle records reference revisions and show material changes. Closed or expired records do not silently become current again. Reopening requires a defined trigger and a new auditable event.

5. **How are transitions made reliable? — D: Idempotent event processing, version checks, and recoverable transition records.** Duplicate delivery must not create duplicate logical transitions. Conflicting concurrent updates must be detected. Persistence and cross-system recovery mechanics belong to Stages 16 and 19, but their contracts must support this lifecycle's integrity requirements.

## 4. State separation: non-negotiable model

The product must maintain distinct state dimensions:

- **Opportunity source state:** what the source currently reports, including publication/availability and source revision, governed by Stages 4–6.
- **Assessment state:** eligibility, fit, score, rank, intelligence, quality, risk, and recommendation, governed by Stages 7–12.
- **User action state:** Apply, Save, Pass, Verify intent and its recorded/external result, governed by Stage 13.
- **Lifecycle state:** the user's workflow position for this opportunity, governed by Stage 15.
- **External outcome state:** whether a supported external system or reliable evidence confirms application submission, reply, meeting, engagement, hire, rejection, or another defined outcome.
- **Feedback state:** feedback event quality and permitted learning use, governed by Stage 14.
- **Operational state:** loading, provider failure, storage failure, recovery, or degraded service, governed by Stage 16 and observed by Stage 18.

These dimensions must never be flattened into one universal status. Examples:
- SAVED does not mean ELIGIBLE.
- APPLY_REQUESTED does not mean APPLICATION_SUBMITTED.
- PASSED does not mean LOW_QUALITY.
- EXPIRED does not mean INELIGIBLE.
- ASSESSMENT_DEGRADED does not mean the opportunity is objectively bad.
- REPORTED_HIRED does not mean HIRED_VERIFIED.
- CLOSED does not delete historical assessment or action records.

## 5. Lifecycle scope and canonical relationship

The lifecycle record represents the relationship between one authorized user/workspace context and one canonical opportunity. The minimum conceptual identity is:

- canonical opportunity ID from Stage 6;
- authorized user or workspace scope under Stage 17;
- lifecycle record ID;
- current lifecycle state and lifecycle schema version;
- optimistic-concurrency revision/version;
- created, updated, and state-entered timestamps where supported;
- originating discovery/source reference and first-seen context;
- action-event references from Stage 13;
- assessment snapshot/version references from Stages 7–12;
- material-change, expiration, and reactivation events;
- outcome records and their reported/verified status;
- state-transition history and reason codes;
- source/evidence freshness metadata references;
- retention and access policy references under Stage 17.

Avoid copying entire source listings, user profiles, private notes, or sensitive correspondence into every lifecycle transition. Prefer stable references and minimal snapshots needed to preserve the context of a user decision. Stage 17 governs access, retention, and deletion; Stage 19 governs durable storage and integration.

If the same canonical opportunity is surfaced by multiple sources, Stage 6 owns canonical identity and duplicate lineage. Stage 15 must not create duplicate user workflows solely because a source copy was rediscovered. Source-specific observations may remain attached as evidence or provenance references.

## 6. Canonical lifecycle state vocabulary

Use these primary lifecycle states for the user–opportunity relationship. Implementations may introduce a documented extension only if it does not collapse the independent state dimensions defined above.

| State | Meaning | Entry condition |
|---|---|---|
| DISCOVERED | A canonical opportunity has been surfaced for this user/context but has not yet entered an explicit saved or actioned workflow state | Discovery result accepted and canonical identity resolved |
| IN_REVIEW | The opportunity is being considered or its evidence/assessment is being reviewed | Explicit navigation/review event or a defined product rule supported by actual behavior |
| SAVED | The user has explicitly retained the opportunity for later consideration | Valid Stage 13 Save action successfully recorded |
| VERIFICATION_PENDING | A material question has been raised and needs evidence/reassessment before a consequential decision | Verify request recorded with a defined question or unresolved material item |
| READY_FOR_USER_DECISION | The current assessment and action policy permit the opportunity to be presented for an informed user decision | Required current assessments exist and Stage 13 action policy permits decision; this is not itself a recommendation |
| ACTION_INITIATED | The user has initiated an action such as Apply, but completion is not yet confirmed | Explicit action intent recorded; action result still pending or unresolved |
| AWAITING_EXTERNAL_OUTCOME | The product has evidence that the relevant external action occurred, but the next meaningful outcome is pending | Supported external handoff/submission result confirmed at the appropriate level |
| FOLLOW_UP_DUE | A defined, user-authorized follow-up is due according to an explicit date/rule | A follow-up date or trigger exists; no inference from silence alone |
| OUTCOME_REPORTED | The user or a source reports an outcome, but the product has not verified it to the defined standard | Outcome report recorded with its reported/unverified status |
| CLOSED | The user–opportunity workflow has been intentionally ended for the current lifecycle episode | Explicit user decision or defined terminal policy event with reason |
| EXPIRED_OR_UNAVAILABLE | The opportunity's relevant external availability has expired or is no longer available according to sufficient current evidence | Verified expiry/removal/closure or an authoritative source state; uncertainty must remain visible |
| ARCHIVED | The record is retained for historical reference but removed from active workflow surfaces | Explicit archive action or authorized retention/lifecycle policy |

DISCOVERED, IN_REVIEW, and READY_FOR_USER_DECISION describe workflow position, not eligibility. VERIFICATION_PENDING does not mean evidence is being successfully fetched; technical execution is a separate operational state. ACTION_INITIATED is intentionally weaker than external completion. OUTCOME_REPORTED preserves the distinction between a report and verified outcome.

The primary lifecycle state must not be used to encode every possible external outcome. Keep a separate outcome type/status (for example REPLY_RECEIVED / REPORTED, MEETING_BOOKED / VERIFIED, HIRED / USER_REPORTED, REJECTED / VERIFIED) when outcome tracking is supported.

## 7. Transition contract

Each transition must specify: source state(s), event/actor, preconditions, resulting state, side effects, idempotency key, audit event, failure behavior, and whether the transition can be reversed. The following is the default transition policy; any exception must be documented and tested.

| From | Trigger | To | Guardrails |
|---|---|---|---|
| New relationship | Canonical discovery accepted | DISCOVERED | Do not duplicate an existing active relationship |
| DISCOVERED | User opens/reviews opportunity | IN_REVIEW | Do not infer review from a failed render |
| IN_REVIEW or DISCOVERED | Save recorded successfully | SAVED | Save is a user choice, not endorsement |
| SAVED | User resumes review | IN_REVIEW | Preserve save history |
| DISCOVERED or IN_REVIEW or SAVED | Verify request recorded | VERIFICATION_PENDING | Require a specific material question where applicable |
| VERIFICATION_PENDING | Evidence assessed and action policy permits decision | READY_FOR_USER_DECISION or IN_REVIEW | Only owning stages can update evidence/eligibility/recommendation |
| DISCOVERED or IN_REVIEW or SAVED | Current assessment/action policy permits informed decision | READY_FOR_USER_DECISION | Never derive readiness from rank or score alone |
| READY_FOR_USER_DECISION | Apply intent recorded | ACTION_INITIATED | Not proof of submission |
| ACTION_INITIATED | External submission/handoff confirmed at defined level | AWAITING_EXTERNAL_OUTCOME | Use the exact confirmation level; opening a page is not submission |
| ACTION_INITIATED | Action blocked/failed/unknown | Prior safe state or IN_REVIEW with explicit action status | Follow Stage 16 recovery; do not falsely advance |
| AWAITING_EXTERNAL_OUTCOME | Authorized follow-up date/trigger becomes due | FOLLOW_UP_DUE | Requires explicit rule/date; avoid unsupported reminders |
| Any nonterminal state | User reports an outcome | OUTCOME_REPORTED | Preserve report status and provenance |
| OUTCOME_REPORTED | Outcome is independently verified | Appropriate active/closed state under policy | Verification updates the outcome record, not unrelated assessment states |
| Any active state | User passes/ends current consideration | CLOSED | Record explicit reason only if provided or policy-defined |
| Any active state | Sufficient authoritative evidence establishes expiry/removal | EXPIRED_OR_UNAVAILABLE | Distinguish confirmed unavailability from stale/missing source |
| CLOSED | User explicitly reopens or a documented new episode is initiated | IN_REVIEW or DISCOVERED | Create a new episode or revision; preserve prior closure |
| EXPIRED_OR_UNAVAILABLE | Authoritative source shows a new/current opportunity revision | DISCOVERED or IN_REVIEW | Verify canonical identity and new availability; do not silently resurrect stale record |
| Any nonterminal state | User archives record | ARCHIVED | Preserve history subject to Stage 17 retention rules |
| ARCHIVED | User explicitly restores record and policy permits | DISCOVERED or IN_REVIEW | Revalidate freshness/availability before presenting as actionable |

If a transition's preconditions are not met, reject it with a stable reason code and retain the current valid state. Where the underlying event is valid but required dependencies are unavailable, preserve it as pending/failed processing according to Stage 16 instead of fabricating the target state.

## 8. Terminality, closure, and reactivation

A lifecycle episode may be ended without declaring the opportunity globally bad or deleting it. Closure reasons should distinguish, when known:

- user passed or no longer wishes to pursue;
- application submitted and user no longer needs active tracking;
- verified outcome concluded the episode;
- opportunity expired or source confirmed it unavailable;
- duplicate relationship merged under Stage 6;
- user archived the record;
- policy/retention action requires removal from active surfaces.

A closure reason is not required to invent a user explanation. If the user simply chooses Pass, record the choice without assigning a motive.

CLOSED, EXPIRED_OR_UNAVAILABLE, and ARCHIVED are not interchangeable:
- Closed is a workflow decision/end of the current episode.
- Expired/unavailable is a source-availability condition based on evidence.
- Archived is a presentation/retention workflow choice.

Reactivation must be explicit and evidence-aware. A closed episode may be reopened by the user when policy permits. An expired opportunity may return only when an authoritative source or a genuinely new revision supports current availability. Rediscovery alone is insufficient if it is merely a duplicate, stale cache, or previously closed copy. Keep the prior state and reason in history.

## 9. Assessment changes and stale lifecycle context

The lifecycle state does not freeze an opportunity's factual status. When material upstream data changes, Stage 15 must attach a change event and make affected active records eligible for reassessment.

Material changes include:
- application deadline or publication/availability changes;
- scope, requirements, budget, location, work mode, or other material listing fields change;
- source identity/canonicalization changes;
- evidence is corrected, withdrawn, contradicted, or becomes stale;
- user profile, declared constraints, or Hunt context changes;
- eligibility, fit, score, rank, quality, risk, or recommendation changes materially;
- action destination or external confirmation status changes.

Rules:
- Preserve the assessment and evidence snapshot that supported a past decision.
- Trigger a new assessment through the relevant owning stages rather than mutating the historical result.
- Distinguish assessment stale, assessment pending, assessment failed, and assessment refreshed.
- Do not automatically reopen a closed lifecycle episode because an assessment changed.
- Do not automatically turn a saved opportunity into Apply-ready because its score rose.
- If eligibility becomes uncertain/ineligible or a material risk emerges, Stage 13's current action policy must withhold or constrain Apply as appropriate; lifecycle state cannot override it.
- If a previously unavailable opportunity appears active again, require authoritative freshness and canonical revision checks before reactivation.
- A material change should be presented with enough context for the user to understand why a previous assessment or action may no longer apply.

## 10. Follow-up and outcome semantics

Follow-up is optional workflow support, not an assumed behavior of every opportunity. A follow-up event requires a defined trigger such as a user-entered date, an explicitly authorized schedule, or a supported integration event. Do not invent deadlines, assume an application was submitted, or infer that silence means rejection.

Outcome types may include, if the product supports them:
- application submitted;
- acknowledgement received;
- reply received;
- meeting/interview scheduled;
- proposal/request for more information received;
- engagement or contract started;
- hired/won;
- rejected/lost;
- no response after a defined period;
- withdrawn by the user;
- opportunity expired or closed by the source.

Each outcome record must distinguish:
- reported by user;
- observed from authorized integration/source;
- independently verified;
- disputed or conflicting;
- unknown/not available.

These states must have documented verification criteria. A user report is a valid record of what the user said, but it is not automatically an independently verified external fact. A source event may confirm only what the source actually exposes. Do not generalize one outcome into a claim about future success probability without Stage 14's governed evaluation and Stage 12's permitted recommendation semantics.

## 11. Concurrency, idempotency, and history

- Assign stable IDs to lifecycle records, episodes, and transition events.
- Every transition must include the record revision it expects to change. Reject or reconcile stale writes rather than silently overwriting newer state.
- Duplicate event delivery must be idempotent. The same Save, Apply intent, external webhook, or expiry notification must not create duplicate transitions or side effects.
- Use stable idempotency keys for transitions triggered by integrations or retried requests.
- Preserve an append-oriented transition history containing prior state, requested event, accepted/rejected result, resulting state, timestamp, actor/source category, reason code, and policy/schema version as applicable.
- Corrections and reversals must be explicit linked events, not destructive edits to the historical record.
- Keep event time, receipt time, and processing time distinct when delayed events matter.
- When events arrive out of order, use documented event-time and authority rules; do not simply let the last-arriving message win.
- If two valid transitions conflict, resolve through a deterministic, documented precedence or mark the record conflicted for recovery/review. Do not guess.
- Stage 19 owns storage and transaction implementation; Stage 16 owns cross-system recovery. Stage 15 specifies the invariants they must preserve.

## 12. User experience and accessibility

- Show a plain-language lifecycle label and the relevant next step without collapsing assessment and action states.
- Where useful, show a short explanation of why the record entered its current state.
- Clearly distinguish confirmed external progress from pending, reported, or unknown outcomes.
- Make material changes, expired availability, stale assessment, and unresolved verification visible before consequential actions.
- Provide accessible controls for saving, resuming, closing/passing, archiving, reopening, and reporting outcomes when supported.
- Avoid overloading users with internal machine states. Map internal reason codes to concise, accurate user-facing explanations.
- Do not rely on color alone; follow the locked Stage 2 visual system, keyboard operation, focus visibility, labels, and WCAG 2.2 AA requirements.
- Keep mobile-first navigation and actions low-friction without hiding evidence or limitations.
- Do not show a false submitted, verified, closed-by-source, or success label before the responsible layer confirms it.
- If lifecycle persistence fails, communicate the actual result and follow Stage 16 recovery rather than showing a durable success state.

## 13. Privacy, retention, and access boundaries

Lifecycle records can reveal a user's prospecting behavior, professional priorities, application history, and outcomes. Therefore:
- enforce Stage 17 authorization at every read/write boundary;
- isolate user-specific workflow records from other users' views;
- collect and retain only necessary lifecycle/action/outcome data;
- define retention and deletion behavior for active, closed, archived, and deleted-user records under Stage 17 policy;
- do not place API keys, session credentials, private tokens, or unnecessary correspondence in lifecycle events;
- ensure analytics receives only permitted, appropriately minimized data;
- honor export, correction, and deletion requirements as defined by Stage 17 and the actual storage architecture;
- do not imply that archiving is deletion or that closing an opportunity erases its audit history.

Stage 15 does not define its own access-control system or promise deletion semantics that have not been implemented.

## 14. Failure and exception handling

- **Canonical identity unresolved:** do not create a second active lifecycle record from an ambiguous duplicate; preserve the unresolved identity state for Stage 6/recovery.
- **Required assessment missing:** keep the opportunity in a safe review/verification state; do not infer readiness.
- **Eligibility or recommendation changes during action:** Stage 13 rechecks current policy before consequential action; preserve prior lifecycle history.
- **Action result unknown:** keep action state unknown and avoid blind retries; follow Stage 16.
- **External event duplicated:** idempotently record the event without repeating side effects.
- **Events arrive out of order:** apply documented ordering/authority rules or flag conflict; do not overwrite a more authoritative state arbitrarily.
- **Source listing disappears:** distinguish authoritative removal/expiry from provider outage, access failure, or stale cache.
- **Expired record appears in a new source:** canonicalize and verify the new revision before reactivation.
- **Persistence failure:** do not claim a transition was saved; surface true status and recover according to Stage 16/19.
- **Concurrent edits:** reject or reconcile using version checks and explain if a user's action could not be applied.
- **Invalid transition:** reject with a stable machine-readable reason and retain current valid state.
- **Feedback conflicts with outcome record:** preserve reported and verified dimensions separately and route learning use through Stage 14.
- **Privacy/deletion request:** follow Stage 17 policy and ensure lifecycle state does not bypass required retention/deletion handling.

## 15. Implementation qualification matrix

These are required tests, not tests claimed to have run.

| ID | Scenario | Required result |
|---|---|---|
| LC-01 | New canonical opportunity is discovered for a user | One relationship enters DISCOVERED |
| LC-02 | Same opportunity is rediscovered from a second source | Canonical deduplication prevents duplicate active relationship |
| LC-03 | User opens a valid discovered record | State transitions to IN_REVIEW only on the defined event |
| LC-04 | Save is recorded successfully | State becomes SAVED; history preserves the action |
| LC-05 | Save persistence fails | No false SAVED success state; recovery status is explicit |
| LC-06 | User requests Verify for a material claim | VERIFICATION_PENDING records the question and evidence references |
| LC-07 | Eligibility is uncertain | Lifecycle cannot promote opportunity to action-ready against Stage 13 policy |
| LC-08 | Apply intent is recorded but external result is unknown | ACTION_INITIATED remains distinct from submission confirmation |
| LC-09 | Authorized integration confirms submission | Transition to AWAITING_EXTERNAL_OUTCOME at the exact confirmed level |
| LC-10 | User reports a hire without independent verification | Outcome remains reported/unverified |
| LC-11 | Source confirms the deadline has passed | State reflects expiry/unavailability with source evidence |
| LC-12 | Provider outage makes listing unreachable | Do not falsely mark the opportunity expired |
| LC-13 | Closed opportunity is rediscovered as a duplicate | No silent reactivation or loss of closure history |
| LC-14 | Authoritative new revision makes an expired opportunity active | Explicit, auditable reactivation after identity/freshness checks |
| LC-15 | Duplicate external webhook is delivered | Idempotent processing; no duplicate transition |
| LC-16 | Two concurrent transitions target the same revision | Stale/conflicting write is rejected or deterministically reconciled |
| LC-17 | External events arrive out of order | Documented ordering/authority rules preserve correct state |
| LC-18 | User archives an opportunity | ARCHIVED is distinct from CLOSED and deletion |
| LC-19 | Material assessment changes after Save | Historical snapshot remains; stale/reassessment context is visible |
| LC-20 | Invalid transition is requested | Transition is rejected with stable reason code |
| LC-21 | User-specific lifecycle record is requested by another user | Stage 17 authorization denies access |
| LC-22 | User requests deletion/retention action | Stage 17 policy is applied without archiving being misrepresented as deletion |
| LC-23 | User passes an opportunity | Closure records user choice without invented motive or quality verdict |
| LC-24 | Follow-up date has not been explicitly defined | System does not invent a due date or imply follow-up is scheduled |
| LC-25 | Lifecycle store is degraded | No false durable success; status and recovery path are truthful |

### Qualification rule

Stage 15 is implementation-qualified only after the state machine, persistence, authorization, idempotency, recovery, and applicable accessibility tests have been executed with recorded results. The matrix defines acceptance expectations; it does not establish that runtime behavior exists.

## 16. Acceptance checklist

- [x] Lifecycle is defined as a user–canonical-opportunity relationship.
- [x] Lifecycle is explicitly separate from source availability, assessments, user actions, external outcomes, feedback, and operational health.
- [x] A canonical primary state vocabulary and entry criteria are defined.
- [x] Allowed transitions and their guards are specified.
- [x] Closure, expiration, archive, reactivation, and new lifecycle episodes are distinct.
- [x] Assessment changes preserve historical snapshots and trigger appropriate reassessment.
- [x] User-reported outcomes are not mislabeled as independently verified.
- [x] Follow-up requires explicit rules or dates; silence is not treated as an outcome.
- [x] Concurrency, idempotency, out-of-order events, and transition history are addressed.
- [x] Access, privacy, retention, and deletion remain Stage 17 responsibilities.
- [x] Twenty-five implementation qualification cases are defined without claiming execution.
- [x] The Stage 16 recovery and Stage 19 persistence/integration handoffs are explicit.
- [x] No runtime implementation or production readiness is claimed.

## 17. Cross-stage handoff contract

**Stage 15 consumes:** canonical opportunity identity/revisions from Stage 6; source availability and evidence freshness from Stages 4–5; assessment snapshots and current action-policy context from Stages 7–12; explicit action records and observed result states from Stage 13; feedback/outcome provenance from Stage 14; authorized source/integration events from Stage 19; and privacy/access rules from Stage 17.

**Stage 15 creates:** user-scoped lifecycle records; a validated state machine; transition events and history; closure/reactivation reasons; stale-context indicators; follow-up state when explicitly configured; outcome references with reported/verified status; and lifecycle events for the authorized analytics path.

**Stage 15 guarantees:** no lifecycle state overrides eligibility; no action intent is represented as external completion; no report is represented as verified without appropriate evidence; no closure is silently erased; no source outage is mistaken for expiry; no duplicate canonical opportunity creates duplicate active workflow; no invalid transition is guessed; and no persistence/recovery success is claimed before confirmation.

**Stage 16 receives:** transition failure modes, pending/unknown event states, idempotency and reconciliation requirements, and explicit recovery expectations.

**Stage 18 receives:** permitted lifecycle event definitions and quality indicators without turning analytics into an authorization or assessment authority.

**Stage 19 receives:** required persistence, transaction, event-ingestion, integration, concurrency, idempotency, and confirmed external-outcome contracts.

**Stage 20 verifies:** legal transition behavior, state separation, stale-context handling, source expiry versus outage, access isolation, action/outcome truthfulness, history preservation, and all applicable executed test results.

## 18. Final Stage 15 architecture gate

**Architecture disposition: READY FOR STAGE 16 HANDOFF, subject to implementation qualification.**

The lifecycle contract is explicit, versionable, and consistent with the authority boundaries of Stages 1–14. It defines states, transitions, event integrity, outcome verification, and required implementation tests. This is a documentation-level architecture disposition only; it is not proof of a working state machine, persistent storage, production integration, or successful runtime tests.

**Next stage:** Stage 16 — Failure, Degradation & Recovery.  
**Next permitted action:** define cross-system failure semantics, degradation policy, retries, idempotency, recovery, reconciliation, and truthful user-visible status across the existing architecture.

---

## Consolidation record

This file is the single authoritative Stage 15 specification. Stage decisions, transition rules, acceptance criteria, and handoff details belong here rather than in separate redundant Stage 15 documents. The product remains one application in one repository, with one substantive commit per stage.
