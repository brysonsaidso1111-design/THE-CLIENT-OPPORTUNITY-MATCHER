# Implementation Baseline & Defect Register

**Last audited:** 2026-10-10  
**Scope:** Repository baseline and readiness evidence, including Stage 19 spike candidate  
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
| BASE-001 | Implementation blocker / P1 | Stage 19; release impact Stage 20 | PARTIALLY IMPLEMENTED | The pre-spike baseline had no app source. Candidate PR #29 adds only a minimal App Router page/layout for build validation, not the product journey or protected feature UI. | Continue stage-by-stage implementation only after the remaining Stage 19 security/data compatibility gates pass. The minimal page is a spike harness, not a completed product. |
| BASE-002 | Implementation blocker / P1 | Stage 19; release impact Stage 20 | PARTIALLY IMPLEMENTED | Candidate PR #29 pins exact direct dependencies and its hosted workflow generated a lockfile and passed a clean `npm ci`; the generated lockfile is being committed to the candidate branch. | Verify the committed `package-lock.json` with a fresh clean install on the updated PR head; do not mark dependency closure verified before that run. |
| BASE-003 | Implementation blocker / P1 | Stage 3 and Stage 19; release impact Stage 20 | OPEN — NOT IMPLEMENTED | No database migration files are present, despite a former Stage 20 matrix sentence claiming migrations were implemented. That sentence was corrected in the Stage 20 specification. | Define versioned migrations from the authoritative Stage 3 contracts during the Stage 19 security/data foundation; test migration and recovery behavior. |
| BASE-004 | Verification blocker / P1 | Stage 19; release impact Stage 20 | PARTIALLY IMPLEMENTED / NOT FULLY VERIFIED | Node contract tests exist and 20/20 passed in hosted CI; no database-backed, real session, browser E2E, or full security suite exists yet. | Add database/session/security/E2E coverage under the owning stages and record each environment/mode honestly. |
| BASE-005 | Verification blocker / P1 | Stage 19; release impact Stage 20 | PARTIALLY IMPLEMENTED | GitHub Actions runs the contract harness and the candidate Next.js/OpenNext spike. The generated lockfile must be committed and the complete workflow rerun on the committed lock. | Extend CI with migration/RLS, secret-leak, security, lint, and end-to-end checks as the relevant implementation stages land. |
| DOC-001 | Documentation defect / P2 | Stage 20 | RESOLVED | Stage 20 incorrectly stated that Stage 3 schema migrations were implemented and verified. | Corrected on 2026-10-10: migrations are explicitly NOT IMPLEMENTED / NOT VERIFIED in the current baseline. See the Stage 20 specification and merged PR #24. |

**Important:** BASE-001 through BASE-005 track incomplete implementation/verification, not proof of defective application code. The current candidate includes a minimal spike app and test harness; this is not the finished product.

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


## Additional contract-reconciliation findings — 2026-10-10

| ID | Severity | Owner | Status | Evidence / defect | Required disposition |
|---|---|---|---|---|---|
| DOC-002 | P1 / release-blocking | Stages 2, 3, 17, 19, 20 | Corrected in proposed branch; review required | Earlier authoritative wording described activation keys, automatic Gumroad license/API/webhook verification, and recurring refund/dispute reconciliation, conflicting with the owner-approved manual review flow. | Review the contract-reconciliation branch and verify stale paths are removed before merge. |
| BASE-006 | P1 / release-blocking | Stage 19; release impact Stage 20 | BLOCKED — runtime spike not executable on baseline | Recursive tree and README at `3743878c1c17ab3e7a89b6eb1e8b5c9b58e84c5a` show no `package.json`, lockfile, app source, migrations, automated test suite, or `.github/workflows` CI workflow. | Do not claim the runtime spike passed. Implement the minimal spike harness after contract reconciliation, then run and record real version/command/exit-status evidence. |


## Additional contract-reconciliation findings — 2026-10-10

| ID | Severity | Owner | Status | Evidence / defect | Required disposition |
|---|---|---|---|---|---|
| DOC-002 | P1 / release-blocking | Stages 2, 3, 17, 19, 20 | Corrected in proposed branch; review required | Earlier authoritative wording described activation keys, automatic Gumroad license/API/webhook verification, and recurring refund/dispute reconciliation, conflicting with the owner-approved manual review flow. | Review the contract-reconciliation branch and verify stale paths are removed before merge. |
| BASE-006 | P1 / release-blocking | Stage 19; release impact Stage 20 | BLOCKED — runtime spike not executable on baseline | Recursive tree and README at `3743878c1c17ab3e7a89b6eb1e8b5c9b58e84c5a` show no `package.json`, lockfile, app source, migrations, automated test suite, or `.github/workflows` CI workflow. | Do not claim the runtime spike passed. Implement the minimal spike harness after contract reconciliation, then run and record real version/command/exit-status evidence. |
