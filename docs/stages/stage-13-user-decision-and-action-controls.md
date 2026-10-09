# Stage 13 — User Decision & Action Controls Architecture

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Creator attribution:** by Terrence  
**Repository:** THE-CLIENT-OPPORTUNITY-MATCHER  
**Branch:** main  
**Previous stage:** Stage 12 — Opportunity Quality, Risk & Recommendation  
**Next stage:** Stage 14 — Feedback & Learning  
**Status:** STAGE 13 — COMPLETED (ARCHITECTURE CONSOLIDATED; IMPLEMENTATION NOT CLAIMED)  
**Assistant-selected decision set:** **D / D / D / D / D**

---

## 1. Responsibility and stage classification

Stage 13 turns the upstream opportunity assessment into clear, explicit, user-controlled decisions and records the user's chosen action without rewriting the evidence or making the decision on the user's behalf.

The primary actions remain the product-journey contract: **Apply, Save, Pass, Verify**. Stage 13 owns the meaning, availability, confirmation, recording, and immediate user-facing result of these actions. It does not own upstream eligibility, fit, ranking, quality, risk, or recommendation calculations; learning from outcomes; lifecycle policy; cross-system recovery; security policy; analytics; or production integrations.

Stage 13 is a **CRITICAL STAGE**. Poor action semantics can convert uncertain evidence into premature action, misrepresent an action as completed, or undermine user agency. The control contract must be explicit, auditable, accessible, and consistent with Stages 1–12.

This is an architecture contract only. It does not claim a working interface, external application submission, persistent production storage, or runtime verification.

## 2. Governing question

**“How does the user make an informed, explicit decision about an opportunity, and how do we faithfully record and communicate that decision without altering upstream evidence or overstating what actually happened?”**

The user retains final decision authority within the product's declared eligibility and action-safety boundaries. A recommendation is not consent; a button click is not proof that an external application was submitted.

## 3. Five architecture decisions and selected answers

1. **How should user actions be represented? — D: An explicit action contract and action registry.** Define Apply, Save, Pass, and Verify as distinct, typed user decisions with clear meaning, preconditions, confirmation needs, resulting state, and audit fields. Do not treat clicks, views, or recommendation states as equivalent to a user decision.

2. **How should actions respect eligibility and recommendation? — D: Eligibility-gated, recommendation-aware action controls.** Stage 7 eligibility is the hard-constraint authority. Stage 12's quality/risk/recommendation remains authoritative decision support and must be shown with its limitations. Stage 13 must not silently promote an Ineligible, Uncertain, Not Evaluated, or Degraded opportunity to actionable eligibility. Controls must reflect the eligibility/recommendation matrix below; uncertainty must lead to clear verification or evaluation requirements, not a misleading Apply path.

3. **How should user intent and action completion be distinguished? — D: Separate intent, product-recorded result, and externally confirmed result.** Record the user's explicit intent separately from whether the app saved the record, opened an external destination, received an external confirmation, or encountered an unresolved/failed outcome. Never claim an external Apply action succeeded merely because the user clicked Apply or an external page was opened.

4. **How should action history and repeated actions behave? — D: An append-oriented, versioned decision record with safe repeat handling.** Preserve meaningful action history and its assessment context; represent changes and reversals explicitly instead of silently overwriting the past. Repeated clicks must not create duplicate external submissions or duplicate logical actions. Durable persistence, lifecycle transitions, and recovery mechanisms are implemented by their owning stages.

5. **How should controls communicate decisions and outcomes? — D: Accessible, evidence-aware, low-friction controls with explicit feedback.** Present action labels, consequences, required verification, risk acknowledgements, save/pass effects, and action outcomes in plain language. Use proportionate confirmation for consequential or potentially irreversible actions; do not burden routine reversible actions with unnecessary friction. Preserve the user's ability to review evidence before acting.

These decisions preserve the existing user journey and locked responsibilities. They define the contract, not the final visual styling or a claim that controls have been implemented.

## 4. Inputs and authority boundaries

Stage 13 consumes without re-deriving or mutating:

