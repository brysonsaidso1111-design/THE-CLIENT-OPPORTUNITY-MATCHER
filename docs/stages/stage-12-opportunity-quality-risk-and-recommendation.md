# Stage 12 — Opportunity Quality, Risk & Recommendation Architecture

**Product:** T4L GROWTH™ — THE CLIENT OPPORTUNITY MATCHER™  
**Creator attribution:** by Terrence  
**Repository:** THE-CLIENT-OPPORTUNITY-MATCHER  
**Branch:** main  
**Previous stage:** Stage 11 — Opportunity Intelligence  
**Next stage:** Stage 13 — User Decision & Action Controls  
**Status:** STAGE 12 — COMPLETED (ARCHITECTURE CONSOLIDATED; IMPLEMENTATION NOT CLAIMED)  
**Assistant-selected decision set:** **D / D / C / D / D**

---

## 1. Responsibility and critical-stage designation

Stage 12 evaluates the **quality of the opportunity itself**, identifies and characterizes material risks, and produces a transparent recommendation for the user's consideration. It consumes Stage 11's evidence-aware intelligence and upstream assessments, but independently applies explicit quality and risk criteria. It must not mistake a good fit for a good opportunity, a high rank for low risk, or a recommendation for a user decision.

Stage 12 is a **CRITICAL STAGE** because an unjustified quality verdict or recommendation could steer the user toward a misleading, unsuitable, unsafe, or poorly evidenced opportunity. Its judgments must be traceable, qualified by uncertainty, and reversible when evidence or policy changes.

This is an architecture contract. It does not claim that the assessment engine, UI, production behavior, or runtime tests have been implemented.

## 2. Governing question

**“Given the available evidence, what is the opportunity's substantiated quality, what material risks and unresolved uncertainties affect it, and what next-step recommendation is justified without taking the decision away from the user?”**

Stage 12 supports judgment; it does not guarantee outcomes, certify legitimacy without adequate evidence, execute an action, or replace the user's authority.

## 3. Five architecture decisions and selected answers

The architecture owner selected the following options to preserve the locked Stages 1–11 blueprint and avoid responsibility overlap.

1. **How should opportunity quality be assessed? — D: Explicit multidimensional, evidence-backed quality assessment.** Define quality dimensions and applicability rules explicitly. Assess each dimension against relevant claims, evidence, freshness, provenance, and limitations. Do not use fit score or rank as a substitute for quality, and do not invent numerical weights or thresholds without a separately justified and validated policy.

2. **How should risk be represented? — D: A structured risk register with severity, likelihood/confidence, evidence, and uncertainty separated.** Each material risk records what could go wrong, the supporting evidence or reason for concern, severity, likelihood where supportable, confidence/uncertainty, potential impact, and an appropriate verification or mitigation question. Do not imply a precise probability when evidence cannot support one. A missing risk signal is not proof that no risk exists.

3. **How should incomplete, conflicting, or inapplicable inputs affect assessment? — C: Explicit qualification and controlled abstention.** Preserve Unknown, Conflicting, Stale, Inferred, Unsupported, Incomplete, Not Applicable, Not Evaluated, and Degraded as distinct where relevant. Qualify an assessment or withhold a definitive verdict when a material gap prevents responsible judgment. Missing information is neither automatically negative nor automatically reassuring.

4. **How should recommendation states be expressed? — D: A bounded, evidence-gated recommendation with an explicit non-recommendation state.** Use the locked recommendation vocabulary defined in Section 8: **Proceed to user review**, **Verify before proceeding**, **Consider cautiously**, **Not recommended under current evidence**, and **Recommendation withheld**. These are decision-support outcomes, not user actions or guarantees. Eligibility remains a separate upstream state: an Ineligible opportunity must not be recommended as eligible; Uncertain, Not Evaluated, or Degraded eligibility must remain qualified and cannot be silently promoted to confirmed eligibility. The exact recommendation policy and any hard-stop conditions must be explicit and versioned.

5. **How should the conclusion be explained? — D: Evidence-linked rationale with material risks, counterevidence, confidence, and next verification steps.** Show why the quality assessment and recommendation follow from specific claims and evidence; identify favorable and unfavorable evidence, unresolved questions, assessment limits, and the next useful verification steps. Do not hide contrary evidence or collapse risk, quality, fit, rank, and recommendation into one unexplained score.

These decisions specify architecture and policy requirements; they do not assert that the criteria have been empirically calibrated or validated against outcomes.

