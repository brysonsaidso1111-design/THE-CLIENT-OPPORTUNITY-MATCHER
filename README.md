# THE CLIENT OPPORTUNITY MATCHER™

**Product:** T4L GROWTH™  
**Purpose:** Evidence-aware discovery, assessment, prioritization, and decision support for freelance client opportunities.

## Repository status

This repository currently contains the **20-stage architecture specifications** under `docs/stages/`. These documents define product behavior, contracts, stage ownership, handoffs, security boundaries, integration requirements, and the final launch gate.

**Architecture documentation is not application implementation.** The current `main` baseline has no application source tree, package manifest/lockfile, automated test suite, database migration files, or CI workflow. Do not describe the application as built, runnable, integrated, tested, or production-ready until those artifacts exist and the relevant checks have actually passed.

## Locked implementation rules

- Preserve the approved 20-stage order, responsibilities, shared contracts, and handoffs. Do not redesign the architecture as a shortcut.
- Build **one coherent application**, not 20 separate applications.
- Follow the engineering cycle: **Inspect → Analyze → Build → Test → Review → Commit → Push → Handoff**.
- Begin implementation with the Stage 19 compatibility spike. Confirm the selected runtime/build path, secure session approach, persistence and user isolation, secret injection, and CI path before full feature coding.
- If the spike exposes a genuine incompatibility, record the evidence and pause for an explicit decision. Do not weaken security or silently replace an approved architectural decision to force a pass.
- Ordinary implementation corrections (such as imports, types, validation, error handling, dependency compatibility, and internal code organization) are allowed when they preserve the approved contracts. Escalate changes to product behavior, shared contracts, security boundaries, data ownership, or the selected technology stack.
- Stage 20 is a release gate, not a claim that implementation or production validation has already passed.

## The 20 authoritative stages

1. Product Definition & System Contract
2. User Journey & Experience Architecture
3. Domain, Data & System Contracts
4. Opportunity Source & Discovery Architecture
5. Evidence & Provenance Architecture
6. Opportunity Normalization & Canonicalization
7. Eligibility & Constraint Evaluation
8. Semantic Matching & Fit
9. Match Scoring & Fit Evaluation
10. Ranking & Prioritization
11. Opportunity Intelligence
12. Opportunity Quality, Risk & Recommendation
13. User Decision & Action Controls
14. Feedback & Learning
15. Opportunity Lifecycle
16. Failure, Degradation & Recovery
17. Security, Privacy & Trust
18. Analytics, Observability & Quality
19. Integration & Production
20. Final Readiness & Launch Gate

Stage-specific GitHub handoff issues are **#1–#12 and #14–#21**. Issue **#13** is the separate cross-stage audit, not Stage 13. The separate Sources-page implementation issue is **#23**.

## Implementation preparation pack

Before feature coding, use the complete [implementation readiness plan](docs/implementation/implementation-readiness-plan.md), [20-stage implementation matrix](docs/implementation/stage-implementation-matrix.md), and [testing, environment, and release evidence plan](docs/implementation/testing-environment-and-release-evidence.md). These documents preserve the existing stage specifications as the source of truth and define the compatibility spike, per-stage outputs/tests, commit grouping, and existing-issue handoff updates.

## Implementation baseline and defect register

The current inventory and open implementation/verification blockers are tracked in [the implementation baseline and defect register](docs/implementation/implementation-baseline-and-defect-register.md). Update it with evidence as artifacts are added; do not record absent files with invented paths or line numbers.

## Evidence and defect reporting

Use explicit status labels in audit reports:

- **IMPLEMENTED** — relevant code/artifact exists.
- **PARTIALLY IMPLEMENTED** — some required behavior exists; list the gap.
- **NOT IMPLEMENTED** — required artifact or behavior is absent.
- **BLOCKED** — cannot proceed because a stated prerequisite is unavailable.
- **VERIFIED** — acceptance criteria passed with named test/check evidence. This is an evidence status, not a synonym for documentation being present.

Track defects with stable IDs such as `BUG-001`, and record severity, owning stage, exact file path and function/line range where applicable, observed and expected behavior, reproduction steps, root cause (only when established), correction, test evidence, and commit/PR. Never invent a file, line number, test result, or root cause.

## Launch discipline

A passing build alone does not prove external services, buyer entitlement, revocation, cross-user isolation, opportunity assessment, recovery, or production operations work. Stage 20 may issue a GO decision only for a specific release candidate supported by the required test, security, integration, observability, recovery, and rollback evidence.

Start with a repository baseline inventory and the Stage 19 compatibility spike. Implement and verify the application incrementally, stage by stage, updating the relevant handoff issue with actual code and test evidence.