- **Stage 7:** authoritative eligibility state, hard-constraint reasons, and unresolved requirements.
- **Stage 8:** semantic fit findings and their uncertainty.
- **Stage 9:** score state, dimensions, limitations, comparability, and score qualification/withholding reasons.
- **Stage 10:** rank/group context, ranking rationale, tie-breakers, and comparability limits.
- **Stage 11:** opportunity intelligence, claims, evidence/provenance references, knowledge states, and unresolved questions.
- **Stage 12:** canonical quality state, risk records, recommendation state, rationale, eligibility-matrix disposition, verification steps, and policy/version/audit references.
- **Stage 5/6:** evidence lineage and canonical opportunity identity.
- **Current user/profile/Hunt context:** the context against which the opportunity was assessed, subject to Stage 17's privacy/access rules.

If upstream inputs are missing, stale, conflicting, or degraded, Stage 13 must disclose the relevant limitation and select a safe control state. It must not invent missing assessments or substitute a fresh-looking interface for missing evidence.

## 5. Canonical action registry

### Apply

**Meaning:** The user explicitly chooses to pursue the opportunity or proceed to the supported application step.

- Require a valid, current opportunity identity and the current eligibility/action-policy state.
- Apply is not the same as recommendation, and is not proof of application submission.
- The product may open a verified application destination or invoke a later Stage 19 integration. Stage 13 records the user's intent and the observed handoff result; it cannot assert external completion without confirmation from the responsible integration.
- If the application destination is unavailable, untrusted, or unresolved, communicate that limitation and offer an appropriate Verify path rather than implying success.
- For a material risk acknowledgement, preserve the specific risk/policy context acknowledged. An acknowledgement must not erase the risk or rewrite Stage 12's recommendation.

### Save

**Meaning:** The user explicitly keeps the opportunity for later review.

- Preserve the canonical opportunity identity and the assessment snapshot/context that was visible when saved.
- Saving is not endorsement, eligibility confirmation, or an application.
- A later material change in opportunity data or assessment must be visible as changed/stale context, not silently represented as the original state.
- Duplicate Save interactions should be safely idempotent at the logical-record level while preserving meaningful save/unsave history where supported.

### Pass

**Meaning:** The user explicitly declines to continue considering the opportunity in the current decision context.

- Record Pass as a user decision, not as a system quality verdict or proof the opportunity is bad.
- Preserve the reason only when the user provides it or a separately defined policy legitimately supplies it; never fabricate a reason.
- Provide a clear, proportionate way to reverse or revisit the decision when product policy allows.
- Passing does not train or alter the matching model in Stage 13; Stage 14 owns feedback/learning semantics.

### Verify

**Meaning:** The user chooses to resolve a specific material uncertainty before deciding whether to proceed.

- Identify the claim, requirement, risk, stale item, conflict, or missing evidence to verify and why it matters.
- Preserve the verification question and source/evidence references. Do not imply verification occurred merely because the user selected Verify.
- Record verification status distinctly, such as **Requested**, **In progress**, **Evidence added / awaiting reassessment**, **Resolved by authorized reassessment**, or **Blocked / unresolved**. These are Stage 13 action-tracking states, not replacements for Stage 5 knowledge states or Stage 7 eligibility states.
- New evidence must enter through the relevant discovery/evidence path and be evaluated by its owning stages. Stage 13 cannot directly turn Unknown into Verified or change Stage 7 eligibility.
- After new evidence is assessed, show the refreshed upstream state/version and invite a new user decision when appropriate.

## 6. Binding action-availability policy

Eligibility remains the authoritative hard gate. Recommendation is a separate quality/risk decision-support output. Action availability must be derived from both, using a versioned policy; the UI must never infer eligibility from score, rank, quality, or recommendation wording.

