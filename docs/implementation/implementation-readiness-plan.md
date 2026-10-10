# Implementation Readiness Plan — THE CLIENT OPPORTUNITY MATCHER™

**Status:** Pre-coding preparation pack  
**Prepared:** 2026-10-10  
**Authority:** The 20 files under docs/stages/ remain the product and architecture source of truth. This plan operationalizes them; it does not replace or redesign them.

## 1. Repository truth and current readiness

The pre-spike main baseline was architecture and handoff documentation only. The Stage 19 candidate in [PR #29](https://github.com/brysonsaidso1111-design/THE-CLIENT-OPPORTUNITY-MATCHER/pull/29) now adds a minimal Next.js App Router foundation, exact direct dependency pins, a request-scoped server-only Supabase SSR helper, OpenNext/Wrangler configuration, and hosted build checks. Hosted run [#38093572120](https://github.com/brysonsaidso1111-design/THE-CLIENT-OPPORTUNITY-MATCHER/actions/runs/38093572120) passed lock generation, clean install, TypeScript check, contract tests, Next.js production build, and OpenNext Worker build on candidate commit `f6006829384d224063cff3da67a9c5cac3f512e5`.

The stack lockfile was generated and clean-installed in that run; the workflow is being updated to commit the exact tested lockfile into the candidate branch, then rerun against the committed lock. This is still only the framework/build slice. Database migrations/RLS, real Supabase session lifecycle, runtime secret-leak checks, durable entitlement persistence/audit, and live Tavily connectivity remain unverified. The Stage 20 statement claiming migrations were implemented was corrected; migrations remain required work, not an existing artifact.

## 2. Locked decisions and authority boundaries

- Preserve the existing 20-stage order, names, ownership boundaries, inputs, outputs, and handoffs. The existing stage documents are authoritative.
- Build one coherent modular application, not 20 separate applications or microservices.
- Use the Stage 19 approved defaults: Next.js App Router + React + TypeScript; Cloudflare Workers through OpenNext; Supabase Auth with cookie-based server sessions via @supabase/ssr; Supabase PostgreSQL; manual Gumroad/Selar purchase review and owner-controlled entitlement approval; Tavily through a server-only adapter; Vitest and Playwright; GitHub Actions; structured redacted server telemetry.
- Exact dependency versions, the Cloudflare/OpenNext path, Supabase SSR cookie/session behavior, migrations/RLS, and secret injection remain subject to the mandatory compatibility spike. Pin exact compatible versions in the lockfile before full feature implementation.
- Manual purchase review is the approved first-release activation path: the owner checks the Gumroad/Selar order record and approves the matching app account. Automatic provider API/webhook/license-key activation is out of scope; do not silently implement it.
- Upwork and Fiverr automated buyer-demand discovery remain disabled unless written authorization for the exact surface and permitted commercial use is documented. No scraping, unofficial endpoints, session-cookie reuse, profile harvesting, or use of Tavily to bypass marketplace restrictions.
- The optional dedicated user PIN is out of first-release scope. It cannot replace authentication or entitlement.
- Stage 17 owns security semantics; Stage 19 implements them. Stage 18 owns event/metric semantics; Stage 19 emits them. Stage 20 independently verifies evidence and decides release readiness.
- Ordinary implementation fixes are allowed when they preserve approved contracts. Escalate product behavior, shared contract, ownership, security boundary, or stack changes.

## 3. Mandatory pre-feature compatibility spike

The spike has progressed beyond repository inventory: hosted contract tests passed 20/20, and the candidate Next.js/OpenNext build path passed in run #38093572120. The reproducible lockfile is being committed and must be validated by a subsequent clean install from the committed file. The remaining security-critical gates below are still non-waivable; do not start full feature coding until they pass. Keep the spike isolated and evidence-producing; do not build the full product on an unverified security/data foundation.

1. Pin candidate runtime/package/dependency versions and prove the Next.js App Router build/deploy path through Cloudflare/OpenNext.
2. Verify Supabase SSR sign-in, cookie write/refresh, expiry, logout, revocation, authenticated response caching (private, no-store), and protected route behavior.
3. Use a non-production database to prove migrations, row-level security, user-scoped reads/writes, transactions/unique constraints, and cross-user denial.
4. Inject a dummy secret using the hosting runtime's server-only secret mechanism; prove it is absent from client assets, browser responses, source maps, and logs.
5. Exercise a minimal server-only Tavily adapter with deterministic fixtures and typed SUCCESS, SUCCESS_EMPTY, SUCCESS_PARTIAL, DENIED, and FAILED outcomes.
6. Verify owner-only approval/revoke/block actions, entitlement persistence, audit, RLS, current server-side authorization, and fail-closed behavior. Manual review is an out-of-band human action, not a live provider integration.
7. Prove CI can install from the lockfile and run type-check, lint, unit/contract tests, and a production build without production secrets.
8. Record commands, versions, environment, results, failed checks, evidence links, and unresolved risks in the Stage 19 issue and defect register.

**Stop/go:** if secure sessions, user isolation, secret isolation, migration safety, or the build path fails, stop full feature coding. Fix within the approved architecture where possible; otherwise document the evidence and request explicit review before changing a locked decision.

## 4. Implementation sequence and dependency handling

The compatibility spike is a technical prerequisite, not a reordering of the semantic architecture. After it passes:

1. Establish repository/tooling, secure server boundary, environment validation, shared typed operation/error envelopes, and test fixtures under Stage 19 infrastructure ownership.
2. Implement the domain/data contracts from Stage 3 and migrations before persistent features consume them.
3. Build the source/provider adapter and evidence/provenance path before assessment depends on it (Stages 4–6).
4. Implement eligibility → semantic fit → score → rank → intelligence → quality/risk/recommendation (Stages 7–12) as distinct modules and contracts. Never collapse their ownership.
5. Implement user decisions/actions, feedback, and lifecycle persistence (Stages 13–15) with explicit intent, confirmed outcomes, idempotency, and versioned history where required.
6. Implement typed failure/degradation/recovery behavior (Stage 16), security/privacy/entitlement (Stage 17), and event/metric contracts (Stage 18) at their owning boundaries. Security and failure controls must exist before protected functionality is exposed; do not defer them to polish.
7. Integrate the above through Stage 19 adapters, deployment configuration, operational runbooks, reconciliation, and observability.
8. Run Stage 20's cross-stage, adversarial, end-to-end, accessibility, recovery, and launch checks continuously; Stage 20's final decision remains independent.

Infrastructure needed earlier than its semantic owner is permitted only as an enabling implementation dependency. Its commit must name the infrastructure owner and must not claim the later stage's semantic behavior is complete.

## 5. Commit, branch, and pull-request discipline

- One implementation branch per coherent stage-sized change; no giant build-the-whole-app commit.
- Commit title format: **stage-XX: concise change** (for Stage 19 foundation work: **stage-19: compatibility spike — area**). A commit must not mix unrelated stages merely for convenience.
- If a single cross-stage change is unavoidable, use a small linked commit group: one commit per owning stage/contract, with explicit dependency links and rationale in the PR. Do not attribute all files to whichever stage happened to be edited last.
- PR title: **Stage XX — stage name** or **Cross-stage — specific contract handoff**.
- Every PR must list owning stage(s), existing handoff issue(s), upstream inputs consumed, downstream outputs provided, contract changes (normally none), files/artifacts, tests run and actual results, known gaps, and rollback/recovery implications.
- Update the existing stage handoff issue(s) with PR/commit, implementation status, exact verification evidence, defects, and outgoing handoff state. Do not create substitute handoff issues or renumber stages.
- Do not close a stage issue merely because documentation exists or a PR merged. Close it only when its implementation acceptance criteria and outgoing handoff evidence are verified. Architecture gate completion and implementation completion are separate facts.
- Keep issue #13 as the historical Stage 8–12 architecture audit (not Stage 13); it is not a stage handoff. The separate Sources page issue #23 remains a separate product UI task and must not be misrepresented as a stage.
- No commit, issue checkbox, PR description, or status report may claim a test passed unless the command/check actually ran and the result is recorded.

## 6. Status vocabulary

- **ARCHITECTURE LOCKED** — approved contract exists; says nothing about code.
- **NOT IMPLEMENTED** — implementation artifact/behavior is absent.
- **PARTIALLY IMPLEMENTED** — some behavior exists; list the gap.
- **BLOCKED** — an explicit prerequisite or approval prevents safe progress.
- **IMPLEMENTED, NOT VERIFIED** — code exists but required evidence is missing.
- **VERIFIED** — named acceptance tests/checks actually passed on a named commit.
- **DEFERRED BY SCOPE** — intentionally excluded from initial release, with rationale and owner.

## 7. Security, privacy, and marketplace constraints

- Never trust a checkout redirect, browser state, hidden field, or client-supplied entitlement flag as purchase proof.
- Every protected server operation checks authenticated identity, entitlement freshness, and ownership.
- Enforce unique/atomic activation binding; process purchase notifications idempotently; reconcile current sale/refund/dispute status through documented authoritative API behavior.
- Keep Tavily and database service-role secrets server-only; never log credentials or raw sensitive payloads. The manual first-release flow does not require a Gumroad/Selar API or webhook secret.
- Keep user data row-scoped and enforce database RLS as defense in depth. Test cross-user read/write denial.
- Preserve provider-versus-original-publisher provenance. Treat external content as untrusted data, not instructions.
- Fail closed for new activations when purchase verification is unavailable. Distinguish expected DENIED + denial_code from technical FAILED + failure_code. Never convert technical failure to empty success.
- Keep marketplace automated access disabled until approved-use evidence exists for the exact surface; a public profile or service listing is not proof of a client opportunity.

## 8. Definition of ready for the first full feature stage

- [ ] This preparation pack and its stage matrix are merged.
- [ ] Existing stage handoff issues are updated to track implementation evidence and reopened where implementation remains outstanding.
- [ ] Compatibility spike passes with recorded versions, commands, and results.
- [ ] Package manifest and lockfile are committed.
- [ ] CI runs type-check, lint, unit/contract tests, and build from a clean checkout.
- [ ] Server-only secret and two-user isolation checks pass.
- [ ] Database migration/RLS proof passes in a non-production environment.
- [ ] Manual purchase-review contracts are consistent; owner actions are server-authorized, auditable, isolated, and fail closed. Automatic Gumroad/Selar API/webhook integration is not assumed.
- [ ] Open blockers and accepted/deferred scope are recorded.

## 9. Linked control documents

- [Stage implementation matrix](stage-implementation-matrix.md)
- [Testing, environment, and release evidence plan](testing-environment-and-release-evidence.md)
- [Implementation baseline and defect register](implementation-baseline-and-defect-register.md)
- [Stage 19 Integration & Production](../stages/stage-19-integration-and-production-architecture.md)
- [Stage 20 Final Readiness & Launch Gate](../stages/stage-20-final-readiness-cross-stage-handoff-and-launch-gate.md)