## 4. Domain distinctions and authority boundaries

Stage 12 must preserve these distinctions:

- **Fit ≠ opportunity quality.** Fit concerns alignment with the user's requirements and intent; quality concerns the opportunity's substantiated characteristics and credibility.
- **Rank ≠ quality.** Rank expresses relative attention order under Stage 10's policy; it is not evidence of legitimacy or safety.
- **Risk ≠ proof of harm.** A risk may be plausible, evidenced, uncertain, mitigable, or unresolved. State which applies.
- **No identified risk ≠ no risk.** Coverage and evidence limitations must remain visible.
- **Recommendation ≠ user decision or action.** Stage 12 advises; Stage 13 owns user-controlled Apply / Save / Pass / Verify actions; the user remains the final decision-maker.
- **Evidence volume ≠ evidence strength.** Duplicate, derivative, stale, low-quality, or conflicting sources must not inflate confidence merely by count.
- **Unknown ≠ negative; unknown ≠ safe.** Missingness must not be converted into a favorable or unfavorable fact without an explicit, justified policy.
- **Eligibility remains authoritative.** Stage 12 consumes Stage 7's state and reasons; it does not recompute or override hard-constraint evaluation.
- **Assessment ≠ guarantee.** Quality and risk judgments describe the available evidence and policy, not future success, financial return, legitimacy, or outcome certainty.

## 5. Inputs and evidence requirements

Stage 12 consumes, without silently rewriting:

- Stage 11's structured opportunity intelligence, material claims, evidence/source/provenance links, knowledge states, unresolved questions, freshness, and completeness indicators.
- Stage 7's authoritative eligibility state and reason references.
- Stage 8's semantic fit findings and qualifiers.
- Stage 9's score state, dimensions, explanations, uncertainty, comparability, and withholding/qualification reasons.
- Stage 10's rank/group state, ranking rationale, tie-breakers, comparability constraints, and limitations.
- Stage 5/6 evidence lineage, canonical identity, transformations, conflicts, and source freshness.
- Current Hunt/profile context and the applicable, versioned Stage 12 assessment policy.

Every material quality judgment, risk, and recommendation rationale must link to the supporting evidence or explicitly identify the missing evidence. Stage 11's summary is an assembly layer, not a new source of truth. Reuse evidence/provenance references rather than copying claims into unsupported certainty.

## 6. Quality assessment contract

The quality model must be explicit, multidimensional, and suitable to the opportunity type. The policy must define each applicable dimension, its meaning, acceptable evidence, limitations, and how conflicting or missing evidence is handled. The canonical quality model uses these dimension families:

- **Identity and traceability:** whether the opportunity and responsible entity can be identified and independently checked.
- **Evidence and substantiation:** whether important claims are supported by relevant, credible, sufficiently current evidence.
- **Transparency and completeness:** whether material terms, requirements, obligations, costs, and conditions are disclosed sufficiently for evaluation.
- **Internal consistency:** whether material claims and terms conflict with one another or with available evidence.
- **Practical viability and terms:** whether stated requirements, constraints, and conditions are coherent and assessable for this opportunity type.

These are the canonical dimension families; each must be explicitly marked Applicable, Not Applicable, Not Evaluated, or Degraded for a given opportunity. Not Applicable is permitted only when the opportunity type or current brief makes the dimension genuinely irrelevant under policy; missing data is not Not Applicable. A dimension must not be scored when its evidence prerequisites are absent. Do not invent weights, numerical thresholds, universal legitimacy claims, or empirical calibration. Where a defensible overall quality state cannot be produced, return the appropriate insufficient-evidence, not-assessable, or assessment-degraded state with reasons.

### Canonical quality states and minimum entry conditions

- **Substantiated:** material claims and terms needed for the applicable assessment have relevant, traceable, sufficiently current support; no unresolved material contradiction or unassessed critical gap prevents this state. This does not certify legitimacy or guarantee success.
- **Mixed:** evidence supports some material characteristics while meaningful limitations, contradictions, or gaps remain; the assessment can still describe the balance without pretending the gaps are resolved.
- **Material concerns:** one or more material, evidence-linked adverse characteristics or unresolved concerns materially affect the opportunity assessment. The concern must be identified and cross-referenced to a risk record; the label is not itself proof of fraud or harm.
- **Insufficient evidence:** available evidence does not meet the minimum coverage required for a defensible quality conclusion, but the assessment process itself completed.
- **Not assessable:** the applicable quality criteria cannot meaningfully be applied to the available opportunity/context, and this is not merely a missing-data case or execution failure. The reason must be explicit.
- **Assessment degraded:** the assessment could not complete reliably because of provider, processing, or other execution degradation. This is an operational state, not a low-quality verdict.

