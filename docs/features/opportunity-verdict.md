# Opportunity Verdict — Feature Contract

## Status

Design contract for the Opportunity Verdict experience. This document does not claim that the UI, live discovery, evaluation engine, persistence, or provider integrations are implemented.

## Purpose

Help a user decide what to do with one selected opportunity by presenting a transparent, evidence-grounded explanation. The verdict is a decision-support summary, not a new matching or scoring engine.

Product promise: **Understand the fit, see what is still unknown, and choose a sensible next action.**

## Required inputs

The view may render a full verdict only when it receives the relevant existing, canonical outputs:

- Canonical opportunity record and stable opportunity ID.
- User's active client profile and hard constraints.
- Stage 7 eligibility evaluation, including each constraint's status and supporting evidence.
- Stage 8 fit evaluation and its evidence.
- Stage 9 score/fit evaluation and its explanation, if available.
- Stage 10 rank/priority result, if available.
- Stage 11 opportunity intelligence and evidence/provenance.
- Stage 12 quality, risk, and recommendation assessment.
- Stage 13 action state (Apply, Save, Pass, Verify), where available.

Do not recreate these evaluations in the UI or infer that an upstream stage ran merely because a record exists.

## Verdict sections

1. **Current recommendation** — use only the canonical Stage 12 state:
   - Proceed to user review
   - Verify before proceeding
   - Consider cautiously
   - Not recommended under current evidence
   - Recommendation withheld
2. **What fits** — positive matches supported by traceable evidence.
3. **Conflicts and constraints** — confirmed hard-constraint failures and relevant contradictions, clearly distinguished.
4. **Still unknown** — missing, stale, weak, or unverified facts that materially affect the decision.
5. **Risks and contrary evidence** — grounded concerns, with their source and confidence/limitations where available.
6. **Why this verdict** — concise explanation linked to the existing eligibility, fit, score, ranking, and quality assessments without collapsing them into one number.
7. **Suggested next action** — an explanation-guided suggestion; never execute an external action automatically.

Each factual statement should be traceable to a source/evidence item or a named evaluation result. If source evidence is unavailable, label the information unavailable instead of inventing it.

## Decision integrity rules

- Unknown is not the same as failed, false, or mismatched.
- A failed hard eligibility constraint must not be overridden by a high fit score or rank.
- Eligibility, fit, score, rank, quality, risk, recommendation, and user action are separate concepts; display them as separate concepts.
- A recommendation is not user consent. Never auto-apply, auto-save, auto-pass, or imply an application was submitted.
- Do not describe sample/demo data as live opportunities.
- Do not invent employer facts, opportunity requirements, evidence, sources, confidence, or verification.
- If required upstream assessments are missing or stale, render a clear incomplete state such as **Verdict unavailable — required evaluations are missing**, and identify what is missing. Do not fabricate a verdict.
- If evidence conflicts, show the conflict and withhold a definitive recommendation where the canonical contract requires it.
- A user action must follow the existing Stage 13 controls and state transitions.

## Suggested state model

- **Ready** — required evaluations and evidence are present and current.
- **Incomplete** — one or more required evaluations are absent.
- **Needs verification** — the canonical recommendation or evidence indicates unresolved material facts.
- **Withheld** — the canonical recommendation is withheld or evidence does not support a responsible conclusion.
- **Error** — data could not be loaded; explain the limitation and offer a safe retry where supported.

These are view states, not substitutes for domain evaluation states.

## UI behavior

- Add an **Opportunity Verdict** entry only if it fits the existing navigation architecture.
- The verdict should be tied to a selected opportunity. An empty selection should show a useful empty state rather than example claims presented as real.
- Use progressive disclosure: concise recommendation and key reason first; supporting evidence and unknowns next.
- Preserve source/provenance links where available.
- Support keyboard navigation, visible focus, readable contrast, and responsive layouts.
- Do not require an AI API call simply to render existing canonical evaluation outputs. If explanatory generation is later added, it must be server-side, evidence-constrained, and treated as untrusted until validated.

## Acceptance criteria

1. A selected opportunity can be linked to its verdict without creating a competing matching pipeline.
2. Each displayed fit, conflict, and risk is traceable to evidence or a canonical evaluation.
3. Missing inputs produce an incomplete/withheld state, not a guessed recommendation.
4. Unknown constraints remain unknown and are not rendered as failures.
5. A failed hard constraint remains visible regardless of score or rank.
6. Recommendation labels match the Stage 12 contract exactly.
7. Apply, Save, Pass, and Verify use existing Stage 13 behavior and never imply external completion without confirmation.
8. Demo data is visibly identified as demo/sample data.
9. Tests cover unknown vs failed constraints, hard-failure precedence, missing evaluations, conflicting evidence, and action-state integrity.
10. Build, type checks, and relevant tests pass before the feature is considered ready.

## Implementation boundary

Before implementing the UI, reconcile the local dashboard changes with the repository branch. The currently known local dashboard contains uncommitted work not present in the remote branch. Do not overwrite that work or implement against a stale minimal page. First inspect the current local files and domain contracts, then integrate the verdict view into the actual dashboard.