| Stage 7 eligibility | Stage 12 recommendation / condition | Stage 13 control behavior |
|---|---|---|
| **Eligible** | **Proceed to user review**, with required quality and risk conditions satisfied | Apply may be offered normally, alongside Save, Pass, and relevant Verify controls. The UI still makes no guarantee of external submission. |
| **Eligible** | **Verify before proceeding** or a material verification requirement remains open | Make Verify the clear next step. Do not present an unqualified Apply path. Re-evaluate/review the applicable evidence and policy before restoring normal Apply availability. |
| **Eligible** | **Consider cautiously** with disclosed, non-hard-stop concerns | Apply may be available only with clear presentation of material concerns and proportionate explicit acknowledgement when policy requires it. Acknowledgement does not change the assessment. |
| **Eligible** | **Not recommended under current evidence** | Do not silently treat this as a positive recommendation. Default to Verify/review and show the substantiated basis. If a documented policy permits a user override for this eligible case, require an explicit, informed override and preserve the recommendation and acknowledgement; never use an override to bypass Stage 7 eligibility or a binding hard-stop. Otherwise withhold Apply. |
| **Eligible** | **Recommendation withheld**, or quality is Insufficient evidence, Not assessable, or Assessment degraded | Withhold the ordinary Apply path pending the required evidence, assessment, or recovery. Explain what is missing and offer Verify/retry where supported. Save and Pass remain available if their own preconditions are met. |
| **Ineligible** | Any Stage 12 state | Do not offer an Apply action that implies the opportunity is eligible. Keep the Stage 7 reason visible. Save/Pass may remain available; Verify may be offered to collect information, but it cannot imply eligibility changes until Stage 7 performs a new evaluation. |
| **Uncertain** | Any compatible Stage 12 state | No Apply path that implies confirmed eligibility. Make the unresolved constraint and Verify/evaluation path explicit. Only Stage 7 may resolve eligibility. |
| **Not Evaluated** | Any Stage 12 state | Withhold Apply pending a valid eligibility evaluation. Disclose the missing evaluation; do not label the opportunity Ineligible. |
| **Degraded** | Any Stage 12 state | Withhold Apply pending recovery and valid re-evaluation. Disclose the operational limitation; do not turn a technical failure into a negative business verdict. |

Save, Pass, and Verify do not themselves authorize the opportunity, clear a hard constraint, or guarantee an outcome. A user interface must distinguish **unavailable because of a policy gate**, **unavailable because data/evaluation is incomplete**, and **available but requiring acknowledgement**. All availability decisions must be traceable to the eligibility state, recommendation state, and policy version.

## 7. Decision record and action lifecycle

For each meaningful user action, the action record contract includes, as applicable:

- stable action/decision identifier and canonical opportunity identifier;
- action type: Apply, Save, Pass, or Verify;
- explicit user-intent event and timestamp;
- relevant user/session reference under Stage 17 access and privacy policy;
- current assessment snapshot/version references, including eligibility, fit/score, rank, quality, risk, recommendation, and evidence/provenance references needed to explain the decision;
- action-policy version and any acknowledgement/confirmation record;
- requested, locally recorded, externally launched, externally confirmed, failed, blocked, or unknown outcome as applicable;
- external destination/integration reference only where provided by an authorized Stage 19 integration;
- verification question/status for Verify actions;
- user-supplied reason or notes only when voluntarily supplied and handled under Stage 17 policy;
- history/reversal linkage and an audit reference.

Do not store secrets or unnecessary sensitive personal information in the action record. Stage 17 defines privacy, retention, access, and credential protection. Stage 18 defines operational analytics and observability. Stage 19 defines integrations and production persistence. Stage 15 defines opportunity lifecycle; Stage 16 defines cross-system failure/recovery.

### State separation

Keep these concepts distinct:

- **User intent:** what the user explicitly chose.
- **Action record status:** whether the product successfully recorded that choice.
- **External execution status:** what a supported external system actually confirmed.
- **Opportunity assessment state:** the upstream evidence/eligibility/score/quality/risk/recommendation state.
- **Verification status:** the progress of a user-requested verification task.
- **Lifecycle status:** the broader opportunity lifecycle owned by Stage 15.

One state must never be inferred solely from another. For example, Apply intent is not an application submission; Save is not endorsement; Pass is not a system rejection; Verify requested is not evidence verified.