The state is selected under versioned qualitative entry rules. Numeric weights and empirically calibrated thresholds remain deferred; semantic meanings and minimum conditions do not.


## 7. Risk assessment contract

For each material risk, preserve a structured record with, as applicable:

- risk statement and affected claim/condition;
- category and potential consequence;
- severity, kept distinct from likelihood;
- likelihood only where evidence supports a meaningful estimate; otherwise Unknown/Unassessed;
- evidence/provenance references and contrary evidence;
- confidence and uncertainty;
- freshness and unresolved conflicts;
- whether the risk is confirmed, supported, plausible/inferred, unresolved, stale, or not assessable;
- verification question, possible mitigation, or escalation need;
- policy/version and audit reference.

Do not silently suppress a serious risk because the opportunity scores highly for fit or rank. Do not call an opportunity safe merely because no risk was found. Do not invent a probability, declare fraud, or make a definitive legitimacy judgment without evidence and an authorized policy basis. A high-impact unresolved concern may require a recommendation to verify or withhold recommendation, even when the overall quality assessment is otherwise positive.

## 8. Recommendation policy and decision-support output

Recommendation logic must be explicit, evidence-gated, versioned, and explainable. It should consider the quality assessment, material risk register, eligibility state, evidence coverage, freshness/conflict status, and upstream limitations—but it must not simply map fit score or rank to a recommendation.

The canonical recommendation-state vocabulary is locked as follows. These states are decision-support outcomes, not user actions, attention ranks, or guarantees:

- **Proceed to user review:** permitted only when Stage 7 eligibility is Eligible, the quality state is Substantiated, material evidence coverage is adequate, and no unresolved material risk or contradiction triggers a verification/withholding rule. Means the opportunity is supported for user consideration, not that the user should apply or that success is likely.
- **Verify before proceeding:** used when a material claim, condition, identity, eligibility uncertainty, freshness issue, or risk needs independent confirmation before action. Must name what to verify and why.
- **Consider cautiously:** used only when eligibility is Eligible and evidence supports consideration but meaningful, disclosed non-hard-stop concerns remain. Must not be used to soften or bypass an Ineligible, Uncertain, Not Evaluated, or Degraded eligibility state.
- **Not recommended under current evidence:** a quality/risk recommendation, not a ranking instruction. Use when evidence-backed material concerns or a documented hard-stop policy mean the available evidence does not support recommending this opportunity under the current policy. It must not mean “rank lower,” and it must state whether the basis is an eligibility block, a material risk, or quality evidence. It is not a fraud verdict unless independently established by authorized evidence/policy.
- **Recommendation withheld:** abstention because evidence coverage, unresolved conflicts, stale material evidence, inability to assess, or execution degradation prevents a defensible positive or negative recommendation. It is not equivalent to “Not recommended under current evidence,” and it is not an eligibility result.

### Binding eligibility-to-recommendation matrix

Stage 7 remains the sole authority for eligibility. Stage 12 carries the exact state and reason forward; it never recalculates or overrides it.

| Stage 7 eligibility | Permitted Stage 12 recommendation | Forbidden interpretation / mandatory handling |
|---|---|---|
| **Eligible** | Any of the five states, subject to the state-specific quality, evidence, and risk entry conditions above. | **Proceed to user review** requires Substantiated quality and no unresolved material stop condition. A material verification need requires **Verify before proceeding**. |
| **Ineligible** | **Not recommended under current evidence** with the explicit Stage 7 eligibility reason; or **Recommendation withheld** only when the Stage 12 assessment itself cannot complete, while the Ineligible block remains prominent. | Never use Proceed to user review, Consider cautiously, or Verify before proceeding in a way that implies the hard gate is still open. Verification may be listed as information/audit context, but cannot imply the opportunity becomes eligible without a new Stage 7 evaluation. Do not label the opportunity low quality solely because it is ineligible. |
| **Uncertain** | **Verify before proceeding** when a specific resolvable requirement/constraint needs confirmation; otherwise **Recommendation withheld**. | Never use Proceed to user review, Consider cautiously, or a positive recommendation. Show the unresolved Stage 7 condition and reason. Only Stage 7 may later resolve eligibility. |
| **Not Evaluated** | **Recommendation withheld**, with the missing evaluation and next step disclosed. | Never use Proceed to user review, Consider cautiously, or imply eligibility. Do not treat non-evaluation as a failed requirement or low quality. |
| **Degraded** | **Recommendation withheld**, with the degraded evaluation state and recovery/re-evaluation need disclosed. | Never use Proceed to user review, Consider cautiously, or imply eligibility. A technical failure is not business ineligibility or a negative quality conclusion. |

