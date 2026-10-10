# Implementation Baseline & Defect Register

**Last audited:** 2026-10-10  
**Scope:** Repository baseline and readiness evidence  
**Architecture:** The approved 20-stage sequence is preserved. This register does not authorize an architecture redesign.

## Status definitions

- **NOT IMPLEMENTED** — required artifact or behavior is absent.
- **PARTIALLY IMPLEMENTED** — some required behavior exists; the remaining gap is listed.
- **BLOCKED** — work cannot safely proceed until a stated prerequisite is satisfied.
- **OPEN** — finding is unresolved.
- **RESOLVED** — correction is present and has been re-verified.
- **VERIFIED** — acceptance criteria passed with recorded evidence. Documentation presence alone is not verification.

Do not invent file paths, line numbers, function names, root causes, reproduction steps, or test results. For an absent artifact, record “not present” rather than inventing a path or line.

## Repository baseline findings

| ID | Type / severity | Owning stage | Status | Finding | Evidence / next action |
|---|---|---|---|---|---|
| BASE-001 | Implementation blocker / P1 | Stage 19; release impact Stage 20 | OPEN — NOT IMPLEMENTED | No application source tree is present on the audited `main` baseline. | Implement one coherent application after the Stage 19 compatibility spike. No source file or line can be cited because the source tree is absent. |
| BASE-002 | Implementation blocker / P1 | Stage 19; release impact Stage 20 | OPEN — NOT IMPLEMENTED | No package manifest or dependency lockfile is present. The application build/runtime cannot yet be reproduced from the repository. | Confirm the locked stack in the compatibility spike; add manifest and lockfile only with the chosen implementation. |
| BASE-003 | Implementation blocker / P1 | Stage 3 and Stage 19; release impact Stage 20 | OPEN — NOT IMPLEMENTED | No database migration files are present, despite a former Stage 20 matrix sentence claiming migrations were implemented. That sentence was corrected in the Stage 20 specification. | Define versioned migrations from the authoritative Stage 3 contracts during the Stage 19 security/data foundation; test migration and recovery behavior. |
| BASE-004 | Verification blocker / P1 | Stage 19; release impact Stage 20 | OPEN — NOT VERIFIED | No automated application test suite is present. | Add unit/contract, adapter, security, integration, and end-to-end tests with stage traceability as implementation proceeds. |
| BASE-005 | Verification blocker / P1 | Stage 19; release impact Stage 20 | OPEN — NOT VERIFIED | No CI workflow is present. | Establish reproducible install, lint/type-check/build/test checks once the selected runtime and package manager are pinned. |
| DOC-001 | Documentation defect / P2 | Stage 20 | RESOLVED | Stage 20 incorrectly stated that Stage 3 schema migrations were implemented and verified. | Corrected on 2026-10-10: migrations are explicitly NOT IMPLEMENTED / NOT VERIFIED in the current baseline. See the Stage 20 specification and merged PR #24. |

**Important:** BASE-001 through BASE-005 are implementation/verification blockers, not proof of defective application code. No application code has yet been audited because it is not present in the baseline.

## Runtime / architecture gate

**Required first action:** Stage 19 compatibility spike.

It must establish evidence for:
- selected runtime, package manager, dependency versions, and reproducible build path;
- secure server-side session behavior and authorization boundaries;
- database connectivity, migrations, transactions, and cross-user isolation;
- server-side secret injection without browser/log/source exposure;
- CI checks and deterministic test execution.

If any check fails, record the exact observed error, environment, reproduction steps, and owning contract. Do not weaken Stage 17 security or alter shared contracts silently to make the spike pass.

## Defect entry template

Use a stable ID such as `BUG-001` for each actual code defect.

- **ID / title:**
- **Severity:** P0 / P1 / P2 / P3
- **Status:** OPEN / INVESTIGATING / FIXED / VERIFIED / BLOCKED
- **Owning stage and handoff issue:**
- **Exact repository path:**
- **Function / symbol and line range:** (record only after verifying)
- **Observed behavior:**
- **Expected behavior / contract:**
- **Reproduction steps and environment:**
- **Root cause:** (only after established)
- **Correction / commit / PR:**
- **Regression test added:**
- **Verification command and actual result:**
- **Remaining risk / next owner:**

### Severity guide

- **P0 — Critical:** security boundary bypass, cross-user data exposure, corrupted authoritative state, or release-blocking failure with no safe workaround.
- **P1 — High:** core journey or shared contract broken; no acceptable workaround.
- **P2 — Medium:** bounded behavior, edge case, recovery, or acceptance gap with a safe workaround.
- **P3 — Low:** minor presentation, maintainability, or non-critical polish.

Never mark a defect VERIFIED merely because a change was committed. Verification requires the relevant regression test or an explicitly documented manual check and result.