## 8. Idempotency, reversals, and stale context

- Prevent double-clicks, retries, and network replays from creating duplicate logical actions or duplicate external side effects.
- Use a stable idempotency key for any action that may trigger an external side effect; Stage 19 owns provider-specific execution guarantees.
- Do not silently overwrite earlier decisions. Represent meaningful changes, reversals, and new decisions as linked events or versioned records.
- Before consequential action, detect material change to opportunity identity, eligibility, risk, recommendation, or evidence freshness. If context changed, refresh or disclose it and require review/confirmation under policy.
- If action recording or external execution has an unknown result, show **status unknown / check before retrying** rather than prompting a blind repeat that could duplicate an external submission.
- If the product cannot persist the decision, do not display a false success state. Follow Stage 16 recovery policy when implemented.
- Do not claim durable storage, retry safety, external confirmation, or recovery behavior until implemented and tested by the owning stages.

## 9. UX, accessibility, and trust requirements

- Present the opportunity's relevant evidence, eligibility, fit/score limitations, rank context, quality, material risks, recommendation, and unresolved verification questions before or alongside consequential actions.
- Keep fact, inference, uncertainty, recommendation, user intent, and action result visually and semantically distinct.
- Use precise verbs and clear consequence language. Never make a button's label promise more than the action can confirm.
- Use clear disabled/unavailable reasons; do not rely on color alone.
- Make all actions usable with keyboard and assistive technology, with understandable focus order, accessible names, visible focus, and announced success/error/unknown states.
- Confirm consequential or potentially irreversible actions proportionately. Avoid needless confirmation for routine reversible Save/Pass behavior.
- Provide clear success, blocked, failed, and unknown-result feedback. Do not use a success message before the relevant layer confirms success.
- Keep the interaction mobile-first and low-friction, consistent with the product's premium teal/black direction, while preserving readability and evidence transparency. Visual styling is not a substitute for the behavioral contract.
- Respect Stage 17 authorization, privacy, retention, and secret handling; do not expose internal infrastructure credentials or privileged action data.

## 10. Stage boundaries

- **Stages 1–6:** product constitution, journey/domain contracts, discovery, evidence, and normalization remain authoritative for their data and semantics.
- **Stage 7:** sole owner of eligibility evaluation and hard-constraint state.
- **Stage 8:** semantic matching and fit findings.
- **Stage 9:** scoring and score-state/comparability.
- **Stage 10:** ranking and prioritization.
- **Stage 11:** opportunity intelligence and evidence-aware presentation.
- **Stage 12:** opportunity quality, risk, and recommendation.
- **Stage 13:** user decision controls, action intent/record contract, immediate action feedback, and decision history semantics.
- **Stage 14:** feedback and learning; Stage 13 records actions but does not train or adapt the matching system.
- **Stage 15:** opportunity lifecycle; Stage 13 does not define the global lifecycle.
- **Stage 16:** failure, degradation, and recovery; Stage 13 exposes truthful states and supplies action context but does not own cross-system recovery.
- **Stage 17:** security, privacy, trust, authorization, retention, and secret handling.
- **Stage 18:** analytics, observability, and quality measurement.
- **Stage 19:** production integration, persistence, and external application/provider execution.
- **Stage 20:** final readiness and launch gate.

## 11. Visual prototype checkpoint — removed

The user has explicitly removed the visual-prototype checkpoint from the project workflow. No standalone visual prototype is required before Stage 14, and Stage 14 architecture may proceed directly from the verified Stage 13 specification and handoff. This does **not** waive the requirement to build and test the complete application during the implementation phase, nor does it authorize calling architecture documents a working UI.

## 12. Failure and exception handling