**Cross-cutting risk rule:** a documented material-risk hard stop prohibits **Proceed to user review** regardless of fit score, rank, or otherwise favorable quality signals. Route to **Verify before proceeding**, **Not recommended under current evidence**, or **Recommendation withheld** according to whether a resolvable verification path, a substantiated adverse basis, or an assessment limitation applies. Risk policy must be versioned and explainable; do not invent numeric thresholds.

### Quality/risk interaction and anti-double-counting

Quality dimensions describe substantiated characteristics of the opportunity; the risk register describes potential adverse consequences, uncertainty, severity, and verification/mitigation needs. The same underlying claim/evidence may be relevant to both only when the two uses answer distinct questions. In that case, both records must cross-reference the same canonical evidence/risk identifiers and explain the separate roles. The system must not count one source, claim, or concern as multiple independent pieces of evidence, apply an undocumented duplicate penalty, or silently double-count it in any future aggregate. Recommendation policy may consider both the quality state and the risk disposition, but must document how overlapping signals are reconciled. No unvalidated weights or numerical aggregation are introduced here.

Recommendation output must include the recommendation state, concise rationale, quality state, material risks, key supporting and contrary evidence, confidence/limitations, unresolved questions, suggested verification steps, upstream states, and policy/version/audit references. Stage 13 owns the action controls and user response.

## 9. Stage boundaries and downstream contract

- **Stage 7:** authoritative hard-constraint eligibility.
- **Stage 8:** semantic compatibility and fit findings.
- **Stage 9:** fit scoring and score-state/comparability semantics.
- **Stage 10:** ranking and prioritization.
- **Stage 11:** evidence-aware intelligence assembly and explanation.
- **Stage 12:** opportunity quality, risk disposition, and recommendation semantics.
- **Stage 13:** user-controlled decisions/actions, including Apply / Save / Pass / Verify.
- **Stage 14:** feedback and learning.
- **Stages 15–20:** lifecycle, failure/recovery, security/privacy/trust, observability, production integration, and final readiness remain in their assigned ownership.

Stage 12 must not execute actions, alter upstream states, learn from outcomes directly, define authentication, expose secrets, or claim production readiness. Stage 16 owns failure/recovery architecture; Stage 17 owns security/privacy/trust; Stage 18 owns observability; Stage 19 owns production integration; Stage 20 owns final launch verification.

## 10. Failure, uncertainty, and change handling

- **Insufficient evidence:** qualify or withhold the quality verdict/recommendation; explain what is missing.
- **Conflicting material claims:** preserve both sides, identify impact, and request verification where needed.
- **Stale evidence:** expose age/freshness limits and avoid presenting the assessment as current without support.
- **Partial discovery/provider degradation:** disclose that coverage may be incomplete; do not treat a partial result set as exhaustive.
- **Unassessed risk dimensions:** mark Not Evaluated or Unknown rather than “no risk.”
- **Assessment execution failure:** return Incomplete/Degraded, not a false low-quality verdict.
- **Policy/model change:** version assessments and preserve the historical policy reference; avoid implying that results under different policies are directly comparable without a declared rule.
- **Material opportunity/profile/Hunt change:** identify the assessment context as changed and refresh/re-evaluate according to policy rather than silently reusing stale recommendations.

Stage 12 defines its own assessment semantics; Stage 16 owns cross-system failure and recovery, and Stage 18 owns operational observability.

## 11. Auditability, privacy, and responsible presentation

- Version quality criteria, risk taxonomy, recommendation policy, and any aggregation rules.
- Retain enough references to reproduce the rationale from the input states, evidence, and policy version.
- Preserve contrary evidence, material uncertainty, and recommendation-withholding reasons.
- Make no unsupported claims of fraud, safety, legitimacy, success probability, or guaranteed benefit.
- Avoid presenting a single composite label as more certain than its weakest material evidence allows.
- Keep output understandable and accessible; distinguish fact, inference, risk, recommendation, and user action in labels and layout.
- Follow Stage 17 privacy, access, retention, and secret-handling requirements; do not create a parallel security policy here.

## 12. Acceptance checklist

- [x] Stage 12 responsibility and critical-stage rationale are explicit.
- [x] Assistant-selected decisions are recorded as **D / D / C / D / D**.
- [x] Cross-stage analysis against the locked Stages 1–11 blueprint is documented.
- [x] Opportunity quality is explicitly distinct from fit score, rank, risk, recommendation, and user decision.
- [x] Stage 7 eligibility is carried forward and never recomputed or overridden.
- [x] Quality dimensions, applicability, evidence requirements, and uncertainty rules are specified without invented weights or calibration.
- [x] Risk severity, likelihood, confidence, evidence, and uncertainty are kept distinct.
- [x] Missing risk evidence is not interpreted as proof of safety.
- [x] Unknown, inferred, conflicting, stale, unsupported, incomplete, not applicable, and degraded states remain distinguishable.
- [x] The canonical quality and recommendation state vocabularies, minimum entry conditions, and Stage 7 eligibility-to-recommendation matrix are locked.
- [x] Quality/risk interaction is defined, with shared evidence cross-referenced and unjustified double-counting prohibited.
- [x] Recommendation is separate from Stage 13 user action and final user authority.
- [x] Material evidence, contrary evidence, provenance, and unresolved questions are retained.
- [x] Partial discovery, stale inputs, conflicts, and assessment failures have explicit handling.
- [x] Policy/versioning, reproducibility, and audit references are required.
- [x] Stage 13 receives the fields needed to present user-controlled Apply / Save / Pass / Verify actions without re-deriving Stage 12 judgments.
- [x] Stage 14–20 responsibilities remain protected.
- [x] The operational handoff contract explicitly states what Stage 12 consumes, creates, guarantees, and what Stage 13 receives.
- [x] No implementation, UI completion, empirical calibration, or runtime-test claim is made.

## 13. Specification review record

The selected decision set is **D / D / C / D / D**. The cross-stage result is **PASS WITH BINDING GUARDRAILS** at the architecture-contract level, conditional on the explicit state semantics, eligibility matrix, and quality/risk anti-double-counting contract defined above. The specification's acceptance checklist has been reviewed against the stated Stage 12 responsibility and locked upstream contracts. This records architectural review only; it does not claim application implementation, numerical validation, production behavior, or runtime tests.

---

**Next stage:** Stage 13 — User Decision & Action Controls  
**Next permitted action:** the architecture owner defines Stage 13 responsibility, independently selects the five decisions that best preserve the locked blueprint, analyzes them against Stages 1–12, resolves contradictions before drafting, and verifies the specification and handoff. The user need not select A/B/C/D answers unless they choose to.


---

## Stage 12 completion and consolidation record

- This document is the authoritative consolidated Stage 12 architecture, including the stage-specific decisions, interfaces, failure cases, separation of responsibilities, and downstream contract.
- Relevant handoff and audit resolutions belong to this authoritative specification; redundant standalone stage documents are not part of the consolidated architecture deliverable.
- This completion records architecture consolidation, not implementation or runtime-test completion.


---

## Stage 12 to Stage 13 operational handoff contract (consolidated)

- **What Stage 12 consumes:** Stage 11 structured intelligence and claim/evidence/provenance references; Stage 7 eligibility; Stage 8 semantic findings; Stage 9 score/state/dimensions/limitations; Stage 10 rank/group/comparability context; Stage 5/6 evidence lineage and canonical opportunity; current Hunt/profile context; applicable policy and version metadata.
- **What Stage 12 creates:** quality assessment and state; applicable dimension findings; structured material-risk register; evidence-linked recommendation state and rationale; supporting/contrary evidence; confidence and limitations; unresolved questions and suggested verification steps; audit/version references.
- **What Stage 12 guarantees:** no eligibility override; no fit/rank-as-quality shortcut; no invented weights/probabilities/calibration; no unsupported legitimacy/safety/outcome claims; no silent conflict resolution; no recommendation-as-user-action; no hidden material uncertainty; a locked quality/recommendation vocabulary and eligibility matrix; no unjustified double-counting of shared evidence.
- **What Stage 13 receives:** quality state and dimension findings; risk records and severity/uncertainty; recommendation state and rationale; supporting and contrary evidence references; eligibility/fit/score/rank context with original limitations; eligibility-matrix disposition; unresolved questions and verification steps; policy/version/audit metadata.