- **Stale/changed assessment:** disclose material change and require refresh/review before consequential action.
- **Unknown eligibility or evaluation failure:** do not imply Apply is available; preserve the exact state and offer supported verification/recovery.
- **Missing or conflicting evidence:** preserve Stage 5/11 states; do not silently resolve them at action time.
- **Recommendation withheld:** explain the limitation and withhold ordinary Apply until the defined review/reassessment condition is satisfied.
- **Action-record failure:** do not claim the decision was saved; expose the true status and follow Stage 16 recovery.
- **External action uncertainty:** distinguish launch from confirmation; never blindly retry a potentially non-idempotent action.
- **Repeated/replayed action:** prevent duplicate logical records and external side effects using the responsible persistence/integration policy.
- **User reversal:** record the new decision and its relationship to prior action without rewriting the prior event.
- **Access denied or expired session:** defer to Stage 17 security behavior; do not reveal private action details.

## 13. Acceptance checklist

- [x] Stage 13 responsibility and critical-stage rationale are explicit.
- [x] Five assistant-selected decisions are recorded as **D / D / D / D / D** and aligned to Stages 1–12.
- [x] Apply, Save, Pass, and Verify have distinct meanings and contracts.
- [x] Stage 7 eligibility remains authoritative; Stage 13 does not recompute or override it.
- [x] A binding action-availability matrix covers all five eligibility states and Stage 12 recommendation conditions.
- [x] User intent, product-recorded outcome, external confirmation, verification status, and opportunity lifecycle remain distinct.
- [x] Action history, idempotency, reversals, stale context, and unknown results have explicit contract requirements.
- [x] Stage 12 quality/risk/recommendation and evidence limitations are preserved.
- [x] Stage 14–20 boundaries are protected.
- [x] The visual-prototype checkpoint has been removed at the user's explicit direction; Stage 14 may proceed from the verified architecture handoff.
- [x] Handoff contract states what Stage 13 consumes, creates, guarantees, and what Stage 14 receives.
- [x] No implementation, UI completion, persistence, integration, or runtime-test claim is made.

## 14. Architecture review record

Selected decisions: **D / D / D / D / D**. Cross-stage review: **PASS WITH BINDING GUARDRAILS**, conditional on the action-availability matrix and separation of intent from confirmed execution; the previously proposed visual-prototype checkpoint has been removed at the user's direction. This review is at the architecture/documentation level only.

---

**Next stage:** Stage 14 — Feedback & Learning  
**Before Stage 14:** no visual prototype checkpoint is required. Continue the autonomous workflow: define responsibility, select the decisions, cross-check the blueprint, resolve contradictions, specify, verify, and hand off. The user does not need to answer an A/B/C/D questionnaire unless they choose to.


---

## Stage 13 completion and consolidation record

- This document is the authoritative consolidated Stage 13 architecture, including user decision authority, action controls, state transitions, safeguards, boundaries, and the downstream Stage 14 handoff contract.
- Relevant Stage 13 handoff and correction requirements are preserved as part of this stage's authoritative specification; redundant standalone stage-specific documents are excluded from the consolidated architecture.
- This completion records architecture consolidation only. It does not claim that production application code or runtime tests have been completed.


---

## Stage 13 to Stage 14 operational handoff contract (consolidated)

- **What Stage 13 consumes:** Stage 7 eligibility and reasons; Stage 8 findings; Stage 9 score/state/limits; Stage 10 ranking context; Stage 11 intelligence and provenance; Stage 12 quality/risk/recommendation and eligibility-matrix disposition; canonical opportunity identity; current user/Hunt context; versioned action policy.
- **What Stage 13 creates:** explicit Apply/Save/Pass/Verify decision events; action status; assessment-context references; verification tasks/status where requested; acknowledgements and user-supplied reasons when applicable; history/reversal links; truthful immediate feedback; audit/version references.
- **What Stage 13 guarantees:** no eligibility override; no recommendation-as-consent; no click-as-external-success; no Verify-request-as-verified-evidence; no Pass-as-quality-verdict; no Save-as-endorsement; no silent history overwrite; no unjustified duplicate side effects; no fabricated user reason; truthful handling of stale, uncertain, blocked, failed, and unknown action states.
- **What Stage 14 receives:** explicit action records/types; timestamps; current and historical assessment references; eligibility and recommendation context; verification status; confirmed versus unconfirmed external outcomes; reversals; optional user-supplied feedback with provenance/consent metadata; policy and audit references.
